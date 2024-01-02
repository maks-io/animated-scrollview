import { IAnimationConfigComplete } from "$/types/IAnimationConfig";
import { ITransform } from "$/types/ITransform";
import { ITransformConfigWithUnitAndPixelValues } from "$/types/ITransformConfig";
import { interpolate, SharedValue } from "react-native-reanimated";

type ITransportConfigIndividual = {
  [transform in ITransform]?: number | string;
};

export const getTransforms = (
  maxValueSoFar: SharedValue<number>,
  animationConfig: IAnimationConfigComplete | undefined,
  amBeforeTriggerZone: boolean,
  amAfterTriggerZone: boolean,
  triggerStart: number,
  triggerEnd: number,
  width?: number,
  height?: number,
) => {
  "worklet";

  if (!animationConfig || !width || !height) {
    return { opacity: 1, transform: [] };
  }
  const { order = [] } = animationConfig;
  const transformConfig: ITransportConfigIndividual[] = [];
  let opacity;

  if (amBeforeTriggerZone) {
    if (animationConfig.opacity) {
      opacity = animationConfig.opacity.start ?? 1;
    }
    order.forEach((transformName) => {
      const transformC = animationConfig[transformName];
      if (!transformC) {
        return;
      }
      const tc: ITransportConfigIndividual = {};
      if (transformName === "rotate") {
        tc.rotate = transformC?.start ? `${transformC.start}deg` : "0deg";
      } else if (transformName === "scale") {
        tc.scale = transformC?.start ?? 1;
      } else if (transformName === "translateX") {
        if (!transformC.start) {
          tc.translateX = 0;
        } else {
          tc.translateX = (
            transformC as ITransformConfigWithUnitAndPixelValues
          ).startInPixel;
        }
      } else if (transformName === "translateY") {
        if (!transformC.start) {
          tc.translateY = 0;
        } else {
          tc.translateY = (
            transformC as ITransformConfigWithUnitAndPixelValues
          ).startInPixel;
        }
      }
      transformConfig.push(tc);
    });
  } else if (amAfterTriggerZone) {
    if (animationConfig.opacity) {
      opacity = animationConfig.opacity.end ?? 1;
    }
    order.forEach((transformName) => {
      const transformC = animationConfig[transformName];
      if (!transformC) {
        return;
      }
      const tc: ITransportConfigIndividual = {};
      if (transformName === "rotate") {
        tc.rotate = transformC?.end ? `${transformC.end}deg` : "0deg";
      } else if (transformName === "scale") {
        tc.scale = transformC?.end ?? 1;
      } else if (transformName === "translateX") {
        if (!transformC.end) {
          tc.translateX = 0;
        } else {
          tc.translateX = (
            transformC as ITransformConfigWithUnitAndPixelValues
          ).endInPixel;
        }
      } else if (transformName === "translateY") {
        if (!transformC.end) {
          tc.translateY = 0;
        } else {
          tc.translateY = (
            transformC as ITransformConfigWithUnitAndPixelValues
          ).endInPixel;
        }
      }
      transformConfig.push(tc);
    });
  } else {
    if (animationConfig.opacity) {
      opacity = interpolate(
        maxValueSoFar.value,
        [triggerStart, triggerEnd],
        [
          animationConfig!.opacity?.start ?? 1,
          animationConfig!.opacity?.end ?? 1,
        ],
      );
    }
    order.forEach((transformName) => {
      const transformC = animationConfig[
        transformName
      ] as ITransformConfigWithUnitAndPixelValues;

      const tc: ITransportConfigIndividual = {};

      const i = interpolate(
        maxValueSoFar.value,
        [triggerStart, triggerEnd],
        [
          transformC.startInPixel ?? transformC.start,
          transformC.endInPixel ?? transformC.end,
        ],
      );
      tc[transformName] = transformName === "rotate" ? `${i}deg` : i;
      transformConfig.push(tc);
    });
  }

  return { opacity: opacity ?? 1, transform: transformConfig };
};
