import path from "path"
import AtomPubRequest from './atomPubRequest'
import FileRequest from './fileRequest'
import loadConfig from './loadConfig'

export default async function() {
  const {user_id: user, api_key: password, blog_id: blogId, baseDir} = await loadConfig()
  const entryDir = path.join(baseDir, 'entry')
  return {
    atomPubRequest: new AtomPubRequest(user, password, blogId),
    fileRequest: new FileRequest(entryDir),
  }
}
