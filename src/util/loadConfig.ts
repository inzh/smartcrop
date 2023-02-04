import { readFile, writeFile } from 'node:fs/promises'
import { cwd } from 'node:process'
import { ipcRenderer } from 'electron'

ipcRenderer.on('main-process-message', (_event, ...args) => {
  console.log('[Receive Main-process message]:', ...args)
})


// console.log(`Current directory: ${cwd()}`);

const configPath = `${cwd()}/config.json`
// console.log(configPath);

export async function loadBaiduConfig() {
  // read config json
  const config = await readFile(configPath, 'utf-8')
  return {
    'AK' : JSON.parse(config).baidu.AK,
    'SK' : JSON.parse(config).baidu.SK
  }
}

export async function loadAliConfig() {
  // read config json
  const config = await readFile(configPath, 'utf-8')
  return {
    'AK' : JSON.parse(config).ali.AK,
    'SK' : JSON.parse(config).ali.SK
  }
}
