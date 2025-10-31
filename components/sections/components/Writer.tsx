import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { transformText } from "@/constants/helpers";
import TypeWriter from "../../writer/index";

const delayMap = [{ at: /[.,!?;:"\[\]{}\-\/\\]/g, delay: 400 }];

interface Props {
  recPlaceTypes: string[];
  endType: () => void;
  typedText: string;
}

const Writer = ({ endType, recPlaceTypes, typedText }: Props) => {
  return (
    <ThemedView className="p-4 pt-0">
      <ThemedView className="flex flex-wrap py-4 flex-row gap-2">
        {recPlaceTypes.map((item) => (
          <ThemedView
            key={item}
            className="bg-gray-100 border p-1 px-2 border-gray-400 rounded-full"
          >
            <ThemedText className="text-center text-sm">
              {transformText(item)}
            </ThemedText>
          </ThemedView>
        ))}
      </ThemedView>
      <TypeWriter
        dataDetectorType="all"
        minDelay={5}
        maxDelay={10}
        initialDelay={0}
        delayMap={delayMap}
        style={{ fontFamily: "Jost_700Bold", fontSize: 20 }}
        onTypingEnd={endType}
        typing={1}
      >
        {String(typedText ?? "")}
      </TypeWriter>
    </ThemedView>
  );
};

export default Writer;
