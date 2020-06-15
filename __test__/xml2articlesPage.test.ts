import { xml2articlesPage } from '../src/xml2articlesPage'
import { promises as fs } from 'fs'
import path from 'path'

const readFrom = (fileName: string) => {
  return fs.readFile(path.resolve(__dirname,'xml2articlesPage.test',fileName), {encoding: 'utf-8'})
}

test('xml2articlePages', async () => {
  const xml = await readFrom('feeds.xml')
  const { nextPage, articles } = await xml2articlesPage(xml)

  expect( nextPage ).toBe('1588812595')

  expect( articles.length ).toBe(10)

  expect( articles[0] ).toEqual({
    title: 'dummy',
    date: new Date('2010-01-01T00:00:00+09:00'),
    editedDate: new Date('2020-05-13T14:27:04+09:00'),
    customUrl: '2010/01/01/000000',
    id: '26006613566848996',
    categories: [],
    text: await readFrom('article0.txt'),
    draft: false,
  })

  expect( articles[1] ).toEqual({
    title: '猫の広告文',
    date: new Date('2020-05-13T12:27:36+09:00'),
    editedDate: new Date('2020-05-13T12:27:36+09:00'),
    customUrl: '2020/05/13/122736',
    id: '26006613566780572',
    categories: [],
    text: await readFrom('article1.txt'),
    draft: false,
  })

  expect( articles[2] ).toEqual({
    title: '星めぐりの歌',
    date: new Date('2020-05-13T12:26:22+09:00'),
    editedDate: new Date('2020-05-13T12:26:22+09:00'),
    customUrl: '2020/05/13/122622',
    id: '26006613566779962',
    categories: [],
    text: await readFrom('article2.txt'),
    draft: false,
  })
  expect( articles[3] ).toEqual({
    title: '雨ニモマケズ HTML埋め込み',
    date: new Date('2020-05-13T12:22:20+09:00'),
    editedDate: new Date('2020-05-13T12:22:20+09:00'),
    customUrl: '2020/05/13/122220',
    id: '26006613566778012',
    categories: [],
    text: await readFrom('article3.txt'),
    draft: false,
  })

  expect( articles[4] ).toEqual({
    title: '雨ニモマケズ',
    date: new Date('2020-05-13T12:21:48+09:00'),
    editedDate: new Date('2020-05-13T12:21:48+09:00'),
    customUrl: '2020/05/13/122148',
    id: '26006613566777790',
    categories: [],
    text: await readFrom('article4.txt'),
    draft: false,
  })

  expect( articles[5] ).toEqual({
    title: 'マスタリングTCPIP 情報セキュリティ',
    date: new Date('2020-05-07T17:13:33+09:00'),
    editedDate: new Date('2020-05-07T17:13:33+09:00'),
    customUrl: '2020/05/07/171333',
    id: '26006613563419672',
    categories: [],
    text: await readFrom('article5.txt'),
    draft: false,
  })

  expect( articles[6] ).toEqual({
    title: 'マスタリングTCPIP 入門',
    date: new Date('2020-05-07T17:13:07+09:00'),
    editedDate: new Date('2020-05-07T17:13:07+09:00'),
    customUrl: '2020/05/07/171307',
    id: '26006613563419525',
    categories: [],
    text: await readFrom('article6.txt'),
    draft: false,
  })

  expect( articles[7] ).toEqual({
    title: 'デザインパターン入門',
    date: new Date('2020-05-07T17:12:42+09:00'),
    editedDate: new Date('2020-05-07T17:12:42+09:00'),
    customUrl: '2020/05/07/171242',
    id: '26006613563419396',
    categories: [],
    text: await readFrom('article7.txt'),
    draft: false,
  })

  expect( articles[8] ).toEqual({
    title: 'Nuxt.js(v2.9.2)とTypeScriptの開発環境を作る。',
    date: new Date('2019-09-27T12:30:00+09:00'),
    editedDate: new Date('2020-05-07T10:01:57+09:00'),
    customUrl: 'NuxtTsV292',
    id: '26006613563261569',
    categories: ["Nuxt.js", "TypeScript"],
    text: await readFrom('article8.txt'),
    draft: false,
  })

  expect( articles[9] ).toEqual({
    title: 'TypeScriptでprivate methodを外部から呼ぶ',
    date: new Date('2019-10-17T11:50:00+09:00'),
    editedDate: new Date('2020-05-07T09:49:55+09:00'),
    customUrl: 'privateMethodTest',
    id: '26006613563256659',
    categories: ["TypeScript", "JavaScript", "テスト"],
    text: await readFrom('article9.txt'),
    draft: false,
  })
})
