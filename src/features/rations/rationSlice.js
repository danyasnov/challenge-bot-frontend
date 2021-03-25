import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit"
import axios from "axios"

const url = "/api/rations"
export const fetchRations = createAsyncThunk("rations/fetchAll", async () => {
  const response = await axios.get(url)
  return response.data
})
export const addOneRation = createAsyncThunk("rations/addOne", async (data) => {
  const response = await axios({
    method: "post",
    url,
    data,
  })
  return response.data
})
export const removeOneRation = createAsyncThunk(
  "rations/removeOne",
  async (id) => {
    await axios.delete(`${url}/${id}`)
    return id
  }
)

export const updateOneRation = createAsyncThunk(
  "rations/updateOne",
  async (data) => {
    const response = await axios({
      method: "patch",
      url: `${url}/${data._id}`,
      data,
    })
    return { id: data._id, changes: response.data }
  }
)

export const rationsAdapter = createEntityAdapter({ selectId: (t) => t._id })

export const rationSlice = createSlice({
  name: "rations",
  initialState: rationsAdapter.getInitialState({ loading: false }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRations.fulfilled, rationsAdapter.upsertMany)
      .addCase(addOneRation.fulfilled, rationsAdapter.addOne)
      .addCase(updateOneRation.fulfilled, rationsAdapter.updateOne)
      .addCase(removeOneRation.fulfilled, rationsAdapter.removeOne)
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

export const selectRation = rationsAdapter.getSelectors(
  (state) => state.rations
)
export const rationLoading = (state) => state.rations.loading

export default rationSlice.reducer
