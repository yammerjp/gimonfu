import Compare from './compare'
import startup from './startup'
import AtomPubRequest from './atomPubRequest'
import FileRequest from './fileRequest'

export default async function (options: ReadOptions) {
  const { atomPubRequest, fileRequest } = await startup()

  const remoteArticles = await atomPubRequest.fetchs()
  const localArticles = await fileRequest.reads(options)

  await Promise.all(
    remoteArticles.map( remoteArticle =>
      downloadNewerArticle(
        remoteArticle,
        remoteArticles,
        localArticles,
        atomPubRequest,
        fileRequest
  )))
}

const downloadNewerArticle = async (
  remoteArticle: Article,
  remoteArticles: Article[],
  localArticles: Article[],
  atomPubRequest: AtomPubRequest,
  fileRequest: FileRequest
) => {
  const conflictLocalArticle = localArticles.find( local =>
    local.id !== remoteArticle.id && local.customUrl === remoteArticle.customUrl
  )
  if( conflictLocalArticle !== undefined ){
    // Conflict: idの違うファイルが既にローカルに存在する
    console.log(`Skip to update, because of CONFLICT`)
    console.log(` local:  ${fileRequest.customUrl2filePath(conflictLocalArticle.customUrl)}`)
    console.log(` remote: ${atomPubRequest.fullUrl(remoteArticle.customUrl)}`)
    console.log(` If you want to overwrite the local file, Please delete it.`)
    return
  }

  const localArticle = localArticles.find( local =>
    local.id === remoteArticle.id
  )

  if( localArticle === undefined ) {
    // Download new article
    await fileRequest.write(remoteArticle)
    console.log(`Download: ${fileRequest.customUrl2filePath(remoteArticle.customUrl)}`)
    return
  }

  const compare = new Compare(localArticle, remoteArticle)
  if(compare.localIsNew() || compare.sameWithoutEditedDate()) {
    return
  }

  // Update article
  let messageHead = ''
  if( localArticle.customUrl !== remoteArticle.customUrl ){
    // ファイルが移動していた場合
    await fileRequest.delete(localArticle)
    messageHead = `${fileRequest.customUrl2filePath(localArticle.customUrl)}\n     -> `
  }

  await fileRequest.write(remoteArticle)
  console.log(`Update: ${messageHead}${fileRequest.customUrl2filePath(remoteArticle.customUrl)}`)
}
