import path from "path"
import AtomPubRequest from './atomPubRequest'
import FileRequest from './fileRequest'
import loadConfig from './loadConfig'

const startup = async () => {
  const {user_id: user, api_key: password, blog_id: blogId, baseDir} = await loadConfig()
  const entryDir = path.join(baseDir, 'entry')
  return {
    atomPubRequest: new AtomPubRequest(user, password, blogId),
    fileRequest: new FileRequest(entryDir),
  }
}

export default function () {
  return startup().catch( e => {
    console.error(e)
    process.exit(-1)
  })
}
