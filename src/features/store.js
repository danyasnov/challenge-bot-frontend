import { configureStore } from "@reduxjs/toolkit"
import logger from "redux-logger"
import tasksReducer from "./tasks/taskSlice"
import marathonsReducer from "./marathons/marathonSlice"
import usersReducer from "./users/userSlice"

export default configureStore({
  reducer: {
    tasks: tasksReducer,
    marathons: marathonsReducer,
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(logger),
})
