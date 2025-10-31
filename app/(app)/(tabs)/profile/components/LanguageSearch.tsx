import { TextInput, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { languages } from "@/constants/languages";
import { ThemedText } from "@/components/ThemedText";
import { useAppDispatch, useAppSelector } from "@/lib/store/storeHooks";
import { addLanguage, getLanguages } from "@/lib/store/features/userSlice";

const LanguageSearch = () => {
  const dispatch = useAppDispatch();
  const [value, setValue] = useState("");
  const myLanguages = useAppSelector(getLanguages);
  const [filteredLanguages, setFilteredLanguages] = useState(languages);

  useEffect(() => {
    const t = languages.filter((p) =>
      p.name.toLowerCase().includes(value.toLocaleLowerCase())
    );
    const p = t.filter((p) => !myLanguages.includes(p));
    setFilteredLanguages(p);
  }, [value, myLanguages]);

  return (
    <ThemedView className="border-t border-t-gray-200 pt-2">
      <ThemedView className="py-4">
        <TextInput
          keyboardType="default"
          cursorColor="gray"
          placeholderTextColor="gray"
          multiline
          autoCorrect={false}
          value={value}
          placeholder="Search language"
          onChangeText={(i) => setValue(i)}
          style={{ fontFamily: "Jost_400Regular" }}
          className="rounded-[23px] text-base min-h-[40] text-gray bg-[#E3E3E3] w-full p-2 px-4"
        />
      </ThemedView>

      <ThemedView className="flex-row w-full flex-wrap gap-2">
        {filteredLanguages.length == 0 && (
          <ThemedView className="items-center w-full">
            <ThemedText className="text-center">
              No languages found!!
            </ThemedText>
          </ThemedView>
        )}
        {filteredLanguages.slice(0, 10).map((item) => (
          <TouchableOpacity
            onPress={() => dispatch(addLanguage(item))}
            key={item.name}
          >
            <ThemedView className="border border-gray-200 bg-gray-100 rounded-full p-1 px-4">
              <ThemedText>{item.name}</ThemedText>
            </ThemedView>
          </TouchableOpacity>
        ))}
      </ThemedView>
    </ThemedView>
  );
};

export default LanguageSearch;
