import React, { useEffect, useCallback } from "react";
import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withSequence,
  runOnJS,
  cancelAnimation,
  WithTimingConfig,
} from "react-native-reanimated";

const AnimatedText = Animated.createAnimatedComponent(Animated.Text);

type Direction = -1 | 0 | 1;

interface TypewriterProps {
  text: string;
  style?: TextStyle | ViewStyle;
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenWords?: number;
  delayAfterLine?: number;
  cursorCharacter?: string;
  cursorBlinkSpeed?: number;
  loop?: boolean;
  onTypingStart?: () => void;
  onTypingEnd?: () => void;
  onLineTyped?: (line: string) => void;
  onLineDeleted?: (line: string) => void;
}

const defaultProps: Partial<TypewriterProps> = {
  typingSpeed: 50,
  deletingSpeed: 30,
  delayBetweenWords: 500,
  delayAfterLine: 2000,
  cursorCharacter: "|",
  cursorBlinkSpeed: 500,
  loop: false,
};

export const Typewriter: React.FC<TypewriterProps> = (props) => {
  const {
    text,
    style,
    typingSpeed,
    deletingSpeed,
    delayBetweenWords,
    delayAfterLine,
    cursorCharacter,
    cursorBlinkSpeed,
    loop,
    onTypingStart,
    onTypingEnd,
    onLineTyped,
    onLineDeleted,
  } = { ...defaultProps, ...props };

  const displayedText = useSharedValue("");
  const cursorVisible = useSharedValue(1);
  const isTyping = useSharedValue(true);
  const currentLineIndex = useSharedValue(0);

  const lines = text.split("\n");

  const animatedProps = useAnimatedProps(() => ({
    text:
      displayedText.value + (cursorVisible.value === 1 ? cursorCharacter : " "),
  }));

  const typeText = useCallback(
    (line: string, onComplete?: () => void) => {
      const textLength = line.length;
      let currentIndex = 0;

      const typeNextChar = () => {
        if (currentIndex <= textLength) {
          displayedText.value = line.slice(0, currentIndex);
          currentIndex++;
          setTimeout(typeNextChar, typingSpeed);
        } else {
          onComplete && onComplete();
        }
      };

      typeNextChar();
    },
    [displayedText, typingSpeed]
  );

  const deleteText = useCallback(
    (onComplete?: () => void) => {
      const deleteNextChar = () => {
        if (displayedText.value.length > 0) {
          displayedText.value = displayedText.value.slice(0, -1);
          setTimeout(deleteNextChar, deletingSpeed);
        } else {
          onComplete && onComplete();
        }
      };

      deleteNextChar();
    },
    [displayedText, deletingSpeed]
  );

  const animateLine = useCallback(
    (lineIndex: number) => {
      const currentLine = lines[lineIndex];

      typeText(currentLine, () => {
        if (onLineTyped) runOnJS(onLineTyped)(currentLine);
        setTimeout(() => {
          deleteText(() => {
            if (onLineDeleted) runOnJS(onLineDeleted)(currentLine);
            if (lineIndex < lines.length - 1 || loop) {
              setTimeout(() => {
                runOnJS(animateLine)((lineIndex + 1) % lines.length);
              }, delayBetweenWords);
            } else {
              isTyping.value = false;
              if (onTypingEnd) runOnJS(onTypingEnd)();
            }
          });
        }, delayAfterLine);
      });
    },
    [
      lines,
      typeText,
      deleteText,
      loop,
      delayBetweenWords,
      delayAfterLine,
      onLineTyped,
      onLineDeleted,
      onTypingEnd,
    ]
  );

  useEffect(() => {
    const blinkCursor = () => {
      cursorVisible.value = withSequence(
        withTiming(0, { duration: cursorBlinkSpeed } as WithTimingConfig),
        withTiming(1, { duration: cursorBlinkSpeed } as WithTimingConfig)
      );
    };

    const intervalId = setInterval(blinkCursor, cursorBlinkSpeed ?? 0 * 2);

    if (onTypingStart) onTypingStart();
    animateLine(0);

    return () => {
      clearInterval(intervalId);
      cancelAnimation(cursorVisible);
      cancelAnimation(displayedText);
    };
  }, []);

  return (
    <Animated.Text style={[styles.text, style]}>
      {displayedText.value}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: "black",
  },
});
