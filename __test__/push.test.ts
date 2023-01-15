import pull from '../src/pull'
import push from '../src/push'
import { promises as fs } from 'fs'
import path from 'path'
import testDir from './testDir'

// TODO: 新規ファイルをpostすることを確認
// TODO: ファイルを書き換えたらputされることを確認
// TODO: ファイルを書き換えてmtimeを古くしたらスキップされることを確認

const entryDir: string = path.resolve(testDir, 'tmp',' gimonfu', 'push.test.ts', 'entry');

beforeEach( async () => {
  await fs.rm(entryDir, {recursive: true, force: true});
  await fs.mkdir(entryDir, {recursive: true});
})

// Suppress console.log
jest.spyOn(console, 'log').mockImplementation(() => {})

jest.mock('../src/loadConfig', () => () => ({
  user_id: 'user',
  blog_id: 'blogId',
  api_key: '',
  baseDir: path.resolve(testDir, 'tmp', 'gimonfu', 'push.test.ts')
}))

jest.mock('request-promise-native', () => ( (req: any) => {
  if( req.uri === 'https://blog.hatena.ne.jp/user/blogId/atom/entry' && req.method === 'GET') {
    return fs.readFile( path.resolve( __dirname, 'xml-example', 'entry.xml' ) )
  }
  if( req.uri === 'https://blog.hatena.ne.jp/user/blogId/atom/entry?page=1588813317' && req.method === 'GET') {
    return fs.readFile( path.resolve( __dirname, 'xml-example', 'entry__question__page=1588813317.xml' ) )
  }
}))

test('push-0', async () => {
  await pull({})
  await push({})
})
