import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { convertDuration } from "@/constants/helpers";
import { get_weather } from "@/lib/server/server";
import { getLocation } from "@/lib/store/features/locationSlice";
import { getDirections } from "@/lib/store/features/placeSlice";
import { setWeather } from "@/lib/store/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/storeHooks";
import Icon from "@expo/vector-icons/FontAwesome6";
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

type Props = {
  onPress: () => void;
  bottom: SharedValue<number>;
};

const { height } = Dimensions.get("screen");

const MyLocation = ({ onPress, bottom }: Props) => {
  const coords = useAppSelector(getLocation);
  const encodedPolyLine = useAppSelector(getDirections);
  const dispatch = useAppDispatch();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (coords && !done) {
      get_weather(coords.coords.latitude, coords.coords.longitude).then(
        (res) => {
          if ("error" in res) {
            const t = setTimeout(() => {
              get_weather(coords.coords.latitude, coords.coords.longitude).then(
                (res) => {
                  if ("error" in res) console.log("failed to update weather!!");
                  else dispatch(setWeather(res));
                  setDone(true);
                }
              );
            }, 10000);
          } else dispatch(setWeather(res));
          setDone(true);
        }
      );
    }
  }, [done]);

  const animatedBottom = useAnimatedStyle(() => {
    return { bottom: height - bottom.value - 55 };
  });
  return (
    <Animated.View
      className="flex absolute items-center right-3 flex-row"
      style={animatedBottom}
    >
      {encodedPolyLine && (
        <>
          <ThemedView
            style={styles.pin}
            className="flex-row bg-white items-center p-1 px-3 rounded-3xl"
          >
            <ThemedText type="defaultSemiBold" className="text-sm">
              {encodedPolyLine.routes[0].distanceMeters >= 1000
                ? (encodedPolyLine.routes[0].distanceMeters / 1000).toFixed(1) +
                  " Km away"
                : encodedPolyLine.routes[0].distanceMeters + " M away"}
            </ThemedText>
          </ThemedView>
          <ThemedView
            style={styles.pin}
            className="flex-row ml-2 bg-white items-center p-1 px-3 rounded-3xl"
          >
            <ThemedText type="defaultSemiBold" className="text-sm">
              {convertDuration(encodedPolyLine.routes[0].duration)}
            </ThemedText>
          </ThemedView>
        </>
      )}
      <ThemedView
        style={styles.pin}
        className="shadow-lg h-12 w-12 rounded-full ml-3 bg-white p-3"
      >
        <TouchableOpacity onPress={onPress}>
          <Icon name="location-crosshairs" size={24} color="rgba(0,0,0,0.7)" />
        </TouchableOpacity>
      </ThemedView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  pin: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default MyLocation;
