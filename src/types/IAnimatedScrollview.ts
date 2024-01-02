import { ReactElement } from "react";
import { IConfigWithoutMeasurements } from "$/types/IConfigWithoutMeasurements";
import { ViewStyle } from "react-native";

export interface IAnimatedScrollview {
  children: ReactElement[];
  config: {
    [key: string]: IConfigWithoutMeasurements;
  };
  style?: ViewStyle;
}
