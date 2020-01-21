export const blobToBase64 = blob => new Promise((res, rej) => {
  const reader = new FileReader()

  reader.onerror = rej
  reader.onloadend = () => res(reader.result)

  reader.readAsDataURL(blob)
})
