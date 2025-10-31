import { createSlice } from "@reduxjs/toolkit";
import { LocationObject } from "expo-location";
import { LatLng, Region } from "react-native-maps";

type Props = {
  location: LocationObject | null;
  focusedRegion: Region | null;
  clickedLocation: LatLng | null;
};

const initialState: Props = {
  location: null,
  focusedRegion: null,
  clickedLocation: null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation(state, action) {
      state.location = action.payload;
    },
    setFocusedRegion(state, action) {
      state.focusedRegion = action.payload;
    },
    setClickedLocation(state, action) {
      state.clickedLocation = action.payload;
    },
  },
});

export const { setLocation, setClickedLocation, setFocusedRegion } =
  locationSlice.actions;

export const getLocation = (state: {
  location: { location: Props["location"] };
}) => state.location.location;

export const getFocusedRegion = (state: {
  location: { focusedRegion: Props["focusedRegion"] };
}) => state.location.focusedRegion;

export const getClickedLocation = (state: {
  location: { clickedLocation: Props["clickedLocation"] };
}) => state.location.clickedLocation;

export default locationSlice.reducer;
