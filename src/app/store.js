import { configureStore } from "@reduxjs/toolkit"
import logger from "redux-logger"
import counterReducer from "../features/counter/counterSlice"
import tasksReducer from "./taskSlice"
import marathonsReducer from "./marathonSlice"

export default configureStore({
  reducer: {
    counter: counterReducer,
    tasks: tasksReducer,
    marathons: marathonsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(logger),
})
