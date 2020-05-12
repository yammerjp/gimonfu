import FileRequest from '../src/fileRequest'

test('basic', () => {
  const entryDir = '/home/username/blog/entry'
  const fileRequest = new FileRequest(entryDir, '/home/username/blog/.gimonfu')

  expect(fileRequest.customUrl2filePath('hoge/huga',false)).toBe( entryDir + '/hoge/huga.md')
});

