import { Quadrilateral } from "./perspective";

export type Background = {
  box: [number, number, number, number];
  color: string;
};

export type DrawingArea = {
  start: [number, number];
  size: [number, number];
  pxSpacing: [number, number];
  pxSize: number;

  cluster?: {
    size: [number, number],
    spacing: [number, number],
  };

  text: { [key: string]: TextArea; }

  on: string;
  off: string;
};

export type TextArea = {
  start: [number, number];
  size: [number, number];
  align?: 'left' | 'center' | 'right';
  drawingArea: string;
  font: string;
}

type Params = {
  _base: string;

  image: string;

  renderArea: [number, number];

  perspective: Quadrilateral;

  background: Background[];

  colors?: {
    [name: string]: string;
  };

  areas: {
    [key: string]: DrawingArea;
  };
}

export default Params;
