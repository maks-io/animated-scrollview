export interface ITransformConfig {
  start?: number;
  end?: number;
}

export interface ITransformConfigWithUnit extends ITransformConfig {
  unit: "%" | "px";
}

export interface ITransformConfigWithUnitAndPixelValues
  extends ITransformConfigWithUnit {
  startInPixel: number;
  endInPixel: number;
}
