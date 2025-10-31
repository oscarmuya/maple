import { SafeAreaView } from "react-native";
import Map from "@/components/map/Map";
import { useSharedValue } from "react-native-reanimated";
import { useState } from "react";
import MainInteraction from "@/components/sections/MainInteractions";
import Interaction from "@/components/sections/Interaction";

export default function HomeScreen() {
  const interactionHeight = useSharedValue(0);
  const [bottomHeight, setBottomHeight] = useState(0);

  return (
    <SafeAreaView style={{ height: "100%" }}>
      <Map bottomHeight={bottomHeight} interactionHeight={interactionHeight} />
      <Interaction
        setBottomHeight={setBottomHeight}
        interactionHeight={interactionHeight}
      />
    </SafeAreaView>
  );
}
