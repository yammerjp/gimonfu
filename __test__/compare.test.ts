import Compare from '../src/compare'

test('Compare.localIsNew()', () => {
  const oldArticle: Article = {
    title: '',
    customUrl: '',
    text: '',
    date: new Date(),
    editedDate: new Date(2020,5,16,10,0),
    categories: [],
    id: ''
  }

  const newArticle: Article = {
    title: '',
    customUrl: '',
    text: '',
    date: new Date(),
    editedDate: new Date(2020,5,16,11,0),
    categories: [],
    id: ''
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

test('Compare.same()', () => {
  expect( new Compare(
    {title, customUrl, text, date, editedDate, categories, id},
    {title, customUrl, text, date, editedDate, categories, id}
  ).same() ).toBe(true)

  expect( new Compare(
    {title: 'hoge', customUrl, text, date, editedDate, categories, id},
    {title, customUrl, text, date, editedDate, categories, id}
  ).same() ).toBe(false)

   expect( new Compare(
    {title, customUrl: 'hoge', text, date, editedDate, categories, id},
    {title, customUrl, text, date, editedDate, categories, id}
  ).same() ).toBe(false)
  
  expect( new Compare(
    {title, customUrl, text: 'hoge', date, editedDate, categories, id},
    {title, customUrl, text, date, editedDate, categories, id}
  ).same() ).toBe(false)

  expect( new Compare(
    {title, customUrl, text, date: new Date(2020,5,16,11,0), editedDate, categories, id},
    {title, customUrl, text, date, editedDate, categories, id}
  ).same() ).toBe(false)

  expect( new Compare(
    {title, customUrl, text, date, editedDate: new Date(2020,5,16,11,0), categories, id},
    {title, customUrl, text, date, editedDate, categories, id}
  ).same() ).toBe(false)

  expect( new Compare(
    {title, customUrl, text, date, editedDate, categories: ['hoge'], id},
    {title, customUrl, text, date, editedDate, categories, id}
  ).same() ).toBe(false)

  expect( new Compare(
    {title, customUrl, text, date, editedDate, categories, id: 'hoge'},
    {title, customUrl, text, date, editedDate, categories, id}
  ).same() ).toBe(false)
})

test('Compare.sameWithoutEditedDate()', () => {
  expect( new Compare(
    {title, customUrl, text, date, editedDate, categories, id},
    {title, customUrl, text, date, editedDate, categories, id}
  ).sameWithoutEditedDate() ).toBe(true)

  expect( new Compare(
    {title: 'hoge', customUrl, text, date, editedDate, categories, id},
    {title, customUrl, text, date, editedDate, categories, id}
  ).sameWithoutEditedDate() ).toBe(false)

   expect( new Compare(
    {title, customUrl: 'hoge', text, date, editedDate, categories, id},
    {title, customUrl, text, date, editedDate, categories, id}
  ).sameWithoutEditedDate() ).toBe(false)
  
  expect( new Compare(
    {title, customUrl, text: 'hoge', date, editedDate, categories, id},
    {title, customUrl, text, date, editedDate, categories, id}
  ).sameWithoutEditedDate() ).toBe(false)

  expect( new Compare(
    {title, customUrl, text, date: new Date(2020,5,16,11,0), editedDate, categories, id},
    {title, customUrl, text, date, editedDate, categories, id}
  ).sameWithoutEditedDate() ).toBe(false)

  expect( new Compare(
    {title, customUrl, text, date, editedDate: new Date(2020,5,16,11,0), categories, id},
    {title, customUrl, text, date, editedDate, categories, id}
  ).sameWithoutEditedDate() ).toBe(true)

  expect( new Compare(
    {title, customUrl, text, date, editedDate, categories: ['hoge'], id},
    {title, customUrl, text, date, editedDate, categories, id}
  ).sameWithoutEditedDate() ).toBe(false)

  expect( new Compare(
    {title, customUrl, text, date, editedDate, categories, id: 'hoge'},
    {title, customUrl, text, date, editedDate, categories, id}
  ).sameWithoutEditedDate() ).toBe(false)
})
