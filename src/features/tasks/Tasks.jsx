import React, { useState } from "react"
import { Layout, Table, Button } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import { pick } from "lodash"
import { useDispatch, useSelector } from "react-redux"
import TaskForm from "./TaskForm"
import {
  addOneTask,
  removeOneTask,
  selectTask,
  taskLoading,
  updateOneTask,
} from "./taskSlice"

function Tasks() {
  const [showModal, setShowModal] = useState(false)
  const [item, setItem] = useState()
  const tasks = useSelector(selectTask.selectAll)
  const isLoading = useSelector(taskLoading)
  const dispatch = useDispatch()

  const onSave = (values) => {
    const data = pick(values, ["title", "description", "url"])
    const promise = item
      ? dispatch(updateOneTask({ ...data, _id: item._id }))
      : dispatch(addOneTask(data))

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
      title: "Название",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Описание",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "URL",
      dataIndex: "url",
      key: "url",
      render: (text, record) => (
        <div>
          <a href={record.url} target="_blank" rel="noreferrer">
            {record.url}
          </a>
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
            onClick={() => {
              if (window.confirm("Вы точно хотите удалить упражение?"))
                dispatch(removeOneTask(record._id))
            }}
          >
            Удалить
          </Button>
        </div>
      ),
    },
  ]

  return (
    <Layout>
      <Button type="primary" onClick={() => setShowModal(true)}>
        <PlusOutlined /> Новое упражнение
      </Button>
      <Table dataSource={tasks} columns={columns} rowKey="_id" />
      <TaskForm
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

export default Tasks
