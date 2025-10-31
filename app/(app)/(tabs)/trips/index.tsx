import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  getItemsAfterNow,
  getItemsBeforeNow,
  sortByDate,
} from "@/constants/helpers";
import { formatDatetime } from "@/constants/time_format";
import { getTravelPlans, getTrips } from "@/lib/store/features/userSlice";
import { useAppSelector } from "@/lib/store/storeHooks";
import { router } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

const categories = ["Places", "Upcoming Travel Plans", "Past Travels"];

const index = () => {
  const myTrips = useAppSelector(getTrips);
  const myPlannedTravels = useAppSelector(getTravelPlans);
  const [selectedCategory, setSelectedCategory] = useState("Places");

  return (
    <ParallaxScrollView
      headerImage={
        <ThemedView className="py-4 items-center justify-center bg-transparent h-full border-b border-b-gray-200">
          <ThemedText className="text-4xl" type="title">
            {selectedCategory}
          </ThemedText>
        </ThemedView>
      }
    >
      <ThemedView className="flex-wrap gap-2 flex-row">
        {categories.map((item) => (
          <TouchableOpacity
            onPress={() => setSelectedCategory(item)}
            key={item}
          >
            <ThemedView
              className={`${
                selectedCategory === item
                  ? "bg-primary border-primary"
                  : "border-gray-200 bg-white"
              }  p-1  px-3 rounded-full border `}
            >
              <ThemedText
                className={
                  selectedCategory === item ? "text-white" : "text-black"
                }
              >
                {item}
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>
        ))}
      </ThemedView>
      {selectedCategory === "Places" ? (
        <>
          {myTrips.length === 0 ? (
            <ThemedView className="py-4 border-b border-b-gray-200">
              <ThemedText type="defaultSemiBold">
                You have no trips yet.
              </ThemedText>
            </ThemedView>
          ) : (
            <ThemedView className="py-4">
              {myTrips.map((item) => (
                <ThemedView
                  key={item.id}
                  className="bg-white border border-gray-300 rounded-lg p-4 mb-4"
                >
                  <TouchableWithoutFeedback
                    onPress={() => router.push("/trips/" + item.id)}
                  >
                    <ThemedView className="">
                      <ThemedText type="subtitle">
                        {item.place.displayName.text}
                      </ThemedText>
                      <ThemedText>
                        {formatDatetime(new Date(item.date))}
                      </ThemedText>
                    </ThemedView>
                  </TouchableWithoutFeedback>
                  {item.checklist.length > 0 && (
                    <ThemedView className="p-3 mt-3 pt-1 rounded bg-gray-200 flex flex-col justify-center">
                      {item.checklist.slice(0, 2).map((item) => (
                        <ThemedView
                          key={item}
                          className="px-5 mt-2 p-3 border border-gray-400 bg-white rounded"
                        >
                          <ThemedText className="text-black text-sm">
                            {item}
                          </ThemedText>
                        </ThemedView>
                      ))}
                    </ThemedView>
                  )}
                </ThemedView>
              ))}
            </ThemedView>
          )}
        </>
      ) : (
        <>
          {myPlannedTravels.length === 0 ? (
            <ThemedView className="py-4 border-b border-b-gray-200">
              <ThemedText type="defaultSemiBold">
                You have no travels planned.
              </ThemedText>
            </ThemedView>
          ) : (
            <ThemedView className="py-4">
              {sortByDate(
                selectedCategory === "Upcoming Travel Plans"
                  ? getItemsAfterNow(myPlannedTravels)
                  : getItemsBeforeNow(myPlannedTravels)
              ).map((item) => (
                <ThemedView
                  key={item.id}
                  className="bg-white border border-gray-300 rounded-lg p-4 mb-4"
                >
                  <TouchableWithoutFeedback
                    onPress={() =>
                      router.push({
                        pathname: "/shared/travelplan",
                        params: { id: item.id },
                      })
                    }
                  >
                    <ThemedView className="">
                      <ThemedText type="subtitle">
                        {item.trip_information.durationInDays} days in{" "}
                        {item.trip_information.location}
                      </ThemedText>
                      <ThemedText>
                        {formatDatetime(new Date(item.trip[0].date))}
                      </ThemedText>
                    </ThemedView>
                  </TouchableWithoutFeedback>
                </ThemedView>
              ))}
            </ThemedView>
          )}
        </>
      )}
    </ParallaxScrollView>
  );
};

export default index;
