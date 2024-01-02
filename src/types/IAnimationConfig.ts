import { ITransform } from "$/types/ITransform";
import {
  ITransformConfig,
  ITransformConfigWithUnit, ITransformConfigWithUnitAndPixelValues,
} from "$/types/ITransformConfig";

type ITransforms = {
  [key in ITransform]?: ITransformConfig;
};

export type IAnimationConfig = ITransforms & {
  translateX?: ITransformConfigWithUnit;
  translateY?: ITransformConfigWithUnit;
  order?: ITransform[];
  opacity?: ITransformConfig;
};

export type IAnimationConfigComplete = IAnimationConfig & {
  translateX?: ITransformConfigWithUnitAndPixelValues;
  translateY?: ITransformConfigWithUnitAndPixelValues;
};
