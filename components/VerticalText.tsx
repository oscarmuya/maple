import { StyleSheet } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";

interface Props {
  text: string;
}

const VerticalText = ({ text }: Props) => {
  return (
    <ThemedView style={styles.container}>
      {text
        .split("")
        .reverse()
        .map((char, index) => (
          <ThemedText
            className="text-xl"
            type="subtitle"
            key={index}
            style={styles.character}
          >
            {char}
          </ThemedText>
        ))}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  character: {
    transform: [{ rotate: "-90deg" }],
    marginVertical: 0, // Adjust spacing between characters
  },
});

export default VerticalText;
