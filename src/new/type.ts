type Tuple<TItem, TLength extends number> = [TItem, ...TItem[]] & {
  length: TLength;
};

export type Vector3 = Tuple<number, 3>;
export type Matrix4 = Tuple<number, 16>;

export type CameraOption = {
  type?: number; //相机类型：透视/正交
  position?: Vector3; //相机所处位置
  focus?: Vector3; //相机的焦点
  up?: Vector3; //相机的姿态
  viewport?: CameraViewport; //相机的视区
};

export type CameraViewport = {
  fov?: number; // 相机视区视角
  aspect?: number; // 视区长宽比例
  near?: number; // 最近可视距离
  far?: number; //最远可视距离
};
