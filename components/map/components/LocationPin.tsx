import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { LatLng, Marker } from "react-native-maps";
type Props = {
  text: string;
  coords: LatLng;
};
const LocationPin = ({ coords, text }: Props) => {
  return (
    <Marker coordinate={coords} tracksViewChanges={false}>
      <ThemedView className="items-center">
        <ThemedView className="bg-blue-800 border border-white rounded-full p-1 px-3">
          <ThemedText className="text-white">{text}</ThemedText>
        </ThemedView>
        <ThemedView className="h-[40] w-[6] border border-white bg-blue-800" />
        <ThemedView
          style={{ transform: [{ translateY: -3 }] }}
          className="bg-blue-800 border border-white w-[20] h-[20] rounded-full items-center justify-center"
        >
          <ThemedView className="bg-white rounded-full w-[10] h-[10]" />
        </ThemedView>
      </ThemedView>
    </Marker>
  );
};

export default LocationPin;
