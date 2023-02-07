import html2Canvas from 'html2canvas'
import print from 'print-js'
import { jsPDF } from "jspdf";

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

export function html2PDF(dom: string, fileName: string) {
  const element: HTMLElement = document.querySelector(dom)!; // 这个dom元素是要导出pdf的div容器
  setTimeout(() => {
    html2Canvas(element, {
      scale: 2 //按比例增加分辨率
    }).then(function (canvas) {
      var contentWidth = canvas.width;
      var contentHeight = canvas.height;

      // 一页pdf显示html页面生成的canvas高度;
      var pageHeight = contentWidth / 592.28 * 841.89;
      // 未生成pdf的html页面高度
      var leftHeight = contentHeight;
      // 页面偏移
      var position = 0;
      // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
      var imgWidth = 595.28;
      var imgHeight = 592.28 / contentWidth * contentHeight;

      var pageData = canvas.toDataURL('image/jpeg', 1.0);

      var pdf = new jsPDF('p', 'pt', 'a4');

      // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
      // 当内容未超过pdf一页显示的范围，无需分页
      if (leftHeight < pageHeight) {
        pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
      } else {
        while (leftHeight > 0) {
          pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
          leftHeight -= pageHeight;
          position -= 841.89;
          // 避免添加空白页
          if (leftHeight > 0) {
            pdf.addPage();
          }
        }
      }
      pdf.save(fileName + '.pdf');
    });
  }, 0);

}
