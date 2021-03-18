import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit"
import axios from "axios"

const url = "/api/users"
export const fetchUsers = createAsyncThunk("users/fetchAll", async () => {
  const response = await axios.get(url)
  return response.data
})

export const addOneUser = createAsyncThunk("users/addOne", async (data) => {
  const response = await axios({
    method: "post",
    url,
    data,
  })
  return response.data
})
export const removeOneUser = createAsyncThunk("users/removeOne", async (id) => {
  await axios.delete(`${url}/${id}`)
  return id
})

export const updateOneUser = createAsyncThunk(
  "users/updateOne",
  async (data) => {
    const response = await axios({
      method: "patch",
      url: `${url}/${data._id}`,
      data,
    })
    return { id: data._id, changes: response.data }
  }
)

export const usersAdapter = createEntityAdapter({ selectId: (t) => t._id })

export const userSlice = createSlice({
  name: "users",
  initialState: usersAdapter.getInitialState({ loading: false }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, usersAdapter.upsertMany)
      .addCase(addOneUser.fulfilled, usersAdapter.addOne)
      .addCase(updateOneUser.fulfilled, usersAdapter.updateOne)
      .addCase(removeOneUser.fulfilled, usersAdapter.removeOne)
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

export const selectUser = usersAdapter.getSelectors((state) => state.users)
export const userLoading = (state) => state.users.loading

export default userSlice.reducer
