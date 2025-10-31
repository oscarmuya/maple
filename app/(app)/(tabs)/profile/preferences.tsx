import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useAppDispatch, useAppSelector } from "@/lib/store/storeHooks";
import {
  deleteLanguage,
  getLanguages,
  getPriceLevel,
  setPriceLevel,
} from "@/lib/store/features/userSlice";
import { useState } from "react";
import LanguageSearch from "./components/LanguageSearch";
import { Ionicons } from "@expo/vector-icons";

const priceLevels = [
  "Any",
  "Free",
  "Inexpensive",
  "Moderate",
  "Expensive",
  "Very Expensive",
];

const preferences = () => {
  const dispatch = useAppDispatch();
  const myPriceLevel = useAppSelector(getPriceLevel);
  const myLanguages = useAppSelector(getLanguages);
  const [addLanguage, setAddLanguage] = useState(false);

  return (
    <SafeAreaView>
      <ScrollView>
        <ThemedView className="p-4">
          {/* languages */}
          <ThemedView className="rounded mb-3 bg-white p-4">
            <ThemedView className="flex-row justify-between">
              <ThemedView className="w-[70%]">
                <ThemedText className="" type="subtitle">
                  What languages do you speak
                </ThemedText>
                <ThemedText className="text-sm ">
                  This will be used to get the most convenient places for you
                </ThemedText>
              </ThemedView>
              <ThemedView>
                <TouchableWithoutFeedback
                  onPress={() => setAddLanguage((p) => !p)}
                >
                  <ThemedView>
                    <ThemedText type="subtitle" className="underline text-lg">
                      {addLanguage ? "Close" : "Add"}
                    </ThemedText>
                  </ThemedView>
                </TouchableWithoutFeedback>
              </ThemedView>
            </ThemedView>

            <ThemedView className="flex-row py-3 pb-5 w-full flex-wrap gap-2">
              {myLanguages.map((item) => (
                <ThemedView
                  key={item.name}
                  className="border flex-row items-center border-gray-200 bg-gray-100 rounded-full p-1 pl-4 pr-1"
                >
                  <ThemedText>{item.name}</ThemedText>
                  <TouchableOpacity
                    onPress={() => dispatch(deleteLanguage(item))}
                    className="ml-2"
                  >
                    <ThemedView className="w-6 border border-gray-200 h-6 rounded-full bg-white items-center justify-center">
                      <Ionicons name="close" />
                    </ThemedView>
                  </TouchableOpacity>
                </ThemedView>
              ))}
            </ThemedView>

            {addLanguage && <LanguageSearch />}
          </ThemedView>

          {/* price level */}
          <ThemedView className="rounded bg-white p-4">
            <ThemedView>
              <ThemedText className="" type="subtitle">
                What price level do you prefer
              </ThemedText>
              <ThemedText className="text-sm">
                I'll prioritize your preferred price level
              </ThemedText>
            </ThemedView>

            <ThemedView className="flex-row py-3 w-full flex-wrap gap-2">
              {priceLevels.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => dispatch(setPriceLevel(item))}
                >
                  <ThemedView
                    className={`${
                      myPriceLevel === item
                        ? "bg-primary border-primary"
                        : "bg-gray-100 border-gray-200"
                    } border flex-row items-center rounded-full p-1 px-4`}
                  >
                    <ThemedText
                      className={
                        myPriceLevel === item ? "text-white" : "text-black"
                      }
                    >
                      {item}
                    </ThemedText>
                  </ThemedView>
                </TouchableOpacity>
              ))}
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default preferences;
