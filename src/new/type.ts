type Tuple<TItem, TLength extends number> = [TItem, ...TItem[]] & {
  length: TLength;
};

export type Vector3 = Tuple<number, 3>;
export type Matrix4 = Tuple<number, 16>;
export type Color = Tuple<number, 4>;

export type CameraViewport = {
  fov?: number; // 相机视区视角
  aspect?: number; // 视区长宽比例
  near?: number; // 最近可视距离
  far?: number; //最远可视距离
};

export type ModelTransformOption = {
  translate?: Vector3;
  rotate?: Vector3;
  scale?: Vector3;
};

export type Mesh = {
  points: number[];
  indices: number[];
};
