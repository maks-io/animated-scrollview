import { ISpringConfig } from "$/types/ISpringConfig";
import { IAnimationConfig } from "$/types/IAnimationConfig";

export interface IConfigWithoutMeasurements {
  animation: IAnimationConfig;
  relativeOffsetFromBottom?: number;
  fixate?: boolean;
  springConfig?: ISpringConfig;
}
