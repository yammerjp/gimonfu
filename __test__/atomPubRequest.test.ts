import AtomPubRequest from '../src/atomPubRequest'

import { promises as fs } from 'fs'
import path from 'path'

const request = require('request-promise-native')
jest.mock('request-promise-native')

const readFrom = (fileName: string) => {
  return fs.readFile(path.resolve(__dirname,'atomPubRequest.test',fileName), {encoding: 'utf-8'})
}

const atomPubRequest = new AtomPubRequest('user', 'password', 'blogId')

test('atomPubRequest.fetchs()', async () => {
  request.mockImplementationOnce( () => readFrom('fetchs0.xml') )
  request.mockImplementationOnce( () => readFrom('fetchs1.xml') )
  const articles = await atomPubRequest.fetchs()
  expect( articles.length ).toBe(12)
})

test('atomPubRequest.post()', async () => {
  request.mockImplementationOnce( () => readFrom('post.xml') )
  const article: Article = {
    title: 'title',
    customUrl: 'customUrl',
    text: 'text',
    date: new Date(),
    editedDate: new Date(),
    categories: ['hoge','fuga'],
    id: undefined
  }
  expect( await atomPubRequest.post(article) ).toEqual(expect.anything())
})

test('atomPubRequest.put()', async () => {
  request.mockImplementationOnce( () => readFrom('put.xml') )
  const article: Article = {
    title: 'title',
    customUrl: 'customUrl',
    text: 'text',
    date: new Date(),
    editedDate: new Date(),
    categories: ['hoge','fuga'],
    id: '0123456789'
  }
  expect( await atomPubRequest.put(article) ).toBe(true)
})
