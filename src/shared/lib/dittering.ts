
function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function ditherImage(imageId: string): void {
  const imgElement = document.getElementById(imageId) as HTMLImageElement;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    console.error('Could not create canvas context');
    return;
  }

  imgElement.onload = () => {
    if (
      imgElement.dataset.ditter === 'y'
    ) return

    canvas.width = imgElement.width;
    canvas.height = imgElement.height;

    ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const strategy = Math.random() > 0.5 ? 'gray' : 'color'

    const getColoredPixel = (pixel: number) => pixel > 128 ? randomIntFromInterval(128, 255) : randomIntFromInterval(0, 128);

    const pixelPickStrategy = (oldPixel: number[]) => {
      if (strategy === 'gray') {
        const average = (oldPixel[0] + oldPixel[1] + oldPixel[2]) / 3;
        const newPixel = average > 128 ? 255 : 0;
        return [newPixel, newPixel, newPixel]
      }

      return [
        getColoredPixel(oldPixel[0]),
        getColoredPixel(oldPixel[1]),
        getColoredPixel(oldPixel[2]),
      ]
    }

    // Floyd-Steinberg dithering
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const pixelIndex = (y * canvas.width + x) * 4;

        const oldPixel = [
          data[pixelIndex],     // Red
          data[pixelIndex + 1], // Green
          data[pixelIndex + 2]  // Blue
        ];

        const newPixel = pixelPickStrategy(oldPixel)

        data[pixelIndex + 0] = newPixel[0]
        data[pixelIndex + 1] = newPixel[1]
        data[pixelIndex + 2] = newPixel[2]

        const quantError = [
          oldPixel[0] - data[pixelIndex],
          oldPixel[1] - data[pixelIndex + 1],
          oldPixel[2] - data[pixelIndex + 2]
        ];

        const errorDistribution = [
          { x: 1, y: 0, factor: 7 / 16 },
          { x: -1, y: 1, factor: 3 / 16 },
          { x: 0, y: 1, factor: 5 / 16 },
          { x: 1, y: 1, factor: 1 / 16 }
        ];

        errorDistribution.forEach(err => {
          const newX = x + err.x;
          const newY = y + err.y;

          if (newX >= 0 && newX < canvas.width && newY >= 0 && newY < canvas.height) {
            const newPixelIndex = (newY * canvas.width + newX) * 4;

            for (let i = 0; i < 3; i++) {
              let errorValue = quantError[i] * err.factor;
              data[newPixelIndex + i] = Math.min(255, Math.max(0, data[newPixelIndex + i] + errorValue));
            }
          }
        });
      }
    }

    // De volta ao canvas
    ctx.putImageData(imageData, 0, 0);

    imgElement.src = canvas.toDataURL('image/png');
    imgElement.dataset.ditter = 'y'
  };

  // Se a imagem já carregou a gente roda o onload na mão!
  if (imgElement.complete) {
    // @ts-ignore
    imgElement.onload();
  }
}
