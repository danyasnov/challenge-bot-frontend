import React, { useState } from "react"
import { Layout, Table, Button } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import { pick } from "lodash"
import { useDispatch, useSelector } from "react-redux"
import UserForm from "./UserForm"
import {
  addOneUser,
  removeOneUser,
  selectUser,
  userLoading,
  updateOneUser,
} from "./userSlice"
import { selectMarathon } from "../marathons/marathonSlice"

function Users() {
  const [showModal, setShowModal] = useState(false)
  const [item, setItem] = useState()
  const users = useSelector(selectUser.selectAll)
  const marathonsEntities = useSelector(selectMarathon.selectEntities)
  const isLoading = useSelector(userLoading)
  const dispatch = useDispatch()

  const onSave = (values) => {
    const data = pick(values, ["marathons"])
    const promise = item
      ? dispatch(updateOneUser({ ...data, _id: item._id }))
      : dispatch(addOneUser(data))

    promise
      .then(() => {
        setShowModal(false)
        setItem()
      })
      .catch(() => {
        setShowModal(false)
        setItem()
      })
  }
  const columns = [
    {
      title: "Имя",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div>{[record.first_name, record.last_name].join(" ")}</div>
      ),
    },
    {
      title: "Telegram ник - ID",
      dataIndex: "nickname",
      key: "nickname",
      render: (text, record) => (
        <div>{[record.username, record.id].join(" - ")}</div>
      ),
    },
    {
      title: "Подтвержденный участник",
      dataIndex: "approved",
      key: "approved",
      render: (text, record) => (
        <div>
          {record.marathons.map((m) => marathonsEntities[m].title).join(", ")}
        </div>
      ),
    },
    {
      title: "Действия",
      dataIndex: "",
      key: "x",
      render: (text, record) => (
        <div>
          <Button
            type="primary"
            onClick={() => {
              setItem(record)
              setShowModal(true)
            }}
            style={{ marginRight: 10 }}
          >
            Изменить
          </Button>
          <Button
            type="primary"
            onClick={() => dispatch(removeOneUser(record._id))}
          >
            Удалить
          </Button>
        </div>
      ),
    },
  ]

  return (
    <Layout>
      <Table dataSource={users} columns={columns} rowKey="_id" />
      <UserForm
        visible={showModal}
        onSave={onSave}
        isLoading={isLoading}
        item={item}
        onCancel={() => {
          setShowModal(false)
          setItem()
        }}
      />
    </Layout>
  )
}

export default Users
