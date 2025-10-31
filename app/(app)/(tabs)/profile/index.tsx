import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { getCurrency } from "@/lib/store/features/userSlice";
import { useAppSelector } from "@/lib/store/storeHooks";
import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const menus = ["settings", "currency", "preferences"];

const index = () => {
  const myCurrency = useAppSelector(getCurrency);
  return (
    <SafeAreaView>
      <ScrollView>
        <ThemedView className="px-4">
          <ThemedView className="mt-4">
            <ThemedText type="subtitle" style={{ fontSize: 35 }}>
              Profile
            </ThemedText>
          </ThemedView>

          {/* rows */}
          <ThemedView className="mt-8">
            {menus.map((item) => (
              <TouchableWithoutFeedback
                key={item}
                onPress={() => router.navigate("profile/" + item)}
              >
                <ThemedView className="w-full mb-3 px-5 p-3 border border-gray-400 bg-white rounded relative">
                  <ThemedView className="flex-row items-center justify-between">
                    <ThemedText className="text-black capitalize text-sm">
                      {item}
                    </ThemedText>
                    <Entypo size={20} name="chevron-right" />
                  </ThemedView>
                </ThemedView>
              </TouchableWithoutFeedback>
            ))}
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default index;
