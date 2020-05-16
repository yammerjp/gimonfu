import request from 'request-promise-native'
import { xml2articlesPage, xml2article } from './xml2articlesPage'
import article2xml from './article2xml'

type RequestMethod = 'POST'|'GET'|'PUT'

const RequestLimit = 100

class AtomPubRequest {
  private static requestCounter = 0
  private user: string
  private password: string
  private blogId: string
  private get entryBaseUrl(): string {
    return `https://blog.hatena.ne.jp/${this.user}/${this.blogId}/atom/entry`
  }
  constructor(user: string, password: string, blogId: string) {
    this.user = user
    this.password = password
    this.blogId = blogId
  }
  fullUrl(customUrl: string): string {
    return `https://${this.blogId}/${customUrl}`
  }

  private request(urlTail:string, method: RequestMethod,body?: string): Promise<any> {
    if( ++ AtomPubRequest.requestCounter >  RequestLimit) {
      // リクエストを送りすぎないよう制限
      process.exit(1)
    }
    return request({
      uri: this.entryBaseUrl + urlTail,
      method,
      auth: { user: this.user, password: this.password },
      json: false,
      body
    })
  }
  private async fetchPageChain(page: string|null): Promise<Article[]> {
    const urlTail = page === null ? '' : `?page=${page}`
    const xml = await this.request(urlTail, 'GET')
    const { nextPage, articles } = await xml2articlesPage(xml)
    if (nextPage === null) {
      return articles
    }
    return [...articles, ...await this.fetchPageChain(nextPage)]
  }
  /*
  async fetch(id: string): Promise<Article> {
    const xml = await this.request('/'+id, 'GET')
    const { entry } = await parseStringPromise(xml)
    return Promise.resolve( entry2article(entry) )
  }
  */
  fetchs(): Promise<Article[]> {
    return this.fetchPageChain(null)
  }

  async post(article: Article): Promise<Article> {
     const xml = await this.request('', 'POST', article2xml(article) )
     return xml2article(xml)
  }

  async put(article: Article): Promise<Article> {
    if (article.id === undefined) {
      return Promise.reject()
    }
    const xml = await this.request(`/${article.id}`, 'PUT', article2xml(article))
    return xml2article(xml)
  }
}

export default AtomPubRequest

