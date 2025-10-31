import { PlaceData, RoutesResponse } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

type Props = {
  places: PlaceData[];
  activePlace: PlaceData | null;
  pickedPlace: {
    description: string;
    picked_place: PlaceData;
  } | null;
  directions: RoutesResponse | null;
};

const initialState: Props = {
  places: [],
  activePlace: null,
  pickedPlace: null,
  directions: null,
};

const locationSlice = createSlice({
  name: "places",
  initialState,
  reducers: {
    addPlace: (state, action) => {
      state.places = action.payload;
    },
    setActivePlace: (state, action) => {
      state.activePlace = action.payload;
    },
    addPickedPlace: (state, action) => {
      state.pickedPlace = action.payload;
    },
    setDirections: (state, action) => {
      state.directions = action.payload;
    },
  },
});

export const { addPlace, setActivePlace, addPickedPlace, setDirections } =
  locationSlice.actions;

export const getPlaces = (state: { places: { places: Props["places"] } }) =>
  state.places.places;

export const getActivePlace = (state: {
  places: { activePlace: Props["activePlace"] };
}) => state.places.activePlace;

export const getPickedPlace = (state: {
  places: { pickedPlace: Props["pickedPlace"] };
}) => state.places.pickedPlace;

export const getDirections = (state: {
  places: { directions: Props["directions"] };
}) => state.places.directions;

export default locationSlice.reducer;
