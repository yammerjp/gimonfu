import request from 'request-promise-native'
import { xml2articlesPage, xml2article } from './xml2articlesPage'
import article2xml from './article2xml'
import { fstat, writeFileSync } from 'fs'

type RequestMethod = 'POST'|'GET'|'PUT'|'DELETE'

const RequestLimit = 100

export default class AtomPubRequest {
  private static requestCounter = 0
  private user: string
  private password: string
  private blogId: string

  constructor(user: string, password: string, blogId: string) {
    this.user = user
    this.password = password
    this.blogId = blogId
  }

  fullUrl(article: Article): string {
    return `https://${this.blogId}/${article.customUrl}`
  }

  private request(urlTail:string, method: RequestMethod,body?: string): Promise<any> {
    if( ++ AtomPubRequest.requestCounter >  RequestLimit) {
      // リクエストを送りすぎないよう制限
      process.exit(1)
    }
    return request({
      uri: `https://blog.hatena.ne.jp/${this.user}/${this.blogId}/atom${urlTail}`,
      method,
      auth: { user: this.user, password: this.password },
      json: false,
      body
    })
  }

  private async fetchPageChain(page: string|null): Promise<Article[]> {
    const urlTail = page === null ? '/entry' : `/entry?page=${page}`
    const xml = await this.request(urlTail, 'GET', undefined)
    const { nextPage, articles } = await xml2articlesPage(xml)
    if (nextPage === null) {
      return articles
    }
    return [...articles, ...await this.fetchPageChain(nextPage)]
  }

  fetchs(): Promise<Article[]> {
    return this.fetchPageChain(null)
  }

  /*
  async fetch(id: string): Promise<Article> {
    const xml = await this.request('/entry/'+id, 'GET')
    const { entry } = await parseStringPromise(xml)
    return Promise.resolve( entry2article(entry) )
  }
  */

  async post(article: Article): Promise<Article> {
    const reqXml = article2xml(article)
    writeFileSync(`/tmp/gimonfu-${Date.now()}.xml`, reqXml)
    console.log(`DEBUG: write to /tmp/gimonfu-${Date.now()}.xml`)
    const xml = await this.request('/entry', 'POST', reqXml )
    return xml2article(xml)
  }

  async put(article: Article): Promise<Article> {
    if (article.id === undefined) {
      return Promise.reject(new Error('atomPubRequest.put is failed because article.id is undefined'))
    }
    const reqXml = article2xml(article)
    writeFileSync(`/tmp/gimonfu-${Date.now()}.xml`, reqXml)
    console.log(`DEBUG: write to /tmp/gimonfu-${Date.now()}.xml`)
    const xml = await this.request(`/entry/${article.id}`, 'PUT', reqXml)
    return xml2article(xml)
  }

  async delete(article: Article): Promise<any> {
     if (article.id === undefined) {
      return Promise.reject(new Error('atomPubRequest.delete is failed because article.id is undefined'))
    }
    await this.request(`/entry/${article.id}`, 'DELETE', undefined)
  }

  async fetchServiceDocuments(): Promise<any> {
    return this.request('', 'GET' , undefined)
  }
}
