 export default function (article: Article): string {
  const detoxedCategories = article.categories.map(detox)
  const categoriesString =
    (detoxedCategories.length === 0) ?
    '' : ['\ncategories:', ...detoxedCategories].join('\n  - ')

  return `---\n`
    +    `title: ${detox(article.title)}\n`
    +    `date: ${article.date.toISOString()}${categoriesString}\n`
    +    `id: "${article.id}"\n`
    +    `draft: ${article.draft}\n`
    +    `---\n`
    +    `${article.text}`
  // idは数字のみで構成された文字列だが、""をつけて文字列であることを明示して記録
  // 無いと読み取り時に数字として解釈され、その上で値が2つほど前後する。(原因未調査)
}

const detox = (title: string) :string => {
  if (title.indexOf(':') == -1) {
    return title
  }
  title = '"' + title.replace(/"/g, '\\"') + '"'
  return title
}
