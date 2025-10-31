import {
  Dimensions,
  FlatList,
  PixelRatio,
  TouchableOpacity,
} from "react-native";
import { useAppDispatch, useAppSelector } from "@/lib/store/storeHooks";
import { getTravelPlans } from "@/lib/store/features/userSlice";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Image } from "expo-image";
import { url } from "@/lib/server/server";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { router, useLocalSearchParams } from "expo-router";
import { addPickedPlace } from "@/lib/store/features/placeSlice";
import { addTravelPlan } from "@/lib/store/features/interactionSlice";
import { MaterialIcons } from "@expo/vector-icons";
import { transformDateTime } from "@/constants/helpers";

const { width } = Dimensions.get("screen");

const travelplan = () => {
  const dispatch = useAppDispatch();
  const travelPlans = useAppSelector(getTravelPlans);
  const { id } = useLocalSearchParams();

  const pixelRatio = PixelRatio.get();
  const actualWidth = width * pixelRatio;

  // @ts-ignore
  const plan = travelPlans[id - 1];
  return (
    <>
      <ParallaxScrollView
        headerImage={
          <ThemedView className="h-full justify-end bg-white p-5 w-full items-center border-b border-b-gray-200">
            <ThemedView className="mb-4">
              <ThemedText className="text-3xl" type="title">
                {plan.trip_information.durationInDays} day trip to{" "}
                {plan.trip_information.location}
              </ThemedText>
              <ThemedText className="text-base text-center">
                {transformDateTime(plan.trip[0].date)}
              </ThemedText>
            </ThemedView>

            <TouchableOpacity
              activeOpacity={0.8}
              className="bg-primary w-full rounded p-3 px-4"
              onPress={() => {
                dispatch(addTravelPlan(plan));
                router.navigate("/home");
              }}
            >
              <ThemedText
                type="defaultSemiBold"
                className="text-white text-center"
              >
                View On Map
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        }
      >
        <ThemedView>
          {plan.trip.map((item, index) => (
            <ThemedView
              className="mb-4 py-4 border-b border-b-gray-300"
              key={index}
            >
              <ThemedView className="flex-row mb-2 items-center">
                <ThemedView className="p-1 px-4 mr-3 items-center justify-center rounded bg-black">
                  <ThemedText type="title" className="text-lg text-white">
                    Day {item.day} - {transformDateTime(item.date)}
                  </ThemedText>
                </ThemedView>
              </ThemedView>

              <ThemedText type="defaultSemiBold" className="text-lg my-2">
                {item.locationStart} - {item.locationEnd}
              </ThemedText>
              <ThemedText className="text-lg mt-6">
                {item.dailyNotes}
              </ThemedText>
              <ThemedView className="bg-white p-2 mt-5 rounded border border-gray-300">
                {/* accommodation */}
                <ThemedView className="flex-row items-center mb-2">
                  <MaterialIcons size={20} name="hotel" />
                  <ThemedText type="subtitle" className="text-xl ml-2">
                    Accomodation
                  </ThemedText>
                </ThemedView>
                <ThemedText>{item.accommodationName}</ThemedText>
                <ThemedText>{item.accommodationAddress}</ThemedText>
                <ThemedText>{item.accommodationContact}</ThemedText>
              </ThemedView>

              <ThemedView className="bg-white p-2 mt-4 rounded border border-gray-300">
                {/* transportation */}
                <ThemedView className="flex-row items-center mb-2">
                  <MaterialIcons size={20} name="directions-bus" />
                  <ThemedText type="subtitle" className="text-xl ml-2">
                    Transportation
                  </ThemedText>
                </ThemedView>

                <ThemedText className="text-lg" type="defaultSemiBold">
                  {item.transportationType}
                </ThemedText>
                <ThemedText>{item.transportationDetails}</ThemedText>
              </ThemedView>
              <ThemedText type="subtitle" className="text-2xl mt-6 mb-2">
                Schedule
              </ThemedText>
              {item.activities.map((activity, index) => (
                <ThemedView className="mb-4" key={index}>
                  <ThemedView className="rounded w-full mb-4">
                    <ThemedText className="text-xl" type="subtitle">
                      {activity.startTime + " - " + activity.endTime}
                    </ThemedText>
                  </ThemedView>
                  <ThemedView className="bg-white rounded border border-gray-300">
                    <ThemedView className="p-2">
                      <ThemedText
                        className="text-lg my-2"
                        type="defaultSemiBold"
                      >
                        {activity.activityDescription}
                      </ThemedText>

                      {activity.meal && (
                        <ThemedView className="flex-row mb-1 items-center">
                          <MaterialIcons size={18} name="restaurant" />
                          <ThemedText className="ml-1">
                            {activity.meal.restaurantName}
                          </ThemedText>
                        </ThemedView>
                      )}
                      <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => {
                          dispatch(
                            addPickedPlace({
                              description: "",
                              picked_place: activity.place,
                            })
                          );
                          router.push("/shared/place");
                        }}
                      >
                        <ThemedView className="flex-row mb-1 items-center">
                          <MaterialIcons size={18} name="location-pin" />
                          <ThemedText className="ml-1">
                            {activity.location}
                          </ThemedText>
                        </ThemedView>
                      </TouchableOpacity>
                      <ThemedView className="pb-2">
                        {activity.cost && (
                          <ThemedText
                            className="text-base text-black"
                            type="defaultSemiBold"
                          >
                            Price - {activity.cost}
                          </ThemedText>
                        )}
                        {/* {activity.bookingRequired !== null && (
                          <ThemedText
                            className="text-base text-black"
                            type="defaultSemiBold"
                          >
                            {activity.bookingRequired
                              ? "Booking required"
                              : "Booking not required"}
                          </ThemedText>
                        )} */}

                        {activity.bookingInfo && (
                          <ThemedText
                            className="text-base text-black"
                            type="defaultSemiBold"
                          >
                            {activity.bookingInfo}
                          </ThemedText>
                        )}
                      </ThemedView>
                    </ThemedView>

                    <FlatList
                      snapToInterval={width - 42}
                      className="bg-gray-300 rounded-b overflow-hidden w-full"
                      horizontal
                      data={activity.place?.photos ?? []}
                      renderItem={({ item }) => (
                        <ThemedView
                          style={{ width: width - 42, height: 250 }}
                          className="bg-gray-200 rounded-b h-full w-full"
                        >
                          <Image
                            className="w-full rounded-b bg-gray-200 h-full"
                            source={`${url}/photo?width=${actualWidth}&photo_reference=${item.name}`}
                          />
                        </ThemedView>
                      )}
                    />
                  </ThemedView>
                </ThemedView>
              ))}
            </ThemedView>
          ))}
        </ThemedView>
      </ParallaxScrollView>
    </>
  );
};

export default travelplan;
