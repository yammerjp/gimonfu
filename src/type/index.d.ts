interface LocalArticle {
  title: string
  customUrl: string|null
  text: string
  date: Date
  categories: string[]
  id?: string
}

interface RemoteArticle extends LocalArticle {
  editedDate: Date
  id: string
}
