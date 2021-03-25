import { configureStore } from "@reduxjs/toolkit"
import logger from "redux-logger"
import tasksReducer from "./tasks/taskSlice"
import marathonsReducer from "./marathons/marathonSlice"
import usersReducer from "./users/userSlice"
import rationReducer from "./rations/rationSlice"

export default configureStore({
  reducer: {
    tasks: tasksReducer,
    marathons: marathonsReducer,
    users: usersReducer,
    rations: rationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(logger),
})
