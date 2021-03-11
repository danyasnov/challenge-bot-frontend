import React, { useEffect } from "react"
import "./App.css"
import "antd/dist/antd.css"
import { Layout, Menu } from "antd"
import { Link, Router, useLocation, Redirect } from "@reach/router"
import { useDispatch } from "react-redux"
import Tasks from "./components/Tasks"
import Marathons from "./components/Marathons"
import { fetchTasks } from "./app/taskSlice"
import { fetchMarathons } from "./app/marathonSlice"

const { Content, Sider } = Layout

function App() {
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchTasks())
    dispatch(fetchMarathons())
  }, [dispatch])
  let defaultSelectedKey
  if (location.pathname === "/marathons") {
    defaultSelectedKey = "1"
  } else if (location.pathname === "/tasks") {
    defaultSelectedKey = "2"
  }

  return (
    <Layout>
      <Content style={{ padding: "0 50px" }}>
        <Layout style={{ padding: "24px 0" }}>
          <Sider width={200}>
            <Menu
              defaultSelectedKeys={[defaultSelectedKey]}
              mode="inline"
              theme="dark"
            >
              <Menu.Item key="1">
                <Link to="marathons">Марафоны</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="tasks">Упражнения</Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Content style={{ padding: "0 24px", minHeight: 280 }}>
            <Router>
              <Marathons path="marathons" />
              <Tasks path="tasks" />
            </Router>
          </Content>
        </Layout>
      </Content>
      {/* <Redirect from="/" to="/marathons" noThrow /> */}
    </Layout>
  )
}

export default App
