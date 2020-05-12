import loadConfig from '../src/loadConfig'
import { promises as fs } from 'fs'

test('loadConfig', async () => {
  await fs.rmdir('/tmp/gimonfu/loadConfig.test.ts', { recursive: true })
  await fs.mkdir('/tmp/gimonfu/loadConfig.test.ts/entry/2020/05/12', { recursive: true })

  await fs.writeFile(
    '/tmp/gimonfu/loadConfig.test.ts/.gimonfu.json',
    '{"user_id":"uid", "blog_id": "example.hatenablog.com", "api_key": "api-key-string"}'
  )

  // 実行時のカレントディレクトリをモック
  const spy = jest.spyOn(process, 'cwd')
  spy.mockReturnValue('/tmp/gimonfu/loadConfig.test.ts/entry/2020/05/12')

  expect( await loadConfig() ).toEqual({
    user_id: "uid",
    blog_id: "example.hatenablog.com",
    api_key: "api-key-string",
    baseDir: "/tmp/gimonfu/loadConfig.test.ts"
  })
})

