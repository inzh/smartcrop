<script setup lang="ts">
import result from './component/Result.vue'
import { ref, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, UploadInstance } from 'element-plus'
import type { UploadProps } from 'element-plus'
import { html2Base64, html2Print } from './util/html2Base64AndPrint'
import blobToBase64 from './util/blobToBase64'
import handleMain from './util/handleMain'

// 是否开启阿里去除背景
const openAliRmbg = ref(true)

// 保存上传的图片base64
const frontBase64 = ref('')
const backBase64 = ref('')

// 保存识别到身份证姓名
const cardName = ref('')

// 保存处理好的图片URL
const handledFrontUrl = ref('')
const handledBackUrl = ref('')

// 保存最终结果Base64
const finalResBase64 = ref('')

// 控制最终预览 dialog 显示
const finalPreviewDialogVisible = ref(false)

// 处理中 状态控制
const loading = ref(false)

// 记录已上传图片个数
const frontUploadLen = ref(0)
const backUploadLen = ref(0)

// 控制预览、导出、打印按钮可用
const controlBtn = computed(() => {
  return finalResBase64.value === ''
})

// 控制导出正反面按钮
const controlExport = computed(() => {
  return handledFrontUrl.value === '' && handledBackUrl.value === ''
})

// 隐藏上传按钮
const hideUploadFront = computed(() => {
  return frontUploadLen.value > 0
})
const hideUploadBack = computed(() => {
  return backUploadLen.value > 0
})

// 控制上传预览
const dialogImageUrlFront = ref('')
const dialogVisibleFront = ref(false)

const dialogImageUrlBack = ref('')
const dialogVisibleBack = ref(false)


const handleChangeFront: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
  blobToBase64(uploadFile.url!)
    .then(base64String => {
      frontBase64.value = base64String as string
    });
  frontUploadLen.value = uploadFiles.length;
}

const handleChangeBack: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
  blobToBase64(uploadFile.url!)
    .then(base64String => {
      backBase64.value = base64String as string
    });
  backUploadLen.value = uploadFiles.length;
}

const handleRemoveFront: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  frontBase64.value = ''
  frontUploadLen.value = 0;
}

const handleRemoveBack: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  backBase64.value = ''
  backUploadLen.value = 0;
}

const handlePictureCardPreviewFront: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrlFront.value = uploadFile.url!
  dialogVisibleFront.value = true
}

const handlePictureCardPreviewBack: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrlBack.value = uploadFile.url!
  dialogVisibleBack.value = true
}

// 一键处理
const onekeyHandle = async () => {
  if (frontBase64.value === '' || backBase64.value === '') {
    ElMessage({
      showClose: true,
      message: '未选择身份证图片！',
      type: 'error',
    })
  } else {
    if (handledFrontUrl.value === '' && handledBackUrl.value === '') {
      loading.value = true
      try {
        const imgUrlObj: any = await handleMain(frontBase64.value, backBase64.value, openAliRmbg.value)
        handledFrontUrl.value = imgUrlObj.resFront
        handledBackUrl.value = imgUrlObj.resBack
        cardName.value = imgUrlObj.cardName
        const data = await html2Base64(".result")
        finalResBase64.value = data as string
        loading.value = false
        ElMessage({
          showClose: true,
          message: '处理成功！',
          type: 'success',
        })
      } catch (error) {
        loading.value = false
        ElMessage({
          showClose: true,
          message: '未知错误！',
          type: 'error',
        })
      }

    } else {
      ElMessage({
        showClose: true,
        message: '一键清空后再处理',
        type: 'error',
      })
    }
  }
}

// 控制预览 dialog
const handlePreview = () => {
  finalPreviewDialogVisible.value = true
}

// 导出png
const exportPNG = (base64: string, fileName: string) => {
  const base64ToBlob = function (code: any) {
    let parts = code.split(';base64,');
    let contentType = parts[0].split(':')[1];
    let raw = window.atob(parts[1]);
    let rawLength = raw.length;
    let uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], {
      type: contentType
    });
  };
  let aLink = document.createElement('a');
  let blob = base64ToBlob(base64); //new Blob([content]);
  let evt = document.createEvent("HTMLEvents");
  evt.initEvent("click", true, true); //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
  aLink.download = fileName;
  aLink.href = URL.createObjectURL(blob);
  aLink.click();
}

// 拼接处理
const print = () => {
  if (handledFrontUrl.value != '' && handledBackUrl.value != '') {
    html2Print(".result");
  } else {
    ElMessage({
      showClose: true,
      message: '未找到打印内容',
      type: 'error',
    })
  }
}

