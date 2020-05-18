import { exec } from 'child_process'

export default async function (filePath: string): Promise<Date> {
  const dateString = await execPromise(`git log --pretty=format:'%cd' --date=iso -- ${filePath} | head -n 1`)
    .catch( () => Promise.reject(new Error(`Failed to get git commit date of ${filePath}`)))
  if(dateString === '' ){
    return Promise.reject(new Error(`Failed to get git commit date of ${filePath}`))
  }
  return new Date(dateString)
}

const execPromise = (command: string): Promise<string> =>
  new Promise( (resolve, reject) => {
    exec(command, (err,stdout) => {
      if(err) {
        reject(err)
        return
      }
      resolve(stdout)
    })
  })
