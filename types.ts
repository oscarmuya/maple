export type userProps = {
  email: string;
  name: string;
  location: any;
};

export interface checklistProps {
  placeId: string;
  date: string;
  list: { item: string; checked: boolean }[];
  place: { languageCode: string; text: string };
}

type List<T> = T[];
type Dict<K extends string, V> = Record<K, V>;

interface AddressComponent {
  longText: string;
  shortText: string;
  types: List<string>;
  languageCode: string;
}

interface LatLng {
  latitude: number;
  longitude: number;
}

interface Viewport {
  low: LatLng;
  high: LatLng;
}

interface OpeningHoursPeriod {
  open: Dict<string, number>;
  close: Dict<string, number>;
}

interface RegularOpeningHours {
  openNow: boolean;
  periods: List<OpeningHoursPeriod>;
  weekdayDescriptions: List<string>;
}

interface CurrentOpeningHours extends RegularOpeningHours {}

interface Review {
  name: string;
  relativePublishTimeDescription: string;
  rating: number;
  text: Dict<string, string>;
  originalText: Dict<string, string>;
  authorAttribution: Dict<string, string>;
  publishTime: string;
}

export interface Photo {
  name: string;
  widthPx: number;
  heightPx: number;
  authorAttributions: List<Dict<string, string>>;
}

interface AccessibilityOptions {
  wheelchairAccessibleParking: boolean;
  wheelchairAccessibleEntrance: boolean;
}

export interface PlaceData {
  id: string;
  types: List<string>;
  nationalPhoneNumber: string;
  internationalPhoneNumber: string;
  formattedAddress: string;
  addressComponents: List<AddressComponent>;
  location: LatLng;
  viewport: Viewport;
  rating: number;
  websiteUri: string;
  regularOpeningHours: RegularOpeningHours;
  utcOffsetMinutes: number;
  businessStatus: string;
  userRatingCount: number;
  displayName: { text: string };
  primaryTypeDisplayName: { text: string };
  currentOpeningHours: CurrentOpeningHours;
  primaryType: string;
  shortFormattedAddress: string;
  editorialSummary: { text: string };
  reviews: Review[];
  photos: Photo[];
  goodForChildren: boolean;
  allowsDogs: boolean;
  accessibilityOptions: AccessibilityOptions;
  parkingOptions: { [key: string]: any };
  paymentOptions: { [key: string]: any };
}

// weather types
interface Location {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

interface Condition {
  text: string;
  icon: string;
  code: number;
}

interface Current {
  last_updated_epoch: number;
  last_updated: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: Condition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  windchill_c: number;
  windchill_f: number;
  heatindex_c: number;
  heatindex_f: number;
  dewpoint_c: number;
  dewpoint_f: number;
  vis_km: number;
  vis_miles: number;
  uv: number;
  gust_mph: number;
  gust_kph: number;
}

export interface WeatherData {
  location: Location;
  current: Current;
}

// coords data types

export interface coordsDataTypes {
  long_name: string;
  short_name: string;
  types: string[];
}

// routes

interface Polyline {
  encodedPolyline: string;
}

// Type for the route object
interface Route {
  distanceMeters: number;
  duration: string;
  polyline: Polyline;
}

// Type for the main object containing the routes array
export interface RoutesResponse {
  routes: Route[];
}

// marker types
export type Marker = {
  latitude: number;
  longitude: number;
  title: string;
};

export type Cluster = {
  markers: PlaceData[];
  latitude: number;
  longitude: number;
};

export interface tripProps {
  date: any;
  place: PlaceData;
  checklist: string[];
  review?: { q: string; a: string };
  calendarEvent?: { calendarId: string; eventId: string };
  dontAsk: boolean;
  completed: boolean;
  activity: string;
  id: number;
}

// price level
export type priceLevelType =
  | "Any"
  | "Free"
  | "Inexpensive"
  | "Moderate"
  | "Expensive"
  | "Very Expensive";

interface FIND_NEARBY_PLACES_PROPS {
  data: {
    places: PlaceData[];
    picked: { description: string; picked_place: PlaceData };
  };
  category: "FIND_NEARBY_PLACES";
}

export interface CURRENCY_CONVERSION_PROPS {
  data: {
    targetCurrency: string;
    initialCurrency: string;
    amount: number;
  };
  category: "CURRENCY_CONVERSION";
}

interface LOCAL_INFORMATION_PROPS {
  data: string;
  category: "LOCAL_INFORMATION";
}

// trip plan
interface Meal {
  mealType: string;
  restaurantName: string;
  cuisineType: string;
  address: string;
  cost: string;
  place?: PlaceData;
}

export interface Activity {
  startTime: string;
  endTime: string;
  activityDescription: string;
  location: string;
  cost: string;
  bookingRequired: boolean;
  bookingInfo: string | null;
  meal: Meal | null;
  place?: PlaceData;
  day: number;
  date: string;
}

export interface DayPlan {
  day: number;
  date: string;
  locationStart: string;
  locationEnd: string;
  accommodationName: string;
  accommodationAddress: string;
  accommodationContact: string;
  transportationType: string;
  transportationDetails: string;
  activities: Activity[];
  dailyNotes: string;
  place?: PlaceData;
}

// navigation routes
export type Data = {
  id: string;
  formattedAddress: string;
};

type Waypoint = {
  name: string;
  data: Data;
};

export type NAVIGATION_PROPS = {
  data: {
    destination: {
      name: string;
      data: Data;
    };
    origin: {
      name: string;
      data: Data;
    };
    travelmode: string;
    waypoints: Waypoint[];
    avoid: string[];
    route: RoutesResponse;
  };
  category: "NAVIGATION";
};

export interface TRAVEL_PLANNING_PROPS {
  data: {
    trip: DayPlan[];
    trip_information: {
      location: string;
      durationInDays: number;
      preferences: string[];
      instructions: string[];
    };
    id?: number;
    date?: any;
  };
  category: "TRAVEL_PLANNING";
}

interface SAFETY_PROPS {
  data: string;
  category: "SAFETY";
}

interface GENERAL_PROPS {
  data: string;
  category: "GENERAL";
}

interface OTHER_PROPS {
  data: string;
  category: "OTHER";
}

export type ACTION_PROPS =
  | FIND_NEARBY_PLACES_PROPS
  | CURRENCY_CONVERSION_PROPS
  | LOCAL_INFORMATION_PROPS
  | TRAVEL_PLANNING_PROPS
  | SAFETY_PROPS
  | GENERAL_PROPS
  | OTHER_PROPS
  | NAVIGATION_PROPS;
