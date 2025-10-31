import { createSlice } from "@reduxjs/toolkit";
import {
  TRAVEL_PLANNING_PROPS,
  WeatherData,
  priceLevelType,
  tripProps,
  userProps,
} from "../../../types";
import { formatDate } from "@/constants/helpers";

type Props = {
  userData?: userProps;
  weather?: WeatherData;
  currency?: string;
  trips: tripProps[];
  languagesIspeak: { code: string; name: string }[];
  preferredPriceLevel: priceLevelType;
  plannedTravels: TRAVEL_PLANNING_PROPS["data"][];
};

const initialState: Props = {
  userData: undefined,
  weather: undefined,
  currency: "USD",
  trips: [],
  languagesIspeak: [],
  preferredPriceLevel: "Any",
  plannedTravels: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUserData: (state, action) => {
      state.userData = action.payload;
    },
    setWeather: (state, action) => {
      state.weather = action.payload;
    },
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },
    addTrip: (state, action) => {
      state.trips.push({ id: state.trips.length + 1, ...action.payload });
    },
    deleteTrip: (state, action) => {
      state.trips = state.trips.filter((p) => p.id !== action.payload);
    },
    addTravel: (state, action) => {
      state.plannedTravels.push({
        id: state.plannedTravels.length + 1,
        date: formatDate(),
        startDate: action.payload.trip[0].startDate,
        ...action.payload,
      });
    },
    deleteTravel: (state, action) => {
      state.plannedTravels = state.plannedTravels.filter(
        (p) => p.id !== action.payload
      );
    },
    addLanguage: (state, action) => {
      if (!state.languagesIspeak.find((p) => p === action.payload))
        state.languagesIspeak.push(action.payload);
    },
    deleteLanguage: (state, action) => {
      state.languagesIspeak = state.languagesIspeak.filter(
        (p) => p.name !== action.payload.name
      );
    },
    setPriceLevel: (state, action) => {
      state.preferredPriceLevel = action.payload;
    },
  },
});

export const {
  addUserData,
  setWeather,
  setCurrency,
  addTrip,
  deleteTrip,
  addLanguage,
  deleteLanguage,
  setPriceLevel,
  addTravel,
  deleteTravel,
} = userSlice.actions;

export const getUserPreference = (state: { user: Props }) => {
  return {
    languagesIspeak: state.user.languagesIspeak,
    preferredPriceLevel: state.user.preferredPriceLevel,
  };
};

export const getUserData = (state: { user: { userData: Props["userData"] } }) =>
  state.user.userData;

export const getWeather = (state: { user: { weather: Props["weather"] } }) =>
  state.user.weather;

export const getCurrency = (state: { user: { currency: Props["currency"] } }) =>
  state.user.currency;

export const getTrips = (state: { user: { trips: Props["trips"] } }) =>
  state.user.trips;

export const getLanguages = (state: {
  user: { languagesIspeak: Props["languagesIspeak"] };
}) => state.user.languagesIspeak;

export const getPriceLevel = (state: {
  user: { preferredPriceLevel: Props["preferredPriceLevel"] };
}) => state.user.preferredPriceLevel;

export const getTravelPlans = (state: {
  user: { plannedTravels: Props["plannedTravels"] };
}) => state.user.plannedTravels;

export default userSlice.reducer;
