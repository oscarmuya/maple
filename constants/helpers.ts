import { Platform, Linking } from "react-native";
import {
  Activity,
  Data,
  DayPlan,
  PlaceData,
  TRAVEL_PLANNING_PROPS,
} from "@/types";
import { LatLng } from "react-native-maps";

export const transformText = (text: string) =>
  text
    .split("_")
    .map((word, index) =>
      index === 0
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        : word.toLowerCase()
    )
    .join(" ");

export const generateChecklist = (item: string[], place: PlaceData) => {
  return {
    date: new Date().toLocaleDateString(),
    place: place.displayName,
    placeId: place.id,
    list: item.map((t) => {
      return { item: t, checked: false };
    }),
  };
};

export function formatDate() {
  const date = new Date();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dayName = days[date.getUTCDay()];
  const monthName = months[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");
  const timezoneOffset = -date.getTimezoneOffset();
  const timezoneSign = timezoneOffset >= 0 ? "+" : "-";
  const timezoneHours = String(Math.abs(timezoneOffset) / 60).padStart(2, "0");
  const timezoneMinutes = String(Math.abs(timezoneOffset) % 60).padStart(
    2,
    "0"
  );
  const timezone = `GMT${timezoneSign}${timezoneHours}${timezoneMinutes}`;

  return `${dayName} ${monthName} ${day} ${year} ${hours}:${minutes}:${seconds} ${timezone}`;
}

export function getDate(num = 1) {
  const date = new Date();
  date.setDate(date.getDate() - num);
  const month =
    date.getMonth() + 1 < 10
      ? `0${date.getMonth() + 1}`
      : `${date.getMonth() + 1}`;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}

export const transformDate = (
  dateString: string,
  locale: string = "en-US"
): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    year: "numeric",
  };
  return date.toLocaleString(locale, options);
};

export const transformDateTime = (
  dateString: string,
  locale: string = "en-US"
): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    year: "numeric",
    day: "numeric",
    // hour: "numeric",
    // minute: "numeric",
  };
  return date.toLocaleString(locale, options);
};

export function camelCaseToTitleCase(str: string) {
  // Split camelCase string into words
  const words = str.replace(/([A-Z])/g, " $1").split(" ");

  // Capitalize the first letter of each word and make the rest of the letters lowercase
  const titleCasedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );

  // Join the words with a space
  return titleCasedWords.join(" ");
}

// const formattedDateFR = transformDate(dateString, 'fr-FR');

interface Coordinate {
  latitude: number;
  longitude: number;
}

export const decodePolyline = (t: string, e = 5) => {
  let points = [];
  for (let step = 0, lat = 0, lng = 0, len = t.length; step < len; ) {
    let result = 1,
      shift = 0,
      byte = null;
    do {
      byte = t.charCodeAt(step++) - 63 - 1;
      result += byte << shift;
      shift += 5;
    } while (byte >= 0x1f);
    lat += result & 1 ? ~(result >> 1) : result >> 1;
    result = 1;
    shift = 0;
    do {
      byte = t.charCodeAt(step++) - 63 - 1;
      result += byte << shift;
      shift += 5;
    } while (byte >= 0x1f);
    lng += result & 1 ? ~(result >> 1) : result >> 1;
    points.push({ latitude: lat * 1e-5, longitude: lng * 1e-5 });
  }
  return points;
};

export function convertDuration(durationStr: string): string {
  const totalSeconds = parseInt(durationStr.replace("s", ""), 10);

  const hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (seconds >= 30) minutes++;

  if (hours === 0 && minutes === 0) return "1 minute";
  else if (hours === 0) return `${minutes} mins`;
  return `${hours} hrs ${minutes} mins`;
}

export const openGoogleMapsWithDirections = (
  origin: Coordinate,
  destination: Coordinate
) => {
  const originString = `${origin.latitude},${origin.longitude}`;
  const destinationString = `${destination.latitude},${destination.longitude}`;
  let url = "";
  if (Platform.OS === "ios") {
    url = `http://maps.apple.com/?saddr=${originString}&daddr=${destinationString}`;
  } else if (Platform.OS === "android") {
    url = `https://www.google.com/maps/dir/?api=1&origin=${originString}&destination=${destinationString}&travelmode=driving`;
  }
  Linking.openURL(url).catch((err) => console.error("Error opening maps", err));
};

