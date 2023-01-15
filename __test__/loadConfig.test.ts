import loadConfig from '../src/loadConfig'
import { promises as fs } from 'fs'
import path from 'path'
import testDir from './testDir'

test('loadConfig', async () => {
   await fs.rm(path.resolve(testDir, 'tmp', 'gimonfu', 'loadConfig.test.ts'), { recursive: true, force: true })
  await fs.mkdir(path.resolve(testDir, 'tmp', 'gimonfu', 'loadConfig.test.ts', 'entry', '2020', '05', '12'), { recursive: true })

  await fs.writeFile(
    path.resolve(testDir, 'tmp', 'gimonfu', 'loadConfig.test.ts', '.gimonfu.json'),
    '{"user_id":"uid", "blog_id": "example.hatenablog.com", "api_key": "api-key-string"}'
  )

  // 実行時のカレントディレクトリをモック
  const spy = jest.spyOn(process, 'cwd')
  spy.mockReturnValue(path.resolve(testDir, 'tmp', 'gimonfu', 'loadConfig.test.ts', 'entry', '2020', '05', '12'))

  expect( await loadConfig() ).toEqual({
    user_id: "uid",
    blog_id: "example.hatenablog.com",
    api_key: "api-key-string",
    baseDir: path.resolve(testDir, 'tmp', 'gimonfu', 'loadConfig.test.ts')
  })
})

