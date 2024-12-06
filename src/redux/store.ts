// src/redux/store.ts
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import mapDataSlice from "./reducers/MapDataSlice";
// import { provinceMiddleware } from "./middlewares/provinceMiddleware";
// import zipDataSlice from "./reducers/ZipDataSlice";


const rootReducer = {
  [mapDataSlice.reducerPath]:mapDataSlice.reducer

};

export const reduxStore = configureStore({
  reducer: rootReducer,

  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(provinceMiddleware),

//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(apiSlice.middleware),
//   devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
