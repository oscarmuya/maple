import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { formatDatetime } from "@/constants/time_format";
import { TouchableOpacity } from "react-native";

interface Props {
  showMode: (s: "date" | "time") => void;
  date: Date;
}

const DatePicker = ({ date, showMode }: Props) => {
  return (
    <ThemedView className="items-center">
      <ThemedView className="flex-row mb-4 w-full px-4 justify-between">
        <TouchableOpacity
          activeOpacity={0.8}
          className="bg-primary w-[48%] rounded p-3 px-4"
          onPress={() => showMode("date")}
        >
          <ThemedText className="text-white text-center">
            Change Date
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          className="bg-primary w-[48%] rounded p-3 px-4"
          onPress={() => showMode("time")}
        >
          <ThemedText className="text-white text-center">
            Change Time
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
      <ThemedText type="defaultSemiBold">{formatDatetime(date)}</ThemedText>
    </ThemedView>
  );
};

export default DatePicker;