// 获取dom
const frontref = ref<UploadInstance>()
const backref = ref<UploadInstance>()
// 一键清空
const handleclear = () => {
  frontref.value!.clearFiles()
  backref.value!.clearFiles()
  frontBase64.value = ''
  frontUploadLen.value = 0;
  backBase64.value = ''
  backUploadLen.value = 0;
  handledFrontUrl.value = ''
  handledBackUrl.value = ''
  finalResBase64.value = ''
  cardName.value = ''
  ElMessage({
    showClose: true,
    message: '清空完毕',
    type: 'success',
  })
}

// 导出
const exportFront = () => {
  exportPNG(handledFrontUrl.value, cardName.value + '.jpg')
}

const exportBack = () => {
  exportPNG(handledBackUrl.value, cardName.value + '.jpg')
}

const exportFull = () => {
  exportPNG(finalResBase64.value, cardName.value + '.jpg')
}

</script>

<template>
  <div class="wrap" v-loading="loading">
    <div id="pdfdom">
      <div class="front-card">
        <h2>身份证正面</h2><el-button text type="primary" :disabled="controlExport" @click="exportFront">导出</el-button>
        <el-upload :class="{ hideupload: hideUploadFront }" accept=".jpg,.jpeg,.png,.JPG,.JPEG" action="#"
          :auto-upload="false" :drag="true" list-type="picture-card" :on-preview="handlePictureCardPreviewFront"
          :on-change="handleChangeFront" :on-remove="handleRemoveFront" ref="frontref">
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>
        <el-dialog v-model="dialogVisibleFront">
          <div>
            <img :src="dialogImageUrlFront" alt="Preview Image" class="imgpreview" />
          </div>
        </el-dialog>
      </div>
      <div class="back-card">
        <h2>身份证反面</h2><el-button text type="primary" :disabled="controlExport" @click="exportBack">导出</el-button>
        <el-upload :class="{ hideupload: hideUploadBack }" accept=".jpg,.jpeg,.png,.JPG,.JPEG" action="#"
          :auto-upload="false" :drag="true" list-type="picture-card" :on-preview="handlePictureCardPreviewBack"
          :on-change="handleChangeBack" :on-remove="handleRemoveBack" ref="backref">
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>
        <el-dialog v-model="dialogVisibleBack">
          <div>
            <img :src="dialogImageUrlBack" alt="Preview Image" class="imgpreview" />
          </div>
        </el-dialog>
      </div>
    </div>

    <div class="menuBtn">
      <span style="margin-right: 20px;">是否开启去除背景</span>
      <el-switch v-model="openAliRmbg" size="large" inline-prompt active-text="开启" inactive-text="关闭" />
      <div style="display: flex; justify-content: center; width: 300px; margin-top: 10px;">
        <el-button type="primary" @click="onekeyHandle">一键处理</el-button>
        <el-button type="primary" @click="handleclear">一键清空</el-button>
      </div>

      <div class="btns">
        <div class="">
          <el-button type="info" plain @click="handlePreview" :disabled="controlBtn">预览</el-button>
        </div>
        <div class="cbt">
          <el-button type="info" plain @click="exportFull" :disabled="controlBtn">导出</el-button>
        </div>
        <div class="">
          <el-button type="info" plain @click="print" :disabled="controlBtn">打印</el-button>
        </div>
      </div>
    </div>

    <result :frontimg-url="handledFrontUrl" :backimg-url="handledBackUrl"></result>
  </div>

  <div class="preview">
    <el-dialog v-model="finalPreviewDialogVisible" center destroy-on-close align-center>
      <img class="imgpreview" :src="finalResBase64" alt="">
    </el-dialog>
  </div>
</template>

<style lang="scss">
.wrap {
  width: 510px;
  height: 700px;
  overflow: hidden;
}

.hideupload {
  .el-upload.is-drag {
    display: none !important;
  }
}


.right {
  height: 455px;
  width: 500px;
}

.front-card {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  flex-flow: wrap;
  margin-left: 100px;
  margin-top: 43px;
}

.back-card {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  flex-flow: wrap;
  margin-top: 20px;
  margin-left: 100px;
}

.imgpreview {
  width: 200px;
  border: 1px solid #000;
}

.el-upload--picture-card {
  border: none !important;
  border-radius: 0 !important;
  background-color: white !important;
  width: 100% !important;
  height: 100% !important;
}

.el-upload-dragger {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 !important;
  width: 300px !important;
  height: 150px !important;
}

.el-upload-list__item {
  width: 300px !important;
  height: 150px !important;
}

.menuBtn {
  margin-top: 20px;
  padding-left: 100px;
  width: 500px;
}

.btns {
  display: flex;
  justify-content: space-between;
  width: 300px;
  margin-top: 20px;
}

.clearbtn {
  position: fixed;
  top: 42%;
  right: 60px;

}

.el-dialog__body {
  width: 340px !important;
}
</style>
