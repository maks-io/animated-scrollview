import React, { ReactElement, useState } from "react";
import { IAnimatedScrollview } from "$/types/IAnimatedScrollview";
import Animated, { useSharedValue } from "react-native-reanimated";
import { ScrollViewChild } from "$/components/ScrollViewChild";

export const AnimatedScrollview = ({
  children,
  config,
  style = {},
}: IAnimatedScrollview): ReactElement => {
  const scrollOffset = useSharedValue(0);
  const [height, setHeight] = useState<number>();

  return (
    <Animated.ScrollView
      scrollEventThrottle={16}
      onScroll={(event) => {
        scrollOffset.value = event.nativeEvent.contentOffset.y;
      }}
      style={style}
      onLayout={({
        nativeEvent: {
          layout: { height },
        },
      }) => {
        setHeight(height);
      }}
    >
      {!children || !height
        ? null
        : (!Array.isArray(children) ? [children] : children).map((child) => {
            return (
              <ScrollViewChild
                key={child.key}
                child={child}
                scrollOffset={scrollOffset}
                parentHeight={height}
                allConfigs={config}
                topOffsetParent={0}
              />
            );
          })}
    </Animated.ScrollView>
  );
};
