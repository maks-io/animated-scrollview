import { ReactElement } from "react";
import { ViewStyle } from "react-native";
import { IConfig } from "$/types/IConfig";

export interface IAnimatedScrollview {
  children: ReactElement | ReactElement[];
  config: IConfig;
  style?: ViewStyle;
}
