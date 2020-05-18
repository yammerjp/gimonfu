import loadConfig from './loadConfig'
import path from 'path'
import { promises as fs } from 'fs'
import readline = require('readline')
import ping from './ping'

export default async function () {
  await loadConfig()
    .then( ({baseDir}) => {
      console.error(`.gimonfu.json is already exist on ${ path.join(baseDir,'.gimonfu.json') }`)
      console.error('If you want to register new credentials, please delete the file.')
      process.exit(-1)
    }).catch( () => Promise.resolve() )

  console.log('Gimonfu is third-party CLI tool for Hatena-blog.')
  console.log('Now, creating credentials file.')

  console.log('\n(ex) Hatena User ID: basd4g')
  const user_id = await prompt('Hatena User ID: ')
  console.log('\n(ex) Hatena-blog Blog ID: basd4g.hatenablog.com')
  const blog_id = await prompt('Hatena-blog Blog ID: ')
  console.log('\n(ex) Hatena-blog Blog ID: 1qa2ws3ed')
  const api_key = await prompt('Hatena-blog AtomPub API key: ')

  const dotGimonfuJsonString = JSON.stringify({user_id, api_key, blog_id})
  const dotGimonfuJsonPath = path.join(process.cwd(), '.gimonfu.json')

  await fs.writeFile(
    dotGimonfuJsonPath,
    dotGimonfuJsonString
  )

  console.log(`\nRegisterd credentials to ${dotGimonfuJsonPath}\n`)
  await ping()
}

const prompt = (question:string):Promise<string> => {
  const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    readlineInterface.question(question, (answer) => {
      resolve(answer);
      readlineInterface.close();
    });
  });
};
