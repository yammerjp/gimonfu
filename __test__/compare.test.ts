import Compare from '../src/compare'

test('Compare.localIsNew()', () => {
  const oldArticle: Article = {
    title: '',
    customUrl: '',
    text: '',
    date: new Date(),
    editedDate: new Date(2020,5,16,10,0),
    categories: [],
    id: '',
    draft: false
  }

  const newArticle: Article = {
    title: '',
    customUrl: '',
    text: '',
    date: new Date(),
    editedDate: new Date(2020,5,16,11,0),
    categories: [],
    id: '',
    draft: false
  }

  // new Compare(local, remote)
  expect( new Compare(oldArticle, oldArticle).localIsNew() ).toBe(false)
  expect( new Compare(oldArticle, newArticle).localIsNew() ).toBe(false)
  expect( new Compare(newArticle, oldArticle).localIsNew() ).toBe(true)
})

const title = 'title'
const customUrl = 'customUrl'
const text= 'text'
const date = new Date(2020,5,16,10,0)
const editedDate = new Date(2020,5,16,10,0)
const categories = ['hoge', 'fuga']
const id = 'id'
const draft = false

test('Compare.same()', () => {
  expect( new Compare(
    {title, customUrl, text, date, editedDate, categories, id, draft},
    {title, customUrl, text, date, editedDate, categories, id, draft}
  ).same() ).toBe(true)

  expect( new Compare(
    {title: 'hoge', customUrl, text, date, editedDate, categories, id, draft},
    {title, customUrl, text, date, editedDate, categories, id, draft}
  ).same() ).toBe(false)

   expect( new Compare(
    {title, customUrl: 'hoge', text, date, editedDate, categories, id, draft},
    {title, customUrl, text, date, editedDate, categories, id, draft}
  ).same() ).toBe(false)
  
  expect( new Compare(
    {title, customUrl, text: 'hoge', date, editedDate, categories, id, draft},
    {title, customUrl, text, date, editedDate, categories, id, draft}
  ).same() ).toBe(false)

  expect( new Compare(
    {title, customUrl, text, date: new Date(2020,5,16,11,0), editedDate, categories, id, draft},
    {title, customUrl, text, date, editedDate, categories, id, draft}
  ).same() ).toBe(false)

  expect( new Compare(
    {title, customUrl, text, date, editedDate: new Date(2020,5,16,11,0), categories, id, draft},
    {title, customUrl, text, date, editedDate, categories, id, draft}
  ).same() ).toBe(false)

  expect( new Compare(
    {title, customUrl, text, date, editedDate, categories: ['hoge'], id, draft},
    {title, customUrl, text, date, editedDate, categories, id, draft}
  ).same() ).toBe(false)

  expect( new Compare(
    {title, customUrl, text, date, editedDate, categories, id: 'hoge', draft},
    {title, customUrl, text, date, editedDate, categories, id, draft}
  ).same() ).toBe(false)

  expect( new Compare(
    {title, customUrl, text, date, editedDate, categories, id, draft: false},
    {title, customUrl, text, date, editedDate, categories, id, draft: true}
  ).same() ).toBe(false)

})

test('Compare.sameWithoutEditedDate()', () => {
  expect( new Compare(
    {title, customUrl, text, date, editedDate, categories, id, draft},
    {title, customUrl, text, date, editedDate, categories, id, draft}
  ).sameWithoutEditedDate() ).toBe(true)

  expect( new Compare(
    {title: 'hoge', customUrl, text, date, editedDate, categories, id, draft},
    {title, customUrl, text, date, editedDate, categories, id, draft}
  ).sameWithoutEditedDate() ).toBe(false)

   expect( new Compare(
    {title, customUrl: 'hoge', text, date, editedDate, categories, id, draft},
    {title, customUrl, text, date, editedDate, categories, id, draft}
  ).sameWithoutEditedDate() ).toBe(false)
  
  expect( new Compare(
    {title, customUrl, text: 'hoge', date, editedDate, categories, id, draft},
    {title, customUrl, text, date, editedDate, categories, id, draft}
  ).sameWithoutEditedDate() ).toBe(false)

  expect( new Compare(
    {title, customUrl, text, date: new Date(2020,5,16,11,0), editedDate, categories, id, draft},
    {title, customUrl, text, date, editedDate, categories, id, draft}
  ).sameWithoutEditedDate() ).toBe(false)

  expect( new Compare(
    {title, customUrl, text, date, editedDate: new Date(2020,5,16,11,0), categories, id, draft},
    {title, customUrl, text, date, editedDate, categories, id, draft}
  ).sameWithoutEditedDate() ).toBe(true)

  expect( new Compare(
    {title, customUrl, text, date, editedDate, categories: ['hoge'], id, draft},
    {title, customUrl, text, date, editedDate, categories, id, draft}
  ).sameWithoutEditedDate() ).toBe(false)

  expect( new Compare(
    {title, customUrl, text, date, editedDate, categories, id: 'hoge', draft},
    {title, customUrl, text, date, editedDate, categories, id, draft}
  ).sameWithoutEditedDate() ).toBe(false)

  expect( new Compare(
    {title, customUrl, text, date, editedDate, categories, id, draft: false},
    {title, customUrl, text, date, editedDate, categories, id, draft: true}
  ).sameWithoutEditedDate() ).toBe(false)
})
