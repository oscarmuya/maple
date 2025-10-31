import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RootSiblingParent } from "react-native-root-siblings";
import { setBackgroundColorAsync } from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import { router, Stack } from "expo-router";
import { auth } from "@/firebase/firebase";
import { setLocation } from "@/lib/store/features/locationSlice";
import {
  useForegroundPermissions,
  watchPositionAsync,
  Accuracy,
} from "expo-location";
import { useState, useEffect } from "react";
import { useAppDispatch } from "@/lib/store/storeHooks";
import { hideAsync } from "expo-splash-screen";

export default function RootLayout() {
  setBackgroundColorAsync("white");
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>();
  const [locationTracked, setLocationTracked] = useState<boolean>();
  const [status, requestPermission] = useForegroundPermissions();

  useEffect(() => {
    (async () => {
      if (status && !status.granted) {
        const { granted, android } = await requestPermission();
        if (!granted || android?.accuracy !== "fine") {
          console.log("Permission to access location denied or not precise");
          setLocationTracked(false);
          setLoading(false);
        }
      } else if (
        status &&
        status.granted &&
        status.android?.accuracy !== "fine"
      ) {
        const { granted, android } = await requestPermission();
        if (!granted || android?.accuracy !== "fine") {
          console.log("Permission to access location denied or not precise");
          setLocationTracked(false);
          setLoading(false);
        }
      }
    })();
  }, [status, status?.android]);

  useEffect(() => {
    (async () => {
      if (
        status &&
        status.granted &&
        status.android &&
        status.android.accuracy === "fine"
      ) {
        setLocationTracked(true);
        const sub = await watchPositionAsync(
          {
            accuracy: Accuracy.High,
            timeInterval: 10000,
            distanceInterval: 1,
          },
          (newLocation) => {
            dispatch(setLocation(newLocation));
            // dispatch(
            //   setLocation({
            //     ...location,
            //     coords: {
            //       latitude: 25.7643553,
            //       longitude: -80.1930205,
            //     },
            //   })
            // );
          }
        );

        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) setIsLoggedIn(true);
          else setIsLoggedIn(false);
          setLoading(false);
        });

        return () => {
          unsubscribe();
          sub.remove();
        };
      }
    })();
  }, [status, status?.android]);

  useEffect(() => {
    if (!loading) {
      (async () => {
        await hideAsync();
        if (locationTracked === false) router.replace("/permissions/location");
        else if (isLoggedIn === true) router.replace("/(tabs)/home");
        else if (isLoggedIn === false) router.replace("/(auth)");
      })();
    }
  }, [loading, isLoggedIn, locationTracked]);

  return (
    <GestureHandlerRootView>
      <RootSiblingParent>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
            redirect={!loading && isLoggedIn === true}
            name="(auth)"
          />
          <Stack.Screen
            redirect={!loading && isLoggedIn === false}
            name="(tabs)"
          />
          <Stack.Screen name="(aaaloader)/index" />
          <Stack.Screen name="shared/travelplan" />
          <Stack.Screen name="shared/place" />
          <Stack.Screen name="permissions/location" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </RootSiblingParent>
    </GestureHandlerRootView>
  );
}
