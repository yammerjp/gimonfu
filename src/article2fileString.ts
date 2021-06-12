import jsYaml from 'js-yaml'
export default function (article: Article): string {
  const { title, date, id, categories, draft, text }  = article
  const yamlObject = {
    title,
    date: date.toISOString(),
    id: `${id}`,
    categories,
    draft,
  }
  const yamlString = jsYaml.dump(yamlObject)
  return `---\n${yamlString}\n---\n${text}`
  // idは数字のみで構成された文字列だが、""をつけて文字列であることを明示して記録
  // 無いと読み取り時に数字として解釈され、その上で値が2つほど前後する。(原因未調査)
}
