import { parseStringPromise } from 'xml2js'

interface ArticlePage {
  articles: Article[]
  nextPage: string|null
}

const changeLineFeeds = (str: string): string => {
  return str.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
}

const tryEntry2Article = (entry:any): Article  => {
  const id = entry?.id[0].split('-').pop()
  const url = (entry?.link?.find((e:any)=>e?.$?.rel==='alternate')?.$?.href)
  const customUrl = url.match(/^https:\/\/[^\/]+\/entry\/(.+)$/)[1]
  const title = entry?.title[0]
  const date = new Date( entry?.updated[0] )
  const editedDate = new Date(entry['app:edited'])
  const text = changeLineFeeds(entry?.content[0]._)
  const categories = entry?.category?.map((e:any)=>e.$.term) ?? []
  if (
    ![id, customUrl, title, text, ...categories].every(e=> typeof e === 'string')
    || !(date instanceof Date) || isNaN(date.getTime())
    || !(editedDate instanceof Date) || isNaN(editedDate.getTime())
  ) throw new Error('fetched entry is invalid format')
  return { id, customUrl, title, date, editedDate, text, categories }
}

/*
const entry2article = (entry:any): Promise<Article>  => {
  try {
    return Promise.resolve( tryEntry2Article(entry) )
  } catch(e) {
    return Promise.reject(e)
  }
}
*/

const feed2page = (feed: any): string|null => {
  try {
    const nextPageUrl = feed.link.find((e:any)=>e.$.rel==='next').$.href
    return '' + nextPageUrl.match(/\?page=([0-9]+)$/)[1]
  } catch {
    return null
  }
}
const xml2articlesPage = async (xml: string): Promise<ArticlePage> => {
    const { feed } = await parseStringPromise(xml)
    return feed2articles(feed)
}
const  feed2articles = (feed: any): Promise<ArticlePage> => {
  try {
    return Promise.resolve({
      nextPage : feed2page(feed),
      articles : feed.entry.map((e:any) => tryEntry2Article(e))
    })
  } catch(e) {
    return Promise.reject(e)
    // return Promise.reject('Fail to parse xml')
  }
}

export default xml2articlesPage

