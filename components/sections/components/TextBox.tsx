import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { KeyboardTypeOptions } from "react-native";
import { TextInput } from "react-native-gesture-handler";

interface Props {
  submit?: (s: string) => void;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  placeHolder: string;
  type?: KeyboardTypeOptions;
}

const TextBox = ({ submit, setValue, value, placeHolder, type }: Props) => {
  return (
    <>
      <TextInput
        keyboardType={type}
        cursorColor="gray"
        placeholderTextColor="gray"
        returnKeyType="send"
        onSubmitEditing={submit ? () => submit(value) : undefined}
        multiline
        autoCorrect={false}
        value={value}
        placeholder={placeHolder}
        onChangeText={(i) => setValue(i)}
        style={{ fontFamily: "Jost_400Regular" }}
        className="rounded-[23px] text-base min-h-[40] text-gray bg-[#E3E3E3] w-[85%] p-2 px-4"
      />
      <TouchableOpacity
        disabled={value.length === 0}
        onPress={submit ? () => submit(value) : undefined}
        className="w-[20%]"
      >
        <ThemedView className="bg-black flex items-center justify-center rounded-full w-[44] h-[44]">
          <Ionicons size={21} color="white" name="arrow-up" />
        </ThemedView>
      </TouchableOpacity>
    </>
  );
};

export default TextBox;
