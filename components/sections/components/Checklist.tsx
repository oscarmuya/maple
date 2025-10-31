import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

interface Props {
  checkList: string[];
  setChecklist: React.Dispatch<React.SetStateAction<string[]>>;
}

const Checklist = ({ checkList, setChecklist }: Props) => {
  return (
    <ThemedView className="p-3">
      <ThemedView className="p-3 pt-1 rounded bg-gray-200 flex flex-col justify-center">
        {checkList.map((item) => (
          <ThemedView
            key={item}
            className="px-5 mt-2 p-3 border border-gray-400 bg-white rounded"
          >
            <ThemedText className="text-black text-sm">{item}</ThemedText>
          </ThemedView>
        ))}
      </ThemedView>
    </ThemedView>
  );
};

export default Checklist;
