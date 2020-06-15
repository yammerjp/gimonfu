import article2xmlString from '../src/article2xml'

test('article2xmlString', () => {
  const article: Article = {
    id: undefined,
    customUrl: 'hoge/fuga',
    title: '新しいタイトル',
    text: '\n    ** 新しい本文\n  ',
    date: new Date('2008-01-01T00:00:00Z'),
    categories: [ 'Scala' ],
    editedDate: new Date(),
    draft: false
  }
  expect(article2xmlString(article)).toMatch( `<?xml version="1.0" encoding="utf-8"?>
<entry xmlns="http://www.w3.org/2005/Atom" xmlns:app="http://www.w3.org/2007/app"
  xmlns:opt="http://www.hatena.ne.jp/info/xmlns#hatenablog" >
  <title>新しいタイトル</title>
  <author><name>name</name></author>
  <content type="text/plain">
    ** 新しい本文
  </content>
  <updated>2008-01-01T00:00:00.000Z</updated>
  <category term="Scala" />
  <app:control>
    <app:draft>no</app:draft>
  </app:control>
  <opt:custom-url>hoge/fuga</opt:custom-url>
</entry>` )
})

test('article2xmlString (draft)', () => {
  const article: Article = {
    id: undefined,
    customUrl: 'hoge/fuga',
    title: '新しいタイトル',
    text: '\n    ** 新しい本文\n  ',
    date: new Date('2008-01-01T00:00:00Z'),
    categories: [ 'Scala' ],
    editedDate: new Date(),
    draft: true
  }
  expect(article2xmlString(article)).toMatch( `<?xml version="1.0" encoding="utf-8"?>
<entry xmlns="http://www.w3.org/2005/Atom" xmlns:app="http://www.w3.org/2007/app"
  xmlns:opt="http://www.hatena.ne.jp/info/xmlns#hatenablog" >
  <title>新しいタイトル</title>
  <author><name>name</name></author>
  <content type="text/plain">
    ** 新しい本文
  </content>
  <updated>2008-01-01T00:00:00.000Z</updated>
  <category term="Scala" />
  <app:control>
    <app:draft>yes</app:draft>
  </app:control>
  <opt:custom-url>hoge/fuga</opt:custom-url>
</entry>` )
})

