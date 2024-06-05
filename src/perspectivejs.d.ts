import * as perspectivejs from "perspectivejs";

declare module "perspectivejs" {
  export default class Perspective {
    constructor(ctx: CanvasRenderingContext2D, img: HTMLImageElement)

    draw(quad: [
      [number, number],
      [number, number],
      [number, number],
      [number, number],
    ])
  }
}
