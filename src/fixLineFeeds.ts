const fixLineFeeds = (str: string): string => {
  return becomeLastIsLineFeed(
    deleteFrontLineFeeds(
      changeLineFeeds( str )
    )
  )
}

const deleteFrontLineFeeds = (str: string): string => {
  return str.replace(/^(\n)+/, '')
//  return str
}

const becomeLastIsLineFeed = (str: string): string => {
  if (! /[^\n]$/.test(str)) {
    return str
  }
  return str + '\n'
}


const changeLineFeeds = (str: string): string => {
  return str.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
}

export default fixLineFeeds

