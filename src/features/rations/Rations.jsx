import React, { useState } from "react"
import { Layout, Table, Button } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import { pick } from "lodash"
import { useDispatch, useSelector } from "react-redux"
import RationForm from "./RationForm"
import {
  addOneRation,
  removeOneRation,
  selectRation,
  rationLoading,
  updateOneRation,
} from "./rationSlice"

function Rations() {
  const [showModal, setShowModal] = useState(false)
  const [item, setItem] = useState()
  const rations = useSelector(selectRation.selectAll)
  const isLoading = useSelector(rationLoading)
  const dispatch = useDispatch()

  const onSave = (values) => {
    const data = pick(values, ["title", "dietA", "dietB", "dietC", "dietD"])
    const promise = item
      ? dispatch(updateOneRation({ ...data, _id: item._id }))
      : dispatch(addOneRation(data))

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
      title: "Диета A",
      dataIndex: "dietA",
      key: "dietA",
    },
    {
      title: "Диета B",
      dataIndex: "dietB",
      key: "dietB",
    },
    {
      title: "Диета C",
      dataIndex: "dietC",
      key: "dietC",
    },
    {
      title: "Диета D",
      dataIndex: "dietD",
      key: "dietD",
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
              if (window.confirm("Вы точно хотите удалить рацион?"))
                dispatch(removeOneRation(record._id))
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
        <PlusOutlined /> Новый рацион
      </Button>
      <Table dataSource={rations} columns={columns} rowKey="_id" />
      <RationForm
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

export default Rations
