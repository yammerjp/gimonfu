import { loadFront } from 'yaml-front-matter'
import { promises as fs } from 'fs'
import path from 'path'

export default class FileRequest {
  private baseDir: string
  private dotDir: string
  constructor(baseDir: string) {
    this.baseDir = baseDir
    this.dotDir = path.join(baseDir, '.gimonfu')
  }
  private customUrl2filePathDot(customUrl: string): string {
    const customPath = customUrl.replace(/\//g, path.sep)
    return path.join( this.dotDir, customPath + '.md')
  }
  customUrl2filePath(customUrl: string): string {
    const customPath = customUrl.replace(/\//g, path.sep)
    return path.join( this.baseDir, customPath + '.md')
  }
  private filePath2customUrl(filePath: string): Promise<string> {
    const regex = new RegExp( this.baseDir + path.sep + '(.+)\\.md' )
    if(! regex.test(filePath) ) {
      return Promise.reject(`Base directory ${this.baseDir} does not contain markdown file path ${filePath}`)
    }
    const customPath = (filePath.match(regex) as string[])[1]
    const customUrl = customPath.replace(new RegExp(path.sep, 'g'), '/')
    return Promise.resolve(customUrl)
  }
  async read(filePath: string): Promise<LocalArticle> {
    const fileString: string = await fs.readFile(filePath, 'utf-8').catch( () => {
      console.error(`Failed to read file ${filePath}`)
      return Promise.reject()
    })
    const {title, date, categories, __content: text} = loadFront( fileString )
    return {
      title: title || 'No Title',
      customUrl: await this.filePath2customUrl(filePath),
      text,
      date: (date instanceof Date) ? date : new Date(),
      categories: categories || []
    }
  }
  async writeIfNewer(article: RemoteArticle): Promise<boolean> { // ファイルを書き換えたかどうかが戻り値
    const fileString = article2fileString(article)
    if (article.customUrl === null) {
      return Promise.reject('customUrl is null')
    }
    const filePath = this.customUrl2filePath(article.customUrl)
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
  async writeDot(article: RemoteArticle): Promise<any> {
    const fileString = article2fileString(article)

    if (article.customUrl === null) {
      console.error('customUrl is null')
      process.exit(-1)
    }
    const filePath = this.customUrl2filePathDot(article.customUrl)
    await fs.mkdir(path.dirname(filePath), {recursive: true})
    return fs.writeFile(filePath, fileString, 'utf-8').then(
     () => {
       // ファイルの更新日時をはてなブログの最終変更日時と一致させる
       return fs.utimes(filePath, new Date(), article.editedDate)
    })
  }
}

const article2fileString = (article: LocalArticle): string => {
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
