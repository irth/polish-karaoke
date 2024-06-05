import Perspective from "perspectivejs";
import { canvasToImage } from "./canvas";

export type Quadrilateral = {
  topLeft: [number, number];
  topRight: [number, number];
  bottomRight: [number, number];
  bottomLeft: [number, number];
};

export async function paste(ctx: CanvasRenderingContext2D, source: HTMLCanvasElement, q: Quadrilateral) {
  const img = await canvasToImage(source);
  const perspective = new Perspective(ctx, img);
  perspective.draw([
    q.topLeft,
    q.topRight,
    q.bottomRight,
    q.bottomLeft,
  ])
}
