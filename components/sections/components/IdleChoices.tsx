import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TouchableOpacity } from "react-native";

const idleRequests = [
  { text: "I'm feeling lucky.", step: 3 },
  { text: "I want to do something.", step: 10 },
  // { text: "Convert my currency.", step: 14 },
];

interface Props {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

const IdleChoices = ({ setStep }: Props) => {
  return (
    <ThemedView className="p-3">
      <ThemedView className="flex flex-wrap flex-row gap-2">
        {idleRequests.map((item) => (
          <ThemedView
            key={item.text}
            className="p-1 px-3 border border-gray-400 bg-gray-100 rounded-full"
          >
            <TouchableOpacity onPress={() => setStep(item.step)}>
              <ThemedText className="text-black text-sm">
                {item.text}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        ))}
      </ThemedView>
    </ThemedView>
  );
};

export default IdleChoices;
