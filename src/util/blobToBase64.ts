export default async function blobToBase64(url: string) {
  // do a request to the blob uri
  const response = await fetch(url);

  // response has a method called .blob() to get the blob file
  const blob = await response.blob();

  // instantiate a file reader
  const fileReader = new FileReader();

  // read the file
  fileReader.readAsDataURL(blob);

  return new Promise((resolve, _) => {
    fileReader.onloadend = function () {
      resolve(fileReader.result); // Here is the base64 string
    }
  });
};
