import { SafeAreaView, FlatList, TouchableWithoutFeedback } from "react-native";
import { currency_list } from "@/constants/currency_list";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useAppDispatch, useAppSelector } from "@/lib/store/storeHooks";
import { getCurrency, setCurrency } from "@/lib/store/features/userSlice";
import { FontAwesome6 } from "@expo/vector-icons";

const ITEM_HEIGHT = 55.4;

const currency = () => {
  const dispatch = useAppDispatch();
  const myCurrency = useAppSelector(getCurrency);

  return (
    <SafeAreaView className="px-4">
      <FlatList
        initialScrollIndex={currency_list.indexOf(
          currency_list.find((p) => p.code === myCurrency) ?? currency_list[0]
        )}
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        data={currency_list}
        renderItem={(item) => (
          <TouchableWithoutFeedback
            onPress={() => dispatch(setCurrency(item.item.code))}
          >
            <ThemedView className="py-4 flex-row items-center justify-between px-2 border-b border-b-gray-200">
              <ThemedText className="text-lg" type="subtitle">
                {item.item.symbol} - {item.item.name}
              </ThemedText>
              {myCurrency === item.item.code && <FontAwesome6 name="check" />}
            </ThemedView>
          </TouchableWithoutFeedback>
        )}
      />
    </SafeAreaView>
  );
};

export default currency;
