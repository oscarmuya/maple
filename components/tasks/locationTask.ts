import { defineTask } from "expo-task-manager";
import {
  Accuracy,
  LocationObject,
  requestForegroundPermissionsAsync,
  startLocationUpdatesAsync,
  stopLocationUpdatesAsync,
} from "expo-location";
import { store } from "@/lib/store/store";
import { setLocation } from "@/lib/store/features/locationSlice";

const LOCATION_TASK_NAME = "background-location-task";

// Define the task
defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    const { locations } = data as { locations: LocationObject[] };
    const location = locations[0];
    if (location) {
      console.log("New location:", location.coords);
      store.dispatch(setLocation(location));
    }
  }
});

const requestPermissions = async () => {
  const { status: foregroundStatus } =
    await requestForegroundPermissionsAsync();
  if (foregroundStatus === "granted") {
    return true;
  }
  return false;
};

// Function to start the location tracking
export async function startLocationTracking() {
  const granted = await requestPermissions();
  //   let { status } = await requestForegroundPermissionsAsync();

  if (granted) {
    await startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Accuracy.Balanced,
      timeInterval: 10000, // 10 seconds
    });
    console.log("Location tracking started");
  } else {
    console.log("Background location permission not granted");
  }
}

// Function to stop the location tracking
export async function stopLocationTracking() {
  await stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  console.log("Location tracking stopped");
}
