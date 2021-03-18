import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit"
import axios from "axios"
import moment from "moment"

const url = "/api/marathons"

const deserializeItem = (i) => ({
  ...i,
  range: i.range.map((r) => moment(r)),
  events: i.events.map((e) => ({ ...e, date: moment(e.date) })),
})

const serializeItem = (i) => ({
  ...i,
  range: i.range.map((r) => moment(r).format()),
  events: i.events.map((e) => ({ ...e, date: moment(e.date).format() })),
})

export const fetchMarathons = createAsyncThunk(
  "marathons/fetchAll",
  async () => {
    const response = await axios.get(url)

    return response.data.map(deserializeItem)
  }
)
export const addOneMarathon = createAsyncThunk(
  "marathons/addOne",
  async (data) => {
    const response = await axios({
      method: "post",
      url,
      data: serializeItem(data),
    })
    return deserializeItem(response.data)
  }
)
export const removeOneMarathon = createAsyncThunk(
  "marathons/removeOne",
  async (id) => {
    await axios.delete(`${url}/${id}`)
    return id
  }
)

export const updateOneMarathon = createAsyncThunk(
  "marathons/updateOne",
  async (data) => {
    const response = await axios({
      method: "patch",
      url: `${url}/${data._id}`,
      data: serializeItem(data),
    })
    return { id: data._id, changes: deserializeItem(response.data) }
  }
)

export const marathonsAdapter = createEntityAdapter({ selectId: (t) => t._id })

export const marathonSlice = createSlice({
  name: "marathons",
  initialState: marathonsAdapter.getInitialState({ loading: false }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarathons.fulfilled, marathonsAdapter.upsertMany)
      .addCase(addOneMarathon.fulfilled, marathonsAdapter.addOne)
      .addCase(updateOneMarathon.fulfilled, marathonsAdapter.updateOne)
      .addCase(removeOneMarathon.fulfilled, marathonsAdapter.removeOne)
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

export const selectMarathon = marathonsAdapter.getSelectors(
  (state) => state.marathons
)

export default marathonSlice.reducer
