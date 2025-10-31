import {
  Alert,
  Linking,
  Platform,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

import { router,  } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { requestForegroundPermissionsAsync } from "expo-location";
import { useEffect } from "react";

const location = () => {

  useEffect(() => {
    getPermissions();
  }, []);

  const getPermissions = async () => {
    let { status } = await requestForegroundPermissionsAsync();
    if (status === "granted") router.replace("/");
    else openSettings();
  };

  const openSettings = () => {
    Alert.alert(
      "Location Permission",
      "You need to enable precise location access in settings.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Open Settings",
          onPress: () => {
            if (Platform.OS === "ios") {
              Linking.openURL("app-settings:");
            } else {
              Linking.openSettings();
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="items-center bg-white h-full justify-center">
      <ThemedView className="mb-4">
        <ThemedText type="defaultSemiBold">
          This app requires location access in order to function.
        </ThemedText>
        <ThemedText className="text-center">
          Select precise location.
        </ThemedText>
      </ThemedView>
      <TouchableOpacity onPress={getPermissions}>
        <ThemedView className="bg-primary rounded-full px-6 p-3">
          <ThemedText
            numberOfLines={1}
            adjustsFontSizeToFit
            className="text-white text-sm text-center"
          >
            Give location permissions
          </ThemedText>
        </ThemedView>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default location;
