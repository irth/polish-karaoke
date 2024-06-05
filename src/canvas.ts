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
