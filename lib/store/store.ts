import { Reducer, configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import userSlice from "./features/userSlice";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import locationSlice from "./features/locationSlice";
import persistStore from "redux-persist/es/persistStore";
import placeSlice from "./features/placeSlice";
import interactionSlice from "./features/interactionSlice";

const persistConfigUser = {
  key: "cmp-347-user",
  storage: ReactNativeAsyncStorage,
};

const persistConfigLocation = {
  key: "cmp-347-location",
  storage: ReactNativeAsyncStorage,
};

const persistConfigPlaces = {
  key: "cmp-347-places",
  storage: ReactNativeAsyncStorage,
};

const persistConfigInteractions = {
  key: "cmp-347-interactions",
  storage: ReactNativeAsyncStorage,
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof store.getState>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = AppStore["dispatch"];
export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
  reducer: {
    user: persistReducer(persistConfigUser, userSlice) as Reducer,
    location: persistReducer(persistConfigLocation, locationSlice) as Reducer,
    places: persistReducer(persistConfigPlaces, placeSlice) as Reducer,
    interaction: persistReducer(
      persistConfigInteractions,
      interactionSlice
    ) as Reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
      immutableCheck: false,
    }),
});

export const persistor = persistStore(store);
