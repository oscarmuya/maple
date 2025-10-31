import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  cancelAnimation,
  useAnimatedReaction,
  withTiming,
  runOnJS,
  withSequence,
} from "react-native-reanimated";

const delayMapp = [{ at: /[.,!?;:"\[\]{}\-\/\\]/g, delay: 400 }];

const AnimatedText = Animated.createAnimatedComponent(Text);

interface Props {
  text: string;
  minDelay?: number;
  maxDelay?: number;
  initialDelay?: number;
  delayMap?: { at: any; delay: number }[];
}

const Typewriter = ({
  text,
  minDelay = 5,
  maxDelay = 10,
  initialDelay = 0,
  delayMap = delayMapp,
}: Props) => {
  const textLength = useSharedValue(0);
  const isTyping = useSharedValue(false);

  const getDelay = (index: number) => {
    "worklet";
    const char = text[index];
    for (const { at, delay } of delayMap) {
      if (typeof at === "string" && char === at) return delay;
      if (at instanceof RegExp && at.test(char)) return delay;
    }
    return Math.random() * (maxDelay - minDelay) + minDelay;
  };

  const typeNextChar = (index: number) => {
    "worklet";
    if (index >= text.length) {
      isTyping.value = false;
      return;
    }

    const delay = getDelay(index);
    textLength.value = withSequence(
      withTiming(index + 1, { duration: 0 }),
      withTiming(index + 1, { duration: delay }, () => {
        typeNextChar(index + 1);
      })
    );
  };

  useAnimatedReaction(
    () => isTyping.value,
    (isTypingNow) => {
      if (isTypingNow && textLength.value === 0) {
        runOnJS(typeNextChar)(0);
      }
    },
    [text, minDelay, maxDelay, delayMap]
  );

  useEffect(() => {
    textLength.value = 0;
    isTyping.value = false;

    const timeout = setTimeout(() => {
      isTyping.value = true;
    }, initialDelay);

    return () => {
      clearTimeout(timeout);
      cancelAnimation(textLength);
    };
  }, [text, minDelay, maxDelay, initialDelay, delayMap]);

  const animatedProps = useAnimatedProps(() => ({
    // children: text.slice(0, Math.floor(textLength.value)),
    children: "helooooo",
  }));

  return (
    <View>
      <AnimatedText style={{ color: "black" }} animatedProps={animatedProps}>
        {animatedProps.children}
      </AnimatedText>
    </View>
  );
};

export default Typewriter;
