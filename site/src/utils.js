export const blobToBase64 = blob => new Promise((res, rej) => {
  const reader = new FileReader()

  reader.onerror = rej
  reader.onloadend = () => {console.log(reader.result); res(reader.result)}

  reader.readAsDataURL(blob)
})
