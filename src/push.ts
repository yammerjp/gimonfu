import Compare from './compare'
import startup from './startup'
import AtomPubRequest from './atomPubRequest'
import FileRequest from './fileRequest'

interface Request {
  atomPub: AtomPubRequest
  file: FileRequest
}

interface UploadResult {
  article: Article
  uploaded: boolean
  error?: UploadError
}

type UploadErrorType = 'CONFLICT' | 'INVALID_ID'

interface UploadError {
  type: UploadErrorType
  message: string
}

export default async function (options: ReadOptions) {
  const { atomPubRequest, fileRequest } = await startup()

  const remoteArticles = await atomPubRequest.fetchs()
  const localArticles = await fileRequest.reads(options)

  const results = await Promise.all(
    localArticles.map( localArticle =>
      uploadNewerArticle(
        localArticle,
        remoteArticles,
        localArticles,
        { atomPub: atomPubRequest, file: fileRequest }
  )))

  results.filter( r => r.uploaded ).forEach( result => {
    console.log(`Upload: ${atomPubRequest.fullUrl(result.article.customUrl)}`)
  })

  results.filter( r => r.error ).forEach( result => {
    console.log(result.error?.message)
  })

}

const uploadNewerArticle = async (
  localArticle: Article,
  remoteArticles: Article[],
  localArticles: Article[],
  request: Request
): Promise<UploadResult> => {

  const conflictRemoteArticle = remoteArticles.find( remote =>
    remote.id !== localArticle.id && remote.customUrl === localArticle.customUrl
  )
  if( conflictRemoteArticle !== undefined ){
    return conflictResult( localArticle, conflictRemoteArticle, request )
  }

  if( localArticle.id === undefined ){
    const newArticle = await request.atomPub.post(localArticle)
    await request.file.delete(localArticle)
    await request.file.write(newArticle)
    return { article: newArticle, uploaded: true }
  }

  const remoteArticle = remoteArticles.find( remote =>
    remote.id === localArticle.id
  )
  if( remoteArticle === undefined ) {
    return invalidIdResult( localArticle, request )
  }

  const compare = new Compare(localArticle, remoteArticle)
  if(compare.remoteIsNew() || compare.sameWithoutEditedDate()) {
    return { article: localArticle, uploaded: false }
  }

  const newArticle = await request.atomPub.put(localArticle)
  await request.file.delete(localArticle)
  await request.file.write(newArticle)
  return { article: newArticle, uploaded: true }
}

const conflictErrorMessage = ( localPath: string, url: string ): string =>
`Skip to upload/update, because of CONFLICT
 local:  ${localPath}
 remote: ${url}
 If you want to overwrite the remote article, Please delete it.`


const invalidIdErrorMessage = (localPath: string): string =>
`Skip to update, because of invalid id
 local:  ${localPath}
 If you want to upload the local file, Please delete id in the file's front-matter.`

const conflictResult = (
  local: Article,
  remote: Article,
  request: Request
): UploadResult => ({
  article: local,
  uploaded: false,
  error: {
    type: 'CONFLICT',
    message: conflictErrorMessage(
      request.file.customUrl2filePath(local.customUrl),
      request.atomPub.fullUrl(remote.customUrl)
    )
  }
})

const invalidIdResult = (
  local: Article,
  request: Request
): UploadResult => ({
  article: local,
  uploaded: false,
  error: {
  type: "INVALID_ID",
    message: invalidIdErrorMessage(request.file.customUrl2filePath(local.customUrl))
  }
})
