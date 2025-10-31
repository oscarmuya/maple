import { useEffect, useState } from "react";
import { Activity, TRAVEL_PLANNING_PROPS } from "@/types";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { extractActivities } from "@/constants/helpers";
import { useAppDispatch } from "@/lib/store/storeHooks";
import { TouchableOpacity } from "react-native";
import {
  addTravelPlan,
  setFocusOnMap,
} from "@/lib/store/features/interactionSlice";
import useDebounce from "@/hooks/useDebounce";
import { addTravel } from "@/lib/store/features/userSlice";
import Slider from "./Slider";

interface Props {
  plan: TRAVEL_PLANNING_PROPS["data"];
  setPlan: React.Dispatch<
    React.SetStateAction<TRAVEL_PLANNING_PROPS["data"] | undefined>
  >;
}

const TravelPlan = ({ plan, setPlan }: Props) => {
  const dispatch = useAppDispatch();
  const [snappedItem, setSnappedItem] = useState(0);
  const debouncedSnapped = useDebounce(snappedItem, 250);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    setActivities(extractActivities(plan.trip));
  }, [plan]);

  useEffect(() => {
    dispatch(addTravelPlan(plan));
    const place = activities[debouncedSnapped];
    if (place?.place)
      dispatch(
        setFocusOnMap({
          id: place.place.id,
          coords: place.place.location,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        })
      );
  }, [debouncedSnapped, plan, activities]);

  return (
    <ThemedView className="bg-transparent absolute bottom-0">
      <ThemedView className="items-center justify-center">
        <ThemedView className="px-4">
          <ThemedView className="items-center p-1 px-4 justify-center rounded-full bg-black/80">
            <ThemedText type="subtitle" className="text-base text-white">
              Day {activities[snappedItem]?.day ?? 1} -{" "}
              {activities[snappedItem]?.date ?? ""}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <Slider setSnappedItem={setSnappedItem} data={activities} />
      </ThemedView>
      <ThemedView className="items-center p-2 bg-white">
        <ThemedView className="flex-row w-full justify-between">
          <TouchableOpacity
            activeOpacity={0.8}
            className={`${
              plan.id ? "w-full" : "w-[49%]"
            } bg-black/70 rounded p-2 px-4`}
            onPress={() => {
              setPlan(undefined);
              dispatch(addTravelPlan(null));
            }}
          >
            <ThemedText
              type="defaultSemiBold"
              className="text-white text-center"
            >
              Cancel
            </ThemedText>
          </TouchableOpacity>
          {!plan.id && (
            <TouchableOpacity
              activeOpacity={0.8}
              className="bg-primary w-[49%] rounded p-2 px-4"
              onPress={() => {
                dispatch(addTravel(plan));
                dispatch(addTravelPlan(null));
                setPlan(undefined);
              }}
            >
              <ThemedText
                type="defaultSemiBold"
                className="text-white text-center"
              >
                Save Trip
              </ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

export default TravelPlan;
