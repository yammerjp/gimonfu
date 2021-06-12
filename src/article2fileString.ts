 export default function (article: Article): string {
  const sanitizedCategories = article.categories.map(sanitize)
  const categoriesString =
    (sanitizedCategories.length === 0) ?
    '' : ['\ncategories:', ...sanitizedCategories].join('\n  - ')

  return `---\n`
    +    `title: ${sanitize(article.title)}\n`
    +    `date: ${article.date.toISOString()}${categoriesString}\n`
    +    `id: "${article.id}"\n`
    +    `draft: ${article.draft}\n`
    +    `---\n`
    +    `${article.text}`
  // idは数字のみで構成された文字列だが、""をつけて文字列であることを明示して記録
  // 無いと読み取り時に数字として解釈され、その上で値が2つほど前後する。(原因未調査)
}

// wrap up in " WHEN str includes :
// wrap up in " WHEN str begin with "
// escape " WHEN str wrap up in "
const sanitize = (str: string) :string => {
  if (str[0] !== '"' && !str.includes(':') && !str.includes('#')) {
    return str
  }
  return '"' + str.replace(/"/g, '\\"') + '"'
}
