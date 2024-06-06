import Params, { Area } from "./params";

function getColor(params: Params, color: string): string {
  let colorMap = params.colors ?? {};
  return colorMap[color] ?? color;
}

export function drawBackgrounds(ctx: CanvasRenderingContext2D, params: Params) {
  params.background.forEach(bg => {
    ctx.fillStyle = getColor(params, bg.color);
    console.log("bg", bg)
    ctx.fillRect(...bg.box);
  })
}

export function drawArea(ctx: CanvasRenderingContext2D, params: Params, area: Area, getValue: (pos: [number, number]) => boolean) {
  const [X, Y] = area.start;
  const [width, height] = area.size;
  let [x, y] = [X, Y];

  const colorOn = getColor(params, area.on);
  const colorOff = getColor(params, area.off);

  for (let vy = 0; vy < height; vy++) {
    for (let vx = 0; vx < width; vx++) {
      ctx.fillStyle = getValue([vx, vy]) ? colorOn : colorOff;
      ctx.beginPath();
      ctx.arc(x + area.pxSize / 2, y + area.pxSize / 2, area.pxSize / 2, 0, 2 * Math.PI);
      ctx.fill();
      x += area.pxSpacing[0];
      if (area.cluster != null && (vx + 1) % area.cluster.size[0] == 0) x += area.cluster.spacing[0];
    }
    x = X;
    y += area.pxSpacing[1];
    if (area.cluster != null && (vy + 1) % area.cluster.size[1] == 0) y += area.cluster.spacing[1];
  }
}
