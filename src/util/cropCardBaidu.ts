import { request } from 'node:https'
import { loadBaiduConfig } from './loadConfig'

async function getAccessToken() {
  const baiduConfig = await loadBaiduConfig()
  const url = 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + baiduConfig.AK + '&client_secret=' + baiduConfig.SK
  const options = {
    method: 'POST',
  }
  return new Promise((resolve, reject) => {
    const req = request(url, options, (res) => {
      const body: any = []
      res.on('data', (chunk) => body.push(chunk))
      res.on('end', () => {
        const resString = Buffer.concat(body).toString()
        resolve(JSON.parse(resString).access_token)
      })
    })

    req.on('error', (err) => {
      reject(err)
    })
    req.end()
  })
}

export async function cropCardBaidu(imgBase64: any, side: string) {
  const url = 'https://aip.baidubce.com/rest/2.0/ocr/v1/idcard?access_token=' + await getAccessToken()
  const postData = new URLSearchParams({
    'id_card_side': side,
    'image': imgBase64,
    'detect_risk': 'false',
    'detect_quality': 'false',
    'detect_photo': 'false',
    'detect_card': 'true',
    'detect_direction': 'true'
  })
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      // 'Content-Length': postData.length
      // 'Content-Length': Buffer.byteLength(xFormBody)
    },
  }

  return new Promise((resolve, reject) => {
    const req = request(url, options, (response) => {
      let data = '';
      response.on('data', (chunk: any) => {
        data = data + chunk.toString();
      });

      response.on('end', () => {
        const body = JSON.parse(data);
        resolve({
          img: body.card_image,
          name: body.words_result['姓名']
        })
      });
    })

    req.on('error', (error: any) => {
      reject(error)
    });

    req.write(postData.toString());
    req.end()
  })
}







