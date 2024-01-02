import { IConfigWithoutMeasurements } from "$/types/IConfigWithoutMeasurements";
import { IAnimationConfigComplete } from "$/types/IAnimationConfig";

export interface IConfigWithMeasurements extends IConfigWithoutMeasurements {
  top: number;
  width: number;
  height: number;
}

export interface IConfigComplete extends IConfigWithMeasurements {
  animation: IAnimationConfigComplete;
}
