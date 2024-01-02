import Animated, {
  AnimatableValue,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { LayoutChangeEvent } from "react-native";
import React, { Children, cloneElement, ReactElement, useState } from "react";
import { IConfigWithoutMeasurements } from "$/types/IConfigWithoutMeasurements";
import {
  IConfigComplete,
  IConfigWithMeasurements,
} from "$/types/IConfigWithMeasurements";
import { getTransforms } from "$/components/ScrollViewChild/getTransforms";
import { IAnimationConfigComplete } from "$/types/IAnimationConfig";
import { defaultSpringConfig } from "$/config/defaultSpringConfig";

interface ScrollViewChildProps {
  child: ReactElement;
  scrollOffset: SharedValue<number>;
  parentHeight: number | undefined;
  allConfigs: { [p: string]: IConfigWithoutMeasurements };
  topOffsetParent: number;
}

export const ScrollViewChild = ({
  child,
  scrollOffset,
  parentHeight,
  allConfigs,
  topOffsetParent,
}: ScrollViewChildProps) => {
  const configOfChild = child.key ? allConfigs[child.key] : undefined;
  const [config, setConfig] = useState(configOfChild);
  const maxValueSoFar = useSharedValue<number>(0);

  useAnimatedReaction(
    () => {
      return scrollOffset;
    },
    (scrollOffsetPrepared) => {
      if (!config?.fixate || scrollOffsetPrepared.value > maxValueSoFar.value) {
        maxValueSoFar.value = scrollOffsetPrepared.value;
      }
    },
  );

  const triggerStart =
    !parentHeight || (config as IConfigWithMeasurements)?.top === undefined
      ? 0
      : (config as IConfigWithMeasurements).top +
        topOffsetParent -
        parentHeight +
        (parentHeight * (config?.relativeOffsetFromBottom ?? 0)) / 100;

  const triggerEnd =
    (config as IConfigWithMeasurements)?.height === undefined
      ? 0
      : triggerStart + (config as IConfigWithMeasurements).height;

  // @ts-ignore TODO
  const animatedStyle = useAnimatedStyle(() => {
    if (!(config as IConfigWithMeasurements)?.top || !parentHeight) {
      return {};
    }

    const amBeforeTriggerZone = maxValueSoFar.value < triggerStart;
    const amAfterTriggerZone = maxValueSoFar.value > triggerEnd;

    const transforms = getTransforms(
      maxValueSoFar,
      config?.animation as IAnimationConfigComplete,
      amBeforeTriggerZone,
      amAfterTriggerZone,
      triggerStart,
      triggerEnd,
      (config as IConfigWithMeasurements).width,
      (config as IConfigWithMeasurements).height,
    );
    const withSpringWithConfig = (toValue: AnimatableValue) =>
      withSpring<number | string>(
        toValue as string | number,
        config?.springConfig ?? defaultSpringConfig,
      );

    const { opacity, transform } = transforms;
    return {
      opacity: withSpringWithConfig(opacity),
      transform: config?.animation?.order?.map((o, index) => {
        return {
          // @ts-ignore TODO
          [o]: withSpringWithConfig(transform[index][o]),
        };
      }),
    };
  });

  const newChildren = Children.map(child.props.children, (c) => {
    const childKey = c.key;
    if (!childKey) {
      return c;
    }
    const configForChild = allConfigs[childKey];
    if (!configForChild) {
      return c;
    }
    return (
      <ScrollViewChild
        key={c.key}
        child={c}
        scrollOffset={scrollOffset}
        parentHeight={parentHeight}
        allConfigs={allConfigs}
        topOffsetParent={(config as IConfigWithMeasurements)?.top ?? 0}
      />
    );
  });

  const onLayout = ({
    nativeEvent: {
      layout: { x, y, width, height },
    },
  }: LayoutChangeEvent) => {
    setConfig((prevState) => {
      const newState: IConfigComplete = !prevState
        ? ({} as IConfigComplete)
        : (JSON.parse(JSON.stringify(prevState)) as IConfigComplete);
      newState.top = y;
      newState.width = width;
      newState.height = height;

      const translateXUsed = configOfChild?.animation?.translateX !== undefined;

      if (translateXUsed) {
        newState.animation!.translateX!.startInPixel =
          configOfChild.animation!.translateX!.unit === "%"
            ? ((configOfChild.animation!.translateX!.start ?? 0) / 100) * width
            : configOfChild.animation!.translateX!.start ?? 0;

        newState.animation!.translateX!.endInPixel =
          configOfChild.animation!.translateX!.unit === "%"
            ? ((configOfChild.animation!.translateX!.end ?? 0) / 100) * width
            : configOfChild.animation!.translateX!.end ?? 0;
      }

      const translateYUsed = configOfChild?.animation?.translateY !== undefined;

      if (translateYUsed) {
        newState.animation!.translateY!.startInPixel =
          configOfChild.animation!.translateY!.unit === "%"
            ? ((configOfChild.animation!.translateY!.start ?? 0) / 100) * height
            : configOfChild.animation!.translateY!.start ?? 0;

        newState.animation!.translateY!.endInPixel =
          configOfChild.animation!.translateY!.unit === "%"
            ? ((configOfChild.animation!.translateY!.end ?? 0) / 100) * height
            : configOfChild.animation!.translateY!.end ?? 0;
      }

      return newState;
    });
  };

  const childPrepared = cloneElement(
    child,
    { ...child.props, onLayout },
    ...newChildren,
  );

  if (!configOfChild) {
    return childPrepared;
  }

  return (
    <Animated.View
      style={[
        {
          position: child.props?.style?.position ?? "relative",
          zIndex: child.props?.style?.zIndex ?? undefined,
          width: child.props?.style?.width ?? undefined,
          height: child.props?.style?.height ?? undefined,
        },
        animatedStyle,
      ]}
      onLayout={onLayout}
    >
      {childPrepared}
    </Animated.View>
  );
};
