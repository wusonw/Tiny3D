type Tuple<TItem, TLength extends number> = [TItem, ...TItem[]] & {
  length: TLength;
};

export type Vector = Tuple<number, 3>;
export type Point = Tuple<number, 3>;
export type Matrix = Tuple<number, 16>;
export type Color = Tuple<number, 4>;

export type Mesh = {
  vertex: number[];
  faces: number[];
};

export enum CameraType {
  PERSPECT,
  ORTHO,
}

export type GeometryTransform = {
  translate: Vector;
  rotate: Vector;
  scale: Vector;
};

export type OrthoCameraViewport = {
  left: number;
  right: number;
  top: number;
  bottom: number;
  near: number;
  far: number;
};

export type PerspectiveCameraViewport = {
  field: number;
  aspect: number;
  near: number;
  far: number;
};
