import article2fileString from '../src/article2fileString'

test('article2fileString', () => {
const article: Article = {
  title: 'title-string',
  customUrl: '2020/05/12/today-blog',
  date: new Date('2020-05-12T22:55:00.000Z'),
  editedDate: new Date('2020-05-12T23:55:00.000Z'),
  id: '1234567890',
  categories: [ 'hoge', 'fuga' ],
  text: 'Hello!\nToday is 2020/5/12.\nBye~\n',
  draft: false,
}

const articleString = `---
title: title-string
date: 2020-05-12T22:55:00.000Z
categories:
  - hoge
  - fuga
id: "1234567890"
draft: false
---
Hello!
Today is 2020/5/12.
Bye~
`
  // access to private method
  const fileString = article2fileString(article)
  expect(fileString).toBe(articleString)
})

test('article2fileString (draft)', () => {
const article: Article = {
  title: 'title-string',
  customUrl: '2020/05/12/today-blog',
  date: new Date('2020-05-12T22:55:00.000Z'),
  editedDate: new Date('2020-05-12T23:55:00.000Z'),
  id: '1234567890',
  categories: [ 'hoge', 'fuga' ],
  text: 'Hello!\nToday is 2020/5/12.\nBye~\n',
  draft: true,
}

const articleString = `---
title: title-string
date: 2020-05-12T22:55:00.000Z
categories:
  - hoge
  - fuga
id: "1234567890"
draft: true
---
Hello!
Today is 2020/5/12.
Bye~
`
  // access to private method
  const fileString = article2fileString(article)
  expect(fileString).toBe(articleString)
})

test('article2fileString (with colon in title)', () => {
const article: Article = {
  title: 'title:string',
  customUrl: '2020/05/12/today-blog',
  date: new Date('2020-05-12T22:55:00.000Z'),
  editedDate: new Date('2020-05-12T23:55:00.000Z'),
  id: '1234567890',
  categories: [ 'hoge', 'fuga' ],
  text: 'Hello!\nToday is 2020/5/12.\nBye~\n',
  draft: false,
}

const articleString = `---
title: "title:string"
date: 2020-05-12T22:55:00.000Z
categories:
  - hoge
  - fuga
id: "1234567890"
draft: false
---
Hello!
Today is 2020/5/12.
Bye~
`
  // access to private method
  const fileString = article2fileString(article)
  expect(fileString).toBe(articleString)
})

test('article2fileString (with colon and double quote in title)', () => {
const article: Article = {
  title: 'title:strin"g',
  customUrl: '2020/05/12/today-blog',
  date: new Date('2020-05-12T22:55:00.000Z'),
  editedDate: new Date('2020-05-12T23:55:00.000Z'),
  id: '1234567890',
  categories: [ 'hoge', 'fuga' ],
  text: 'Hello!\nToday is 2020/5/12.\nBye~\n',
  draft: false,
}

const articleString = `---
title: "title:strin\\"g"
date: 2020-05-12T22:55:00.000Z
categories:
  - hoge
  - fuga
id: "1234567890"
draft: false
---
Hello!
Today is 2020/5/12.
Bye~
`
  // access to private method
  const fileString = article2fileString(article)
  expect(fileString).toBe(articleString)
})

test('article2fileString (with double quote in title head)', () => {
const article: Article = {
  title: '"title-string',
  customUrl: '2020/05/12/today-blog',
  date: new Date('2020-05-12T22:55:00.000Z'),
  editedDate: new Date('2020-05-12T23:55:00.000Z'),
  id: '1234567890',
  categories: [ 'hoge', 'fuga' ],
  text: 'Hello!\nToday is 2020/5/12.\nBye~\n',
  draft: false,
}

const articleString = `---
title: "\\"title-string"
date: 2020-05-12T22:55:00.000Z
categories:
  - hoge
  - fuga
id: "1234567890"
draft: false
---
Hello!
Today is 2020/5/12.
Bye~
`
  // access to private method
  const fileString = article2fileString(article)
  expect(fileString).toBe(articleString)
})



test('article2fileString (with colon and double quote in categories', () => {
const article: Article = {
  title: 'title-string',
  customUrl: '2020/05/12/today-blog',
  date: new Date('2020-05-12T22:55:00.000Z'),
  editedDate: new Date('2020-05-12T23:55:00.000Z'),
  id: '1234567890',
  categories: [ 'hog:"e', 'fuga:' ],
  text: 'Hello!\nToday is 2020/5/12.\nBye~\n',
  draft: false,
}

const articleString = `---
title: title-string
date: 2020-05-12T22:55:00.000Z
categories:
  - "hog:\\"e"
  - "fuga:"
id: "1234567890"
draft: false
---
Hello!
Today is 2020/5/12.
Bye~
`
  // access to private method
  const fileString = article2fileString(article)
  expect(fileString).toBe(articleString)
})


