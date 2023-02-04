import savePNG from './savePNG'
import { cropCardBaidu } from './cropCardBaidu'
import rmbgAli from './rmbgAli'
import { cwd } from 'node:process'
import blobToBase64 from './blobToBase64'
const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay))

export default async function handleMain(frontBase64: string, backBase64: string, rmbg: boolean) {
  // 使用百度接口裁剪身份证，保存为 front.png 和 back.png
  const resBaiduFront: any = await cropCardBaidu(frontBase64, 'front')
  const resFrontBase64: string = resBaiduFront.img
  const cardName = resBaiduFront.name.words
  await savePNG(resFrontBase64, 'front.png')

  const resBaiduBack: any = await cropCardBaidu(backBase64, 'back')
  const resBackBase64: any = resBaiduBack.img
  await savePNG(resBackBase64, 'back.png')

  if (rmbg === true) {
    // 使用阿里去背景
    const resRmBgFrontImgUrl = await rmbgAli(`${cwd()}/front.png`) as string
    await sleep(1)
    const resRmBgBackImgUrl = await rmbgAli(`${cwd()}/back.png`) as string
    const resFront = await blobToBase64(resRmBgFrontImgUrl)
    const resBack = await blobToBase64(resRmBgBackImgUrl)
    return new Promise((resolve, reject) => {
      resolve({
        resFront,
        resBack,
        cardName
      })
    })
  } else {
    // 不使用去背景
    return new Promise((resolve, reject) => {
      resolve({
        resFront: './front.png',
        resBack: './back.png',
        cardName
      })
    })
  }

}
