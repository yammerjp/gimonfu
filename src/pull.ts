import Compare from './compare'
import startup from './startup'
import AtomPubRequest from './atomPubRequest'
import FileRequest from './fileRequest'

interface Request {
  atomPub: AtomPubRequest
  file: FileRequest
}

interface DownloadResult {
  article: Article
  downloaded: boolean
  message?: string
  error?: DownloadError
}

type DownloadErrorType = 'CONFLICT'
interface DownloadError {
  type: DownloadErrorType
  message: string
}

export default async function (options: ReadOptions) {
  const { atomPubRequest, fileRequest } = await startup()

  const remoteArticles = await atomPubRequest.fetchs()
  const localArticles = await fileRequest.reads(options)

  const results = await Promise.all(
    remoteArticles.map( remoteArticle =>
      downloadNewerArticle(
        remoteArticle,
        remoteArticles,
        localArticles,
        { atomPub: atomPubRequest, file: fileRequest }
  )))

  results.filter( r => r.downloaded ).forEach( result => {
    console.log(result.message)
  })

  results.filter( r => r.error ).forEach( result => {
    console.log( result.error?.message)
  })

  if (!options.allowDelete) {
    return
  }
  const deleteTargets = localArticles.filter( l =>
    !remoteArticles.find( r =>
      r.id === l.id
  ))
  await Promise.all( deleteTargets.map( async article => {
    console.log(`Delete: ${fileRequest.customUrl2filePath(article)}`)
    await fileRequest.delete(article)
  }))
}

const downloadNewerArticle = async (
  remoteArticle: Article,
  remoteArticles: Article[],
  localArticles: Article[],
  request: Request
): Promise<DownloadResult> => {
  const conflictLocalArticle = localArticles.find( local =>
    local.id !== remoteArticle.id && local.customUrl === remoteArticle.customUrl
  )
  if( conflictLocalArticle !== undefined ){
    // Conflict: idの違うファイルが既にローカルに存在する
    return conflictResult( conflictLocalArticle, remoteArticle, request )
  }

  const localArticle = localArticles.find( local =>
    local.id === remoteArticle.id
  )

  if( localArticle === undefined ) {
    await request.file.write(remoteArticle)
    return {
      article: remoteArticle,
      downloaded: true,
      message: `Download: ${request.file.customUrl2filePath(remoteArticle)}${ remoteArticle.draft ? ' (draft)' : '' }`
    }
  }

  const compare = new Compare(localArticle, remoteArticle)
  if(compare.localIsNew() || compare.sameWithoutEditedDate()) {
    return {
      article: remoteArticle,
      downloaded: false
    }
  }

  // Update article
  let messageHead = ''
  if( localArticle.customUrl !== remoteArticle.customUrl ){
    // ファイルが移動していた場合
    await request.file.delete(localArticle)
    messageHead = `${request.file.customUrl2filePath(localArticle)}\n     -> `
  }

  await request.file.write(remoteArticle)
  return {
    article: remoteArticle,
    downloaded: true,
    message: `Update: ${messageHead}${request.file.customUrl2filePath(remoteArticle)}`

  }
}

const conflictResult = (local: Article, remote: Article, request: Request):DownloadResult => ({
  article: remote,
  downloaded: false,
  error: {
    type: 'CONFLICT',
    message: conflictErrorMessage( local, remote, request )
  }
})

const conflictErrorMessage = (local: Article, remote: Article, request: Request):string =>
`Skip to update, because of CONFLICT
 local:  ${request.file.customUrl2filePath(local)}
 remote: ${request.atomPub.fullUrl(remote.customUrl)}
 If you want to overwrite the local file, Please delete it.`
