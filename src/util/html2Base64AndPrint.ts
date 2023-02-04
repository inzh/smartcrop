import html2Canvas from 'html2canvas'
import print from 'print-js'

// 返回最终结果图Base64
export async function html2Base64(dom: string) {
  const element: HTMLElement = document.querySelector(dom)!; // 这个dom元素是要导出pdf的div容器
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      html2Canvas(element, {
        scale: 2 //按比例增加分辨率
      }).then(function (canvas) {
        const pageData = canvas.toDataURL('image/jpeg', 1.0);
        resolve(pageData)
      });
    }, 0);
  })
}

export function html2Print(dom: string) {
  const element: HTMLElement = document.querySelector(dom)!; // 这个dom元素是要导出pdf的div容器
  // element.style.height = param.height
  setTimeout(() => {
    html2Canvas(element, {
      scale: 2 //按比例增加分辨率
    }).then(function (canvas) {
      const pageData = canvas.toDataURL('image/jpeg', 1.0);
      print({
        printable: pageData,
        type: 'image',
        base64: true
      })
    });
  }, 0);

}
