import AtomPubRequest from './atomPubRequest'
import { loadFront } from 'yaml-front-matter'
//import matter = require('gray-matter')
//const yamlFront = require('yaml-front-matter')
import { promises as fs } from 'fs'

const postArticleAsync = async (user: string, password: string, blogId: string, filePath: string, customUrl: string) => {
  const fileString: string = await fs.readFile(filePath, 'utf-8').catch( () => {
    console.error(`Failed to read file ${filePath}`)
    process.exit(1)
  })
  const {title, date, categories, __content: text} = loadFront( fileString )

  const atomPubRequest = new AtomPubRequest(user, password, blogId)
  return atomPubRequest.post({
    title: title || 'No Title',
    customUrl,
    text,
    date: date || new Date() ,
    categories: categories || []
  })
}

export default postArticleAsync

