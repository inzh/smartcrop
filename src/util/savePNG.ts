import { writeFile } from 'node:fs/promises'
import { cwd } from 'node:process'

export default async function savePNG(base64Data:any, fileName:string) {
  const dataBuffer = Buffer.from(base64Data, 'base64')
  return new Promise((resolve, reject) => {
    writeFile(`${cwd()}/${fileName}`,dataBuffer).then(res => {
      resolve('success')
    }).catch(err => {
      reject(err)
    })
  })
}
