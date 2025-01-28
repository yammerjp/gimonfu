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
    const targetDate = new Date('2025-01-25T12:34:56.789Z')
    const time = targetDate.toTimeString().split(':').join('').substring(0, 6)
    expect(time).toMatch(/^[0-9]{6}$/)
    const expectedPath = path.join('entry', '2025', '01', '25', `${time}.md`)

    const mockFs = fs as jest.Mocked<typeof fs>
    mockFs.access.mockRejectedValue(new Error())
    mockFs.writeFile.mockResolvedValue(undefined)

    await newArticle(targetDate)

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
