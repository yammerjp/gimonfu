import { promises as fs } from 'fs'
import path from 'path'
import testDir from './testDir'
import newArticle from '../src/new'

const entryDir: string = path.resolve(testDir, 'tmp', 'gimonfu', 'new.test.ts', 'entry')
beforeEach(async () => {
  await fs.rm(entryDir, { recursive: true, force: true })
  await fs.mkdir(entryDir, { recursive: true })
})

beforeAll(async () => {
  await fs.mkdir('entry/2025/01/25', { recursive: true }).catch(() => {})
})

test('new article', async () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')
  const second = String(now.getSeconds()).padStart(2, '0')
  
  const expectedPath = `entry/${year}/${month}/${day}/${hour}${minute}${second}.md`
  
  await fs.unlink(expectedPath).catch(() => {})
  
  await newArticle()
  
  const fileExists = await fs.access(expectedPath).then(() => true).catch(() => false)
  expect(fileExists).toBe(true)
  
  const content = await fs.readFile(expectedPath, 'utf-8')
  expect(content).toBe(`---
title: New Article
categories:
  - Test
draft: true
---
`)
})

afterAll(async () => {
  await fs.rm('entry', { recursive: true, force: true }).catch(() => {})
})