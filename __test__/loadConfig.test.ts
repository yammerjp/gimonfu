import loadConfig from '../src/loadConfig'
import { promises as fs } from 'fs'

beforeEach( async () => {
  await fs.rmdir('/tmp/gimonfu/loadConfig.test.ts', { recursive: true })
  await fs.mkdir('/tmp/gimonfu/loadConfig.test.ts/entry/2020/05/12', { recursive: true })

  // 実行時のカレントディレクトリをモック
  const spy = jest.spyOn(process, 'cwd')
  spy.mockReturnValue('/tmp/gimonfu/loadConfig.test.ts/entry/2020/05/12')
})

test('loadConfig (invalid) (not exist .gimonfu.json on ancestor directories)', async () => {
  await fs.mkdir('/tmp/gimonfu/loadConfig.test.ts/entry/2020/05/12/descendant', { recursive: true })
  // Create Config file on too deep directory
  await fs.writeFile(
    '/tmp/gimonfu/loadConfig.test.ts/entry/2020/05/12/descendant/.gimonfu.json',
    '{"user_id":"uid", "blog_id": "example.hatenablog.com", "api_key": "api-key-string"}'
  )
  expect( loadConfig() ).rejects.toEqual( expect.anything() )
})

test('loadConfig (invalid) (invalid syntax json)', async () => {
  // Create Config file of invalid syntax
  await fs.writeFile(
    '/tmp/gimonfu/loadConfig.test.ts/.gimonfu.json',
    '{"user_id":"uid", "blog_id": "example.hatenablog.com", "api_key": "api-key-string"'
  )
  expect( loadConfig() ).rejects.toEqual( expect.anything() )
})

test('loadConfig', async () => {
  // Create Config file
  await fs.writeFile(
    '/tmp/gimonfu/loadConfig.test.ts/.gimonfu.json',
    '{"user_id":"uid", "blog_id": "example.hatenablog.com", "api_key": "api-key-string"}'
  )
  expect( await loadConfig() ).toEqual({
    user_id: "uid",
    blog_id: "example.hatenablog.com",
    api_key: "api-key-string",
    baseDir: "/tmp/gimonfu/loadConfig.test.ts"
  })
})

