export const mergeImageAndSignature = async (
  photoDataUrl: string,
  signatureDataUrl: string
): Promise<string> => {
  const loadImage = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = src
    })

  const [photo, signature] = await Promise.all([
    loadImage(photoDataUrl),
    loadImage(signatureDataUrl),
  ])

  const canvas = document.createElement('canvas')
  canvas.width = photo.width
  canvas.height = photo.height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Canvas not supported')
  }

  ctx.drawImage(photo, 0, 0)
  ctx.drawImage(signature, 0, 0, canvas.width, canvas.height)

  return canvas.toDataURL('image/png')
}
