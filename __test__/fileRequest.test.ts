import FileRequest from '../src/fileRequest'
import { promises as fs } from 'fs'
import path from 'path'
import testDir from './testDir'

// Initialize Directory
const entryDir: string = path.resolve(testDir, 'tmp', 'gimonfu', 'fileRequest.test.ts', 'entry');
(async () => await fs.rm(entryDir, {recursive: true, force: true}));
(async () => await fs.mkdir(entryDir, {recursive: true}));

const fileRequest = new FileRequest(entryDir)
const article: Article = {
  title: 'title-string',
  customUrl: '2020/05/12/today-blog',
  date: new Date('2020-05-12T22:55:00.000Z'),
  editedDate: new Date('2020-05-12T23:55:00.000Z'),
  id: '1234567890',
  categories: [ 'hoge', 'fuga' ],
  text: 'Hello!\nToday is 2020/5/12.\nBye~\n',
  draft: false
}

const articleString = `---
title: title-string
date: 2020-05-12T22:55:00.000Z
categories:
  - hoge
  - fuga
id: "1234567890"
---
Hello!
Today is 2020/5/12.
Bye~
`

test('customUrl2filePath', () => {
  const filePath = fileRequest.customUrl2filePath(article)
  expect(filePath).toBe(path.resolve(testDir, 'tmp', 'gimonfu', 'fileRequest.test.ts', 'entry', '2020', '05', '12', 'today-blog.md'))
});

test('filePath2customUrl', async () => {
  const filePath = path.resolve(testDir, 'tmp', 'gimonfu', 'fileRequest.test.ts', 'entry', 'hoge', 'fuga.md')
  const customUrl = await (fileRequest as any).filePath2customUrl(filePath)
  expect(customUrl).toBe('hoge/fuga')
})

test('(invalid) filePath2customUrl', () => {
  const filePath = path.resolve(testDir, 'out-of-entry-dir', 'tmp', 'gimonfu', 'fileRequest.test.ts', 'entry', 'hoge', 'fuga.md')
  expect(
    (fileRequest as any).filePath2customUrl(filePath)
  ).rejects.toThrowError(`Base directory ${entryDir} does not contain markdown file path ${filePath}`) //toMatch('does not contain markdown file path')
})

test('write/read', async () => {
  // articleオブジェクトをファイルに一度writeしてのちにreadしたとき、内容が一致する
  await fileRequest.write(article)
  const readArticle = await fileRequest.read(path.resolve(testDir, 'tmp', 'gimonfu', 'fileRequest.test.ts', 'entry', '2020', '05', '12', 'today-blog.md'), {})
  expect(readArticle).toEqual(article)
})
