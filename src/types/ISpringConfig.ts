// copied type defintions from
// react-native-reanimated/lib/typescript/reanimated2/animation/springUtils

enum ReduceMotion {
  System = "system",
  Always = "always",
  Never = "never",
}

export type ISpringConfig = {
  stiffness?: number;
  overshootClamping?: boolean;
  restDisplacementThreshold?: number;
  restSpeedThreshold?: number;
  velocity?: number;
  reduceMotion?: ReduceMotion;
} & (
  | {
      mass?: number;
      damping?: number;
      duration?: never;
      dampingRatio?: never;
    }
  | {
      mass?: never;
      damping?: never;
      duration?: number;
      dampingRatio?: number;
    }
);
