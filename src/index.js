import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import { Provider } from "react-redux"
import { get } from "lodash"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import { Router, navigate } from "@reach/router"
import * as serviceWorker from "./serviceWorker"
import store from "./app/store"
import App from "./App"
import Login from "./components/Login"

axios.interceptors.response.use(
  (response) =>
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    response,
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const status = get(error, "response.status")
    if (status === 401) {
      navigate("/login")
    } else {
      toast(error.response.data.message)
    }

    return Promise.reject(error)
  }
)
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App path="/*" />
        <Login path="login" />
      </Router>
    </Provider>
    <ToastContainer autoClose={30000} />
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
