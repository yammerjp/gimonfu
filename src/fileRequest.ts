import { loadFront } from 'yaml-front-matter'
import { promises as fs } from 'fs'
import path from 'path'

export default class FileRequest {
  private entryDir: string
  private shadowDir: string
  constructor(entryDir: string, shadowDir: string) {
    this.entryDir = entryDir
    this.shadowDir = shadowDir
  }
  customUrl2filePath(customUrl: string, toShadowFile: boolean): string {
    const parentDir = toShadowFile ? this.shadowDir : this.entryDir
    const customPath = customUrl.replace(/\//g, path.sep)
    return path.join( parentDir, customPath + '.md')
  }
  private filePath2customUrl(filePath: string): Promise<string> {
    const regex = new RegExp( this.entryDir + path.sep + '(.+)\\.md' )
    if(! regex.test(filePath) ) {
      return Promise.reject(`Base directory ${this.entryDir} does not contain markdown file path ${filePath}`)
    }
    const customPath = (filePath.match(regex) as string[])[1]
    const customUrl = customPath.replace(new RegExp(path.sep, 'g'), '/')
    return Promise.resolve(customUrl)
  }
  async read(filePath: string): Promise<Article> {
    const fileString: string = await fs.readFile(filePath, 'utf-8').catch( () => {
      console.error(`Failed to read file ${filePath}`)
      return Promise.reject()
    })
    const {title, date, categories, id, __content: text} = loadFront( fileString )
    return {
      title: title || 'No Title',
      date: (date instanceof Date) ? date : new Date(),
      categories: categories || [],
      text,
      customUrl: await this.filePath2customUrl(filePath),
      id,
      editedDate: (await fs.stat(filePath)).mtime
    }
  }
  async writeIfNewer(article: Article): Promise<boolean> { // ファイルを書き換えたかどうかが戻り値
    const fileString = article2fileString(article)
    if (article.customUrl === null) {
      return Promise.reject('customUrl is null')
    }
    const filePath = this.customUrl2filePath(article.customUrl, false)
    const {mtime} = await fs.stat(filePath).catch( () => ({mtime: new Date(0)}) )
    // ファイルが存在しない(catch)なら、ローカルは最古(1970年)として扱う
    const remoteIsNewer: boolean = article.editedDate.getTime() > mtime.getTime()
    if (!remoteIsNewer) {
      return false
    }
    await fs.mkdir(path.dirname(filePath), {recursive: true})
    return fs.writeFile(filePath, fileString, 'utf-8').then( () => {
       return fs.utimes(filePath, new Date(), article.editedDate)
       // ファイルの更新日時をはてなブログの最終変更日時と一致させる
     }).then(()=>true)
  }
  async write(article: Article, toShadowFile: boolean): Promise<any> {
    const fileString = article2fileString(article)

    if (article.customUrl === null) {
      console.error('customUrl is null')
      process.exit(-1)
    }
    const filePath = this.customUrl2filePath(article.customUrl, toShadowFile)
    await fs.mkdir(path.dirname(filePath), {recursive: true})
    return fs.writeFile(filePath, fileString, 'utf-8').then(
     () => {
       // ファイルの更新日時をはてなブログの最終変更日時と一致させる
       return fs.utimes(filePath, new Date(), article.editedDate)
    })
  }
}

const article2fileString = (article: Article): string => {
  const categoriesString = (article.categories.length === 0) ?
    '' : ['\ncategories:', ...article.categories].join('\n  - ')
  return (
`---
title: ${article.title}
date: ${article.date.toISOString()}${categoriesString}
id: ${article.id}
---
${article.text}`
  )
}
