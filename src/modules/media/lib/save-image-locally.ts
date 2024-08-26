export async function saveImageLocally(file: File, localStorageKey: string) {
  try {
    const base64 = await getBase64Image(file);

    if (!base64) {
      throw new Error('Não foi possível obter a imagem em base64');
    }

    localStorage.setItem(localStorageKey, base64);

    return base64;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Não foi possível salvar a imagem localmente');
  }
}

function getBase64Image(file: File) {
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return;
  }

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const image = new Image();
  image.src = URL.createObjectURL(file);

  return new Promise<string>((resolve, reject) => {
    image.onload = () => {
      if (!ctx) {
        return;
      }

      ctx.drawImage(image, 0, 0, 200, 200);

      resolve(canvas.toDataURL('image/jpeg'));
    };

    image.onerror = error => {
      reject(error);
    };
  });
}
