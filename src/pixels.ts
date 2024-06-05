import { Area, Background } from "./params";

export function drawBackgrounds(ctx: CanvasRenderingContext2D, backgrounds: Background[]) {
  backgrounds.forEach(bg => {
    ctx.fillStyle = bg.color;
    console.log("bg", bg)
    ctx.fillRect(...bg.box);
  })
}

export function drawArea(ctx: CanvasRenderingContext2D, area: Area, getValue: (pos: [number, number]) => boolean) {
  let [X, Y] = area.start;
  let [width, height] = area.size;
  let [chWidth, chHeight] = area.characterSize;
  let [x, y] = [X, Y];
  for (let vy = 0; vy < height * chHeight; vy++) {
    for (let vx = 0; vx < width * chWidth; vx++) {
      ctx.fillStyle = getValue([vx, vy]) ? area.on : area.off;
      ctx.beginPath();
      ctx.arc(x + area.pxSize / 2, y + area.pxSize / 2, area.pxSize / 2, 0, 2 * Math.PI);
      ctx.fill();
      x += area.pxSpacing[0];
      if ((vx + 1) % area.characterSize[0] == 0) x += area.characterSpacing[0];
    }
    x = X;
    y += area.pxSpacing[1];
    if ((vy + 1) % area.characterSize[1] == 0) y += area.characterSpacing[1];
  }
}
