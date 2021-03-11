import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit"
import axios from "axios"

const url = "/tasks"
export const fetchTasks = createAsyncThunk("tasks/fetchAll", async () => {
  const response = await axios.get(url)
  return response.data
})
export const addOneTask = createAsyncThunk("tasks/addOne", async (data) => {
  const response = await axios({
    method: "post",
    url,
    data,
  })
  return response.data
})
export const removeOneTask = createAsyncThunk("tasks/removeOne", async (id) => {
  await axios.delete(`${url}/${id}`)
  return id
})

export const updateOneTask = createAsyncThunk(
  "tasks/updateOne",
  async (data) => {
    const response = await axios({
      method: "patch",
      url: `${url}/${data._id}`,
      data,
    })
    return { id: data._id, changes: response.data }
  }
)

export const tasksAdapter = createEntityAdapter({ selectId: (t) => t._id })

export const taskSlice = createSlice({
  name: "tasks",
  initialState: tasksAdapter.getInitialState({ loading: false }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, tasksAdapter.upsertMany)
      .addCase(addOneTask.fulfilled, tasksAdapter.addOne)
      .addCase(updateOneTask.fulfilled, tasksAdapter.updateOne)
      .addCase(removeOneTask.fulfilled, tasksAdapter.removeOne)
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true
        }
      )
  },
})

export const selectTask = tasksAdapter.getSelectors((state) => state.tasks)
export const taskLoading = (state) => state.tasks.loading

export default taskSlice.reducer
