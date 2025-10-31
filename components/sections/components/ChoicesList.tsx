import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TouchableOpacity } from "@gorhom/bottom-sheet";

interface Props {
  picked_choice: (s: any) => void;
  choices: string[];
}

const ChoicesList = ({ choices, picked_choice }: Props) => {
  return (
    <ThemedView className="items-center flex p-4 flex-row justify-center gap-4">
      {choices.map((item) => (
        <ThemedView key={item} className="bg-primary flex-1 rounded-full">
          <TouchableOpacity onPress={() => picked_choice(item)}>
            <ThemedView className="bg-primary rounded-full px-5 p-3">
              <ThemedText
                numberOfLines={1}
                adjustsFontSizeToFit
                className="text-white text-sm text-center"
              >
                {item}
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>
        </ThemedView>
      ))}
    </ThemedView>
  );
};

export default ChoicesList;

export const ChoicesListLong = ({ choices, picked_choice }: Props) => {
  return (
    <ThemedView className="items-center flex p-4 justify-center gap-2">
      {choices.map((item) => (
        <ThemedView
          key={item}
          className="w-full px-5 mt-2 p-3 border border-gray-400 bg-white rounded"
        >
          <TouchableOpacity onPress={() => picked_choice(item)}>
            <ThemedText className="text-black text-sm">{item}</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      ))}
    </ThemedView>
  );
};
