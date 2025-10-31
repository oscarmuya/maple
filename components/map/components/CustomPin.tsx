import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet } from "react-native";
import { LatLng, Marker } from "react-native-maps";

type Props = {
  text: string;
  coords: LatLng;
};

const CustomPin = ({ text, coords }: Props) => {
  return (
    <Marker coordinate={coords} tracksViewChanges={false}>
      <ThemedView
        style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        className={`bg-white rounded border p-1 px-2`}
      >
        <ThemedView>
          <ThemedText className={`text-xs text-center`}>{text}</ThemedText>
        </ThemedView>
      </ThemedView>
      <ThemedView className="items-center">
        <ThemedView style={styles.pinPoint} />
      </ThemedView>
    </Marker>
  );
};

const styles = StyleSheet.create({
  pinContainer: {
    alignItems: "center",
  },
  pinPoint: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 5,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "black",
    transform: [{ rotate: "180deg" }],
  },
});

export default CustomPin;
