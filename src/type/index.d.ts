interface Article {
  title: string
  customUrl: string
  text: string
  date: Date
  editedDate: Date
  categories: string[]
  id?: string
  draft: boolean
}

interface ReadOptions {
  gitCommitDate?: boolean
  allowDelete?: boolean
}
