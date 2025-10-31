import {
  requestCalendarPermissionsAsync,
  getCalendarsAsync,
  EntityTypes,
  createCalendarAsync,
  CalendarAccessLevel,
  getDefaultCalendarAsync,
  createEventAsync,
} from "expo-calendar";
import { Platform } from "react-native";

export const getCalendarPermission = (title = "Places to go") => {
  return new Promise<string>(async (resolve) => {
    try {
      const { status } = await requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendars = await getCalendarsAsync(EntityTypes.EVENT);
        calendars.map((item) => {
          if (item.title === title) resolve(item.id);
        });
        const id = await createCalendar(title);
        resolve(id);
      }
      resolve("failed");
    } catch (error) {
      console.log(error);
      resolve("failed");
    }
  });
};

export const handleAddEvent = async (
  title: string,
  notes: string,
  location: string,
  startDate: Date
) => {
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
  try {
    const id = await getCalendarPermission();
    if (id === "failed") return "failed";
    const data = {
      startDate,
      endDate,
      notes,
      title,
      allDay: true,
      location,
    };
    const res = await createEventAsync(id, data);

    return res;
  } catch (error) {
    console.log(error);
    return "failed";
  }
};

async function getDefaultCalendarSource() {
  const defaultCalendar = await getDefaultCalendarAsync();
  return defaultCalendar.source;
}

async function createCalendar(title: string) {
  const defaultCalendarSource =
    Platform.OS === "ios"
      ? await getDefaultCalendarSource()
      : { isLocalAccount: true, name: "Travelow", type: "App" };
  const newCalendarID = await createCalendarAsync({
    title,
    color: "blue",
    entityType: EntityTypes.EVENT,
    sourceId: defaultCalendarSource.id,
    source: defaultCalendarSource,
    name: "travelowCalendar",
    ownerAccount: "personal",
    accessLevel: CalendarAccessLevel.OWNER,
    isSynced: true,
  });
  return newCalendarID;
}
