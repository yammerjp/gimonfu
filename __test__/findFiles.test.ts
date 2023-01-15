import findFiles from '../src/findFiles'
import path from 'path'

test('findFiles',  async () => {
  const entryDir = path.resolve(__dirname, '..', 'example', 'entry' )
  const filesUnsorted = await findFiles(entryDir)

  expect(filesUnsorted.length).toBe(14)
  expect(filesUnsorted)
    .toEqual(expect.arrayContaining( [
      path.resolve(entryDir,'hello-new.md'),
      path.resolve(entryDir,'2010','01','01','000000.md'),
      path.resolve(entryDir,'NuxtTsV292.md'),
      path.resolve(entryDir,'2020','05','13','122622.md'),
      path.resolve(entryDir,'2020','05','13','122148.md'),
      path.resolve(entryDir,'2020','05','13','122736.md'),
      path.resolve(entryDir,'2020','05','13','122220.md'),
      path.resolve(entryDir,'2020','05','07','171242.md'),
      path.resolve(entryDir,'2020','05','07','171333.md'),
      path.resolve(entryDir,'2020','05','07','171307.md'),
      path.resolve(entryDir,'2020','05','06','190022.md'),
      path.resolve(entryDir,'hello.md'),
      path.resolve(entryDir,'privateMethodTest-newPath.md'),
      path.resolve(entryDir,'draft.md')
    ]))
})
