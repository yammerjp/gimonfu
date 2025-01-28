import { promises as fs } from 'fs'
import path from 'path'

const template = `---
title: New Article
categories:
  - Test
draft: true
---
`

export default async function (now: Date = new Date()) {
    const time = now.toTimeString().split(':').join('')
    const filename = `${time.substring(0, 6)}.md`

    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const dirPath = path.join('entry', String(year), month, day)

    const filePath = path.join(dirPath, filename)

    await fs.mkdir(path.dirname(filePath), { recursive: true })
    await fs.writeFile(filePath, template)
    console.log(`Created new draft article: ${filePath}`)
}
