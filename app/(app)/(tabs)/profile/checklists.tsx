import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { getMyCheckLists } from "@/lib/store/features/interactionSlice";
import { useAppSelector } from "@/lib/store/storeHooks";
import { useEffect } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const checklists = () => {
  const myChecklists = useAppSelector(getMyCheckLists);

  return (
    <SafeAreaView>
      <ScrollView>
        <ThemedView className="p-4">
          <ThemedText type="subtitle" className="text-4xl mt-2">
            Checklists
          </ThemedText>
        </ThemedView>

        {/* list */}

        <ThemedView>
          {myChecklists.map((item, index) => (
            <ThemedView key={index}>
              <ThemedText>{item.place.text}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default checklists;
