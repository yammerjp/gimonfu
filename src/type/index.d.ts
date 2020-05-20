interface Article {
  title: string
  customUrl: string
  text: string
  date: Date
  editedDate: Date
  categories: string[]
  id?: string
}

interface ReadOptions {
  gitCommitDate?: boolean
}
