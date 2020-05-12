import FileRequest from '../src/fileRequest'
import { promises as fs } from 'fs'

// Initialize Directory
const entryDir: string = '/tmp/gimonfu-test/entry';
(async () => await fs.rmdir(entryDir, {recursive: true}));
(async () => await fs.mkdir(entryDir, {recursive: true}));

const fileRequest = new FileRequest(entryDir)

const article: Article = {
  title: 'title-string',
  customUrl: '2020/05/12/today-blog',
  date: new Date('2020-05-12T22:55:00.000Z'),
  editedDate: new Date('2020-05-12T23:55:00.000Z'),
  id: '1234567890',
  categories: [ 'hoge', 'fuga' ],
  text: 'Hello!\nToday is 2020/5/12.\nBye~\n'
}

const articleString = `---
title: title-string
date: 2020-05-12T22:55:00.000Z
categories:
  - hoge
  - fuga
id: 1234567890
---
Hello!
Today is 2020/5/12.
Bye~
`

test('customUrl2filePath', () => {
  const customUrl = 'hoge/fuga'
  const filePath = fileRequest.customUrl2filePath(customUrl)
  expect(filePath).toBe('/tmp/gimonfu-test/entry/hoge/fuga.md')
});

test('filePath2customUrl', async () => {
  const filePath = '/tmp/gimonfu-test/entry/hoge/fuga.md'
  const customUrl = await (fileRequest as any).filePath2customUrl(filePath)
  expect(customUrl).toBe('hoge/fuga')
})


test('(invalid) filePath2customUrl', () => {
  const filePath = '/out-of-entry-dir/tmp/gimonfu-test/entry/hoge/fuga.md'
  expect(
    (fileRequest as any).filePath2customUrl(filePath)
  ).rejects.toMatch('Base directory /tmp/gimonfu-test/entry does not contain markdown file path /out-of-entry-dir/tmp/gimonfu-test/entry/hoge/fuga.md') //toMatch('does not contain markdown file path')
})

test('write/read', async () => {
  // articleオブジェクトをファイルに一度writeしてのちにreadしたとき、内容が一致する
  await fileRequest.write(article)
  const readArticle = await fileRequest.read('/tmp/gimonfu-test/entry/2020/05/12/today-blog.md')
  expect(readArticle).toEqual(article)
})

test('article2fileString', () => {
  // access to private method
  const fileString = (fileRequest as any).article2fileString(article)
  expect(fileString).toBe(articleString)
})

