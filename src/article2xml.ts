import xml from 'xml'

export default function (article: Article): string {
  const entryAttrBase = {xmlns:"http://www.w3.org/2005/Atom", 'xmlns:app':"http://www.w3.org/2007/app",
  }
  const entryAttrCustomUrl = {...entryAttrBase, "xmlns:opt":"http://www.hatena.ne.jp/info/xmlns#hatenablog"}
  const entryAttr = article.customUrl === null ? entryAttrBase : entryAttrCustomUrl
  const optCustomUrl = article.customUrl === null ? [] : [ { 'opt:custom-url' : article.customUrl } ]
  const xmlObject = {
    entry: [
      {_attr: entryAttr},
      { title: article.title },
      { author: { name: "name" } },
      { content: [
        { _attr: { type: 'text/plain' } },
        article.text
      ]},
      { updated: article.date.toISOString() },
      ...article.categories.map((name: string)=>({ category: [ {_attr: { term: name}}]})),
      { 'app:control': {
        'app:draft': article.draft ? 'yes' : 'no'
      }},
      ...optCustomUrl,
    ],
  }
  return '<?xml version="1.0" encoding="utf-8"?>\n' + xml(xmlObject)
}
