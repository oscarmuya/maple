import { router, useLocalSearchParams } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { getTrips } from "@/lib/store/features/userSlice";
import { useAppSelector } from "@/lib/store/storeHooks";
import { Dimensions, PixelRatio, TouchableWithoutFeedback } from "react-native";
import { useDispatch } from "react-redux";
import { addPickedPlace } from "@/lib/store/features/placeSlice";
import Carousel from "react-native-reanimated-carousel";
import { Image } from "expo-image";
import { url } from "@/lib/server/server";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { formatDatetime } from "@/constants/time_format";

const { width } = Dimensions.get("window");
const pixelRatio = PixelRatio.get();
const actualWidth = width * pixelRatio;

const Trip = () => {
  const dispatch = useDispatch();
  const { id } = useLocalSearchParams();
  const myTrip = useAppSelector(getTrips).find(
    (trip) => trip.id === Number(id)
  );

  if (!myTrip) return null;

  return (
    <ParallaxScrollView
      headerImage={
        <ThemedView className="">
          <Carousel
            windowSize={3}
            width={width}
            height={width * 0.7}
            data={myTrip.place.photos}
            scrollAnimationDuration={200}
            renderItem={({ item }) => (
              <ThemedView className="bg-gray-200">
                <Image
                  className="w-full bg-gray-200 h-full"
                  source={`${url}/photo?width=${actualWidth}&photo_reference=${item.name}`}
                />
              </ThemedView>
            )}
          />
        </ThemedView>
      }
    >
      <ThemedView className="py-6 border-b border-b-gray-200">
        <ThemedText className="text-2xl" type="title">
          Trip to {myTrip.place.displayName.text}
        </ThemedText>
        <ThemedText>{formatDatetime(new Date(myTrip.date))}</ThemedText>
      </ThemedView>

      {/* overview */}
      <ThemedView className="gap-2">
        {myTrip.place.userRatingCount && (
          <ThemedText className="text-base" type="defaultSemiBold">
            Rated {myTrip.place.rating}/5 by{" "}
            {myTrip.place.userRatingCount.toLocaleString()} people
          </ThemedText>
        )}

        <ThemedText className="text-base" type="defaultSemiBold">
          {myTrip.place.formattedAddress}
        </ThemedText>
      </ThemedView>

      {/* details class 1 */}
      {myTrip.place.editorialSummary && (
        <ThemedView className="border-t border-t-gray-100 py-4">
          <ThemedText className="mb-2" type="subtitle">
            Description
          </ThemedText>
          <ThemedText className="text-base text-black" type="defaultSemiBold">
            {myTrip.place.editorialSummary.text}
          </ThemedText>
        </ThemedView>
      )}

      <ThemedView className="mt-6 border-b border-b-gray-200 pb-6">
        <TouchableWithoutFeedback
          onPress={() => {
            dispatch(
              addPickedPlace({
                description: "",
                picked_place: myTrip.place,
              })
            );
            router.push("/shared/place");
          }}
        >
          <ThemedView className="bg-primary rounded-full p-3 px-6">
            <ThemedText className="text-center text-white">
              View full details
            </ThemedText>
          </ThemedView>
        </TouchableWithoutFeedback>
      </ThemedView>

      {/* checklist */}
      {myTrip.checklist.length > 0 && (
        <ThemedView className="p-3 mt-3 pt-1 rounded bg-gray-200 flex flex-col justify-center">
          {myTrip.checklist.map((item) => (
            <ThemedView
              key={item}
              className="px-5 mt-2 p-3 border border-gray-400 bg-white rounded"
            >
              <ThemedText className="text-black text-sm">{item}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      )}
    </ParallaxScrollView>
  );
};

export default Trip;