export const openGoogleMapsWithCustomDirections = (
  origin_place_id: Data,
  destination_place_id: Data,
  waypoint_place_ids: Data[],
  travelmode: string,
  avoid: string[]
) => {
  const originString = `origin=${encodeURIComponent(
    origin_place_id.formattedAddress
  )}&origin_place_id=${origin_place_id.id}`;
  const destinationString = `destination=${encodeURIComponent(
    destination_place_id.formattedAddress
  )}&destination_place_id=${destination_place_id.id}`;
  const avoidString = `avoid=${avoid.join(",")}`;
  const waypointString = `waypoint_place_ids=${waypoint_place_ids
    .map((item) => item.id)
    .join("|")}&waypoints=${waypoint_place_ids
    .map((item) => encodeURIComponent(item.formattedAddress))
    .join("|")}`;
  let url = "";
  if (Platform.OS === "ios") {
    url = `http://maps.apple.com/?saddr=${originString}&daddr=${destinationString}`;
  } else if (Platform.OS === "android") {
    url = `https://www.google.com/maps/dir/?api=1&${originString}&${destinationString}&${avoidString}&${waypointString}&travelmode=${travelmode}`;
  }
  console.log(url);

  Linking.openURL(url).catch((err) => console.error("Error opening maps", err));
};

export function mergeArrayElements(arr: TRAVEL_PLANNING_PROPS["data"]["trip"]) {
  // Create a map to group elements by their data
  const groupedMap = new Map();

  // Group elements by their data
  let index = 1;
  arr.forEach((item) => {
    const key = item.place?.id;
    if (groupedMap.has(key)) {
      groupedMap.get(key).id += `/${index}`;
    } else {
      groupedMap.set(key, { ...item, id: `${index}` });
    }
    index++;
  });
  // Convert the map back to an array and format the output
  return Array.from(groupedMap.values());
}

export function mergePointsArrayElements(arr: P[]) {
  // Create a map to group elements by their data
  const groupedMap = new Map();

  // Group elements by their data
  let index = 1;
  arr.forEach((item) => {
    const key = item.coords;
    if (groupedMap.has(key)) {
      groupedMap.get(key).id += `/${index}`;
    } else {
      groupedMap.set(key, { ...item, id: `${index}` });
    }
    index++;
  });
  // Convert the map back to an array and format the output
  return Array.from(groupedMap.values()) as typeof arr;
}

export function extractActivities(trip: DayPlan[]): Activity[] {
  return trip.flatMap((dayPlan) =>
    dayPlan.activities.map((activity) => ({
      ...activity,
      day: dayPlan.day,
      date: dayPlan.date,
    }))
  );
}

interface P {
  coords: LatLng;
  name: string;
  id?: string;
}

const t = { latitude: 0, longitude: 0 };
export function extractActivitiesPoints(trip: DayPlan[]): P[] {
  return trip.flatMap((dayPlan) =>
    dayPlan.activities.map((activity) => ({
      coords: activity.place?.location ?? t,
      name: activity.location,
    }))
  );
}

/**
 * Sorts an array of items by their date field.
 * @param items - The array of items to sort.
 * @param ascending - Sort in ascending order if true, descending if false.
 * @returns A new sorted array of items.
 */
export function sortByDate(
  items: TRAVEL_PLANNING_PROPS["data"][],
  ascending: boolean = false
): TRAVEL_PLANNING_PROPS["data"][] {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.trip[0].date);
    const dateB = new Date(b.trip[0].date);
    return ascending
      ? dateA.getTime() - dateB.getTime()
      : dateB.getTime() - dateA.getTime();
  });
}

/**
 * Filters items with dates before the current date and time.
 * @param items - The array of items to filter.
 * @returns A new array of items with dates before now.
 */
export function getItemsBeforeNow(
  items: TRAVEL_PLANNING_PROPS["data"][]
): TRAVEL_PLANNING_PROPS["data"][] {
  const now = new Date();
  return items.filter((item) => new Date(item.trip[0].date) < now);
}

/**
 * Filters items with dates after the current date and time.
 * @param items - The array of items to filter.
 * @returns A new array of items with dates after now.
 */
export function getItemsAfterNow(
  items: TRAVEL_PLANNING_PROPS["data"][]
): TRAVEL_PLANNING_PROPS["data"][] {
  const now = new Date();
  return items.filter((item) => new Date(item.trip[0].date) > now);
}
