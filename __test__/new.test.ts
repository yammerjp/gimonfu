import { promises as fs } from 'fs'
import path from 'path'
import testDir from './testDir'
import newArticle from '../src/new'

jest.mock('fs', () => ({
    promises: {
        mkdir: jest.fn().mockResolvedValue(undefined),
        unlink: jest.fn().mockResolvedValue(undefined),
        writeFile: jest.fn().mockResolvedValue(undefined),
        access: jest.fn().mockResolvedValue(undefined),
        rm: jest.fn().mockResolvedValue(undefined),
    }
}))

const entryDir: string = path.resolve(testDir, 'tmp', 'gimonfu', 'new.test.ts', 'entry')
beforeEach(async () => {
    await fs.rm(entryDir, { recursive: true, force: true })
    await fs.mkdir(entryDir, { recursive: true })
})

beforeAll(async () => {
    await fs.mkdir('entry/2025/01/25', { recursive: true }).catch(() => { })
})

test('new article', async () => {
    const now = new Date()
    const year = `${now.getFullYear()}`
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hour = String(now.getHours()).padStart(2, '0')
    const minute = String(now.getMinutes()).padStart(2, '0')
    const second = String(now.getSeconds()).padStart(2, '0')

    const expectedPath = path.join('entry', year, month, day, `${hour}${minute}${second}.md`)

    const mockFs = fs as jest.Mocked<typeof fs>
    mockFs.access.mockRejectedValue(new Error())
    mockFs.writeFile.mockResolvedValue(undefined)

    await newArticle()

    expect(mockFs.writeFile).toHaveBeenCalledWith(
        expectedPath,
        `---
title: New Article
categories:
  - Test
draft: true
---
`
    )
})
