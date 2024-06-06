import { Area } from "./params";

export function createCanvas([width, height]: [number, number]): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext('2d');
  if (ctx == null) throw new Error("Couldn't obtain canvas rendering context");
  return [canvas, ctx];
}

export function createAreaCanvas(a: Area): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const s: [number, number] = [a.size[0], a.size[1]]
  const [c, ctx] = createCanvas(s);
  ctx.fillStyle = "white"
  ctx.fillRect(0, 0, ...s);
  return [c, ctx];
}

export function loadImage(path: string): Promise<HTMLImageElement> {
  return new Promise((resolve, _reject) => {
    const img = new Image();
    img.onload = () => {
      resolve(img);
    }
    img.onerror = () => {
      throw Error(`Image "${path}" failed to load`)
    }
    img.src = path;
    // TODO: handle errors?
  });
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob != null) resolve(blob);
      else reject('Failed to obtain blob from canvas');
    })
  })
}

export async function canvasToImage(canvas: HTMLCanvasElement): Promise<HTMLImageElement> {
  const blob = await canvasToBlob(canvas);
  const url = URL.createObjectURL(blob);
  try {
    const image = await loadImage(url);
    return image;
  }
  finally {
    URL.revokeObjectURL(url);
  }
}

export function imageToCanvas(image: HTMLImageElement): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const [c, ctx] = createCanvas([image.width, image.height]);
  ctx.drawImage(image, 0, 0);
  return [c, ctx]
}
