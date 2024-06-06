import { Quadrilateral } from "./perspective";

export type Background = {
  box: [number, number, number, number];
  color: string;
};

export type Area = {
  start: [number, number];
  size: [number, number];
  pxSpacing: [number, number];
  pxSize: number;

  cluster?: {
    size: [number, number],
    spacing: [number, number],
  };

  font: string;
  on: string;
  off: string;
};

type Params = {
  _base: string;

  image: string;

  renderArea: [number, number];

  drawArea: Quadrilateral;

  background: Background[];

  colors?: {
    [name: string]: string;
  };

  areas: {
    [key: string]: Area;
  };
}

export default Params;
