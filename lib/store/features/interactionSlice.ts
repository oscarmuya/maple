import { checklistProps, TRAVEL_PLANNING_PROPS } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import { LatLng } from "react-native-maps";

type Props = {
  greeted: boolean;
  focusOnMap: {
    id: string;
    coords: LatLng;
    latitudeDelta?: number;
    longitudeDelta?: number;
  } | null;
  myChecklist: checklistProps[];
  travelPlan: TRAVEL_PLANNING_PROPS["data"] | null;
};

const initialState: Props = {
  greeted: false,
  focusOnMap: null,
  myChecklist: [],
  travelPlan: null,
};

const interactionSlice = createSlice({
  name: "interaction",
  initialState,
  reducers: {
    greet: (state, action) => {
      state.greeted = action.payload;
    },
    setFocusOnMap: (state, action) => {
      state.focusOnMap = action.payload;
    },
    addTravelPlan: (state, action) => {
      state.travelPlan = action.payload;
    },
    addCheckList: (state, action) => {
      state.myChecklist.push(action.payload);
    },
    deleteChecklist: (state, action) => {
      state.myChecklist = state.myChecklist.filter(
        (p) => p.placeId !== action.payload
      );
    },
  },
});

export const {
  greet,
  setFocusOnMap,
  addCheckList,
  deleteChecklist,
  addTravelPlan,
} = interactionSlice.actions;

export const hasGreeted = (state: { interaction: { greeted: boolean } }) =>
  state.interaction.greeted;

export const getMyCheckLists = (state: {
  interaction: { myChecklist: Props["myChecklist"] };
}) => state.interaction.myChecklist;

export const getTravelPlan = (state: {
  interaction: { travelPlan: Props["travelPlan"] };
}) => state.interaction.travelPlan;

export const getFocusOnMap = (state: {
  interaction: {
    focusOnMap: Props["focusOnMap"];
  };
}) => state.interaction.focusOnMap;

export default interactionSlice.reducer;
