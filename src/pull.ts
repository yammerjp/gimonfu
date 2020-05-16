const { program } = require('commander')
const packageJson = require('../package.json')
import path from "path"
import AtomPubRequest from './atomPubRequest'
import FileRequest from './fileRequest'
import FileList from './fileList'
import loadConfig from './loadConfig'
import Compare from './compare'

const pull = async (atomPubRequest: AtomPubRequest, fileRequest: FileRequest) => {
  const remoteArticles = await atomPubRequest.fetchs()
  const localArticles = await fileRequest.reads()

  remoteArticles.forEach( async remoteArticle => {
    const localArticle = localArticles.find( local =>
      local.id === remoteArticle.id
    )

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
  })
}

export default pull

