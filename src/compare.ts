class Compare {
  local: Article
  remote: Article
  constructor(local: Article, remote: Article) {
    this.local = local
    this.remote = remote
  }
  localIsNew():boolean {
    const localUnixTime = this.local.editedDate.getTime()
    const remoteUnixTime = this.remote.editedDate.getTime()
    return localUnixTime > remoteUnixTime
  }
  remoteIsNew():boolean {
    const localUnixTime = this.local.editedDate.getTime()
    const remoteUnixTime = this.remote.editedDate.getTime()
    return remoteUnixTime > localUnixTime
  }
  same(): boolean {
    return this.sameWithoutEditedDate()
      && this.local.editedDate.getTime() === this.remote.editedDate.getTime()
  }
  sameWithoutEditedDate(): boolean {
    return this.local.title === this.remote.title
      && this.local.customUrl === this.remote.customUrl
      && this.local.text === this.remote.text
      && this.local.date.getTime() === this.remote.date.getTime()
      && equalStrings(this.local.categories, this.remote.categories)
      && this.local.id === this.remote.id
  }
}

const equalStrings = (a: string[], b: string[]): boolean => {
  const sortedA = a.sort()
  const sortedB = b.sort()
  return sortedA.length === sortedB.length
    && sortedA.every( (str, idx) => str === sortedB[idx] )
}

export default Compare
