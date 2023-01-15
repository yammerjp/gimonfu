import pull from '../src/pull'
import { promises as fs } from 'fs'
import path from 'path'
import testDir from './testDir'

// TODO: 全てdownloadするとき以外の test case も追加する。
// TODO: ファイルを書き換えたらスキップされるか
// TODO: ファイルを書き換えてmtimeを古くしたら上書きされるか

const entryDir: string = path.resolve(testDir, 'tmp', 'gimonfu', 'pull.test.ts', 'entry');
beforeEach( async () => {
  await fs.rm(entryDir, {recursive: true, force: true})
  await fs.mkdir(entryDir, {recursive: true})
})

jest.mock('../src/loadConfig', () => () => ({
  user_id: 'user',
  blog_id: 'blogId',
  api_key: '',
  baseDir: path.resolve(testDir, 'tmp', 'gimonfu', 'pull.test.ts')
}))

// Suppress console.log
jest.spyOn(console, 'log').mockImplementation(() => {})


jest.mock('request-promise-native', () => ( (req: any) => {
  if( req.uri === 'https://blog.hatena.ne.jp/user/blogId/atom/entry' && req.method === 'GET') {
    return fs.readFile( path.resolve( __dirname, 'xml-example', 'entry.xml' ) )
  }
  if( req.uri === 'https://blog.hatena.ne.jp/user/blogId/atom/entry?page=1588813317' && req.method === 'GET') {
    return fs.readFile( path.resolve( __dirname, 'xml-example', 'entry__question__page=1588813317.xml' ) )
  }
  if( req.uri === 'https://blog.hatena.ne.jp/user/blogId/atom/entry' && req.method === 'POST') {
    return fs.readFile( path.resolve( __dirname, 'xml-example', 'entry', '26006613566848996.xml' ) )
  }
  if( req.uri === 'https://blog.hatena.ne.jp/user/blogId/atom/entry/26006613566848996' && req.method === 'PUT') {
    return fs.readFile( path.resolve( __dirname, 'xml-example', 'entry', '26006613566848996.xml' ) )
  }
}))

test('pull-all-download', async () => {
  await pull({})

  const sampleDir = path.resolve(__dirname ,'entry-example','entry')

  expect( await fs.readFile(
    path.resolve(entryDir,  'hello-new.md'), {encoding: 'utf-8'}
  )).toBe( await fs.readFile(
    path.resolve(sampleDir, 'hello-new.md'), {encoding: 'utf-8'}
  ))

  expect( await fs.readFile(
    path.resolve(entryDir,  '2010','01','01','000000.md'), {encoding: 'utf-8'}
  )).toBe( await fs.readFile(
    path.resolve(sampleDir, '2010','01','01','000000.md'), {encoding: 'utf-8'}
  ))

  expect( await fs.readFile(
    path.resolve(entryDir,  '2020','05','13','122622.md'), {encoding: 'utf-8'}
  )).toBe( await fs.readFile(
    path.resolve(sampleDir, '2020','05','13','122622.md'), {encoding: 'utf-8'}
  ))

  expect( await fs.readFile(
    path.resolve(entryDir,  '2020','05','13','122148.md'), {encoding: 'utf-8'}
  )).toBe( await fs.readFile(
    path.resolve(sampleDir, '2020','05','13','122148.md'), {encoding: 'utf-8'}
  ))

  expect( await fs.readFile(
    path.resolve(entryDir,  '2020','05','13','122736.md'), {encoding: 'utf-8'}
  )).toBe( await fs.readFile(
    path.resolve(sampleDir, '2020','05','13','122736.md'), {encoding: 'utf-8'}
  ))

  expect( await fs.readFile(
    path.resolve(entryDir,  '2020','05','13','122220.md'), {encoding: 'utf-8'}
  )).toBe( await fs.readFile(
    path.resolve(sampleDir, '2020','05','13','122220.md'), {encoding: 'utf-8'}
  ))

  expect( await fs.readFile(
    path.resolve(entryDir,  '2020','05','07','171242.md'), {encoding: 'utf-8'}
  )).toBe( await fs.readFile(
    path.resolve(sampleDir, '2020','05','07','171242.md'), {encoding: 'utf-8'}
  ))

  expect( await fs.readFile(
    path.resolve(entryDir,  '2020','05','07','171333.md'), {encoding: 'utf-8'}
  )).toBe( await fs.readFile(
    path.resolve(sampleDir, '2020','05','07','171333.md'), {encoding: 'utf-8'}
  ))

  expect( await fs.readFile(
    path.resolve(entryDir,  '2020','05','07','171307.md'), {encoding: 'utf-8'}
  )).toBe( await fs.readFile(
    path.resolve(sampleDir, '2020','05','07','171307.md'), {encoding: 'utf-8'}
  ))

  expect( await fs.readFile(
    path.resolve(entryDir,  '2020','05','06','190022.md'), {encoding: 'utf-8'}
  )).toBe( await fs.readFile(
    path.resolve(sampleDir, '2020','05','06','190022.md'), {encoding: 'utf-8'}
  ))

  expect( await fs.readFile(
    path.resolve(entryDir,  'hello.md'), {encoding: 'utf-8'}
  )).toBe( await fs.readFile(
    path.resolve(sampleDir, 'hello.md'), {encoding: 'utf-8'}
  ))

  expect( await fs.readFile(
    path.resolve(entryDir,  'privateMethodTest-newPath.md'), {encoding: 'utf-8'}
  )).toBe( await fs.readFile(
    path.resolve(sampleDir, 'privateMethodTest-newPath.md'), {encoding: 'utf-8'}
  ))
})
