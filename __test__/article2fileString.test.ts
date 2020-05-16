import article2fileString from '../src/article2fileString'

const article: Article = {
  title: 'title-string',
  customUrl: '2020/05/12/today-blog',
  date: new Date('2020-05-12T22:55:00.000Z'),
  editedDate: new Date('2020-05-12T23:55:00.000Z'),
  id: '1234567890',
  categories: [ 'hoge', 'fuga' ],
  text: 'Hello!\nToday is 2020/5/12.\nBye~\n'
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
test('article2fileString', () => {
  // access to private method
  const fileString = article2fileString(article)
  expect(fileString).toBe(articleString)
})
