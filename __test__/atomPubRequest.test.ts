import AtomPubRequest from '../src/atomPubRequest'
import { promises as fs } from 'fs'
import path from 'path'

jest.mock('request-promise-native', () => ( (req: any) => {
  if( req.uri === 'https://blog.hatena.ne.jp/user/blogId/atom/urlTail' ) {
    return 'dummy-xml-string'
  }
  if( req.uri === 'https://blog.hatena.ne.jp/user/blogId/atom/entry' && req.method === 'GET') {
    return fs.readFile( path.resolve( __dirname, 'xml-example', 'entry.xml' ) )
  }
  if( req.uri === 'https://blog.hatena.ne.jp/user/blogId/atom/entry?page=1588813317' && req.method === 'GET') {
    return fs.readFile( path.resolve( __dirname, 'xml-example', 'entry?page=1588813317.xml' ) )
  }
  if( req.uri === 'https://blog.hatena.ne.jp/user/blogId/atom/entry' && req.method === 'POST') {
    return fs.readFile( path.resolve( __dirname, 'xml-example', 'entry', '26006613566848996.xml' ) )
  }
  if( req.uri === 'https://blog.hatena.ne.jp/user/blogId/atom/entry/26006613566848996' && req.method === 'PUT') {
    return fs.readFile( path.resolve( __dirname, 'xml-example', 'entry', '26006613566848996.xml' ) )
  }
}))


const atomPubRequest = new AtomPubRequest('user','password','blogId')

test('request', async () => {
  const res = (atomPubRequest as any).request('/urlTail', 'GET', undefined)
  expect(res).toBe('dummy-xml-string')
})

test('fetchPageChain', async () => {
  const articles = await (atomPubRequest as any).fetchPageChain(null)

  expect(
    JSON.stringify(articles)
  ).toBe(
    JSON.stringify( require('./atomPubRequest.test/articles.json') )
  )

})

test('fetchs', async () => {
  const articles = await atomPubRequest.fetchs()

  expect(
    JSON.stringify(articles)
  ).toBe(
    JSON.stringify( require('./atomPubRequest.test/articles.json') )
  )
})

const article =  {
  "id": "26006613566848996",
  "customUrl": "2010/01/01/000000",
  "title": "dummy",
  "date": new Date("2009-12-31T15:00:00.000Z"),
  "editedDate": new Date("2020-05-13T05:27:04.000Z"),
  "text": "dummy\n",
  "categories": [],
  "draft": false
}

test('fullUrl', () => {
  expect( atomPubRequest.fullUrl(article) ).toBe('https://blogId/2010/01/01/000000')
})

test('post', async () => {
  const { id, title, customUrl, date, editedDate, text, categories, draft } = article
  const sendArticle = {
    title, customUrl, date, editedDate, text, categories, draft,
    id: undefined
  }
  const responsedArticle = await atomPubRequest.post(sendArticle)
  expect( responsedArticle ).toEqual(article)
})
test('put', async () => {
  const responsedArticle = await atomPubRequest.put(article)
  expect( responsedArticle ).toEqual(article)
})
