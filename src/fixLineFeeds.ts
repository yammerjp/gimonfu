export default function (str: string): string {
  const changedLineFeeds = str.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const deletedFrontLineFeeds = changedLineFeeds.replace(/^(\n)+/, '')
  const lastIsLineFeed = deletedFrontLineFeeds + (/[^\n]$/.test(deletedFrontLineFeeds)?'\n':'')
  return lastIsLineFeed
}
