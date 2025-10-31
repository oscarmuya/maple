import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { url } from "@/lib/server/server";
import { addPickedPlace } from "@/lib/store/features/placeSlice";
import { useAppDispatch } from "@/lib/store/storeHooks";
import { Activity } from "@/types";
import { FlashList } from "@shopify/flash-list";
import { ImageBackground } from "expo-image";
import { router } from "expo-router";
import { useRef } from "react";
import {
  StyleSheet,
  Dimensions,
  ViewToken,
  PixelRatio,
  Pressable,
} from "react-native";

const { width } = Dimensions.get("screen");
const pixelRatio = PixelRatio.get();
const actualWidth = width * pixelRatio;

const { width: screenWidth } = Dimensions.get("window");

const SliderItem: React.FC<{ item: Activity; dispatch: any }> = ({
  item,
  dispatch,
}) => (
  <Pressable
    onPress={() => {
      dispatch(
        addPickedPlace({
          description: "",
          picked_place: item.place,
        })
      );
      router.push("/shared/place");
    }}
  >
    <ThemedView style={styles.slide}>
      <ImageBackground
        style={[
          {
            overflow: "hidden",
            height: 250,
          },
          styles.content,
        ]}
        imageStyle={{ borderRadius: 10 }}
        className="w-full border border-gray-200 justify-between bg-gray-200"
        source={`${url}/photo?width=${actualWidth}&photo_reference=${
          item.place?.photos?.at(0)?.name
        }`}
      >
        {item.meal ? (
          <ThemedView className="p-1 items-start">
            <ThemedView
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
              className="items-center p-1 px-3 justify-center rounded-full bg-white"
            >
              <ThemedText type="defaultSemiBold" className="text-sm text-black">
                {item.meal.mealType} at {item.meal.restaurantName}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        ) : (
          <ThemedView />
        )}
        <ThemedView className="bg-white">
          <ThemedView className="p-2">
            <ThemedText type="defaultSemiBold" className="text-base mb-3">
              {item.startTime} - {item.endTime}
            </ThemedText>
            <ThemedText className="text-lg mb-1" type="defaultSemiBold">
              {item.meal
                ? item.meal.restaurantName + " - " + item.meal.cuisineType
                : item.location}
            </ThemedText>

            {item.meal ? (
              <ThemedText className="text-base">{item.meal.address}</ThemedText>
            ) : (
              <ThemedText className="text-base">
                {item.activityDescription}
              </ThemedText>
            )}
            <ThemedText type="defaultSemiBold" className="text-sm mt-2">
              Price - {item.meal ? item.meal.cost : item.cost}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ImageBackground>
    </ThemedView>
  </Pressable>
);

const Slider: React.FC<{
  data: Activity[];
  setSnappedItem: React.Dispatch<React.SetStateAction<number>>;
}> = ({ data, setSnappedItem }) => {
  const flatListRef = useRef<FlashList<any>>(null);
  const dispatch = useAppDispatch();

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setSnappedItem(viewableItems[0].index || 0);
      }
    }
  );

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 });

  return (
    <ThemedView style={styles.container}>
      <FlashList
        estimatedItemSize={width * 0.9}
        ref={flatListRef}
        data={data}
        renderItem={({ item }) => (
          <SliderItem dispatch={dispatch} item={item} />
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    height: 270,
  },
  slide: {
    width: screenWidth,
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "90%",
  },
});

export default Slider;
