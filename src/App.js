import React, { useEffect } from "react"
import "moment/locale/ru"
import "./App.css"
import "antd/dist/antd.css"
import { Layout, Menu } from "antd"
import { Link, Router, useLocation, Redirect } from "@reach/router"
import { useDispatch } from "react-redux"
import moment from "moment"
import Tasks from "./features/tasks/Tasks"
import Marathons from "./features/marathons/Marathons"
import { fetchTasks } from "./features/tasks/taskSlice"
import { fetchMarathons } from "./features/marathons/marathonSlice"
import Users from "./features/users/Users"
import { fetchUsers } from "./features/users/userSlice"
import { fetchRations } from "./features/rations/rationSlice"
import Rations from "./features/rations/Rations"

moment.locale("ru")
const { Content, Sider } = Layout

function App() {
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchTasks())
    dispatch(fetchMarathons())
    dispatch(fetchUsers())
    dispatch(fetchRations())
  }, [dispatch])
  const routerDict = {
    "/marathons": "1",
    "/tasks": "2",
    "/users": "3",
    "/rations": "4",
  }
  if (location.pathname === "/") return <Redirect to="/marathons" noThrow />
  return (
    <Layout>
      <Content style={{ padding: "0 50px" }}>
        <Layout style={{ padding: "24px 0" }}>
          <Sider width={200}>
            <Menu
              defaultSelectedKeys={[routerDict[location.pathname]]}
              mode="inline"
              theme="dark"
            >
              <Menu.Item key="1">
                <Link to="marathons">Марафоны</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="tasks">Упражнения</Link>
              </Menu.Item>
              <Menu.Item key="4">
                <Link to="rations">Рационы</Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to="users">Пользователи</Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Content style={{ padding: "0 24px", minHeight: 280 }}>
            <Router>
              <Marathons path="marathons" />
              <Tasks path="tasks" />
              <Users path="users" />
              <Rations path="rations" />
            </Router>
          </Content>
        </Layout>
      </Content>
    </Layout>
  )
}

export default App
