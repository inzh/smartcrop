import ViapiUtil from '@alicloud/viapi-utils';
import imageseg20191230, * as $imageseg20191230 from '@alicloud/imageseg20191230';
import OpenApi, * as $OpenApi from '@alicloud/openapi-client';
import Util, * as $Util from '@alicloud/tea-util';
import * as $tea from '@alicloud/tea-typescript';
import { loadAliConfig } from './loadConfig'

function createClient(accessKeyId: string, accessKeySecret: string): imageseg20191230 {
  let config = new $OpenApi.Config({
    accessKeyId: accessKeyId,
    accessKeySecret: accessKeySecret,
  });
  config.endpoint = `imageseg.cn-shanghai.aliyuncs.com`;
  return new imageseg20191230(config);
}

export default async function rmbgAli(imgPath: string) {
  // load config
  const aliConfig = await loadAliConfig()
  let client = createClient(aliConfig.AK, aliConfig.SK);
  // local img upload to ali oss
  // get oss img url
  let files: string = imgPath
  let ossUrl: string = await ViapiUtil.upload(aliConfig.AK, aliConfig.SK, files);
  // segmentCommonImage
  let segmentCommonImageRequest = new $imageseg20191230.SegmentCommonImageRequest();
  segmentCommonImageRequest.returnForm = 'crop'
  segmentCommonImageRequest.imageURL = ossUrl
  let runtime = new $Util.RuntimeOptions({});
  try {
    const res = await client.segmentCommonImageWithOptions(segmentCommonImageRequest, runtime);
    return res.body.data?.imageURL;
  } catch (error: any) {
    console.log(error);
  }
}
