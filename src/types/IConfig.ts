import { IConfigWithoutMeasurements } from "$/types/IConfigWithoutMeasurements";

export interface IConfig {
  [key: string]: IConfigWithoutMeasurements;
}
