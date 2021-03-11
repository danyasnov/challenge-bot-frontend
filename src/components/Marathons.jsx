import React, { useState } from "react"
import { Layout, Table, Button } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import { pick } from "lodash"
import { useDispatch, useSelector } from "react-redux"
import MarathonForm from "./MarathonForm"
import {
  addOneMarathon,
  removeOneMarathon,
  selectMarathon,
  updateOneMarathon,
} from "../app/marathonSlice"

function Marathons() {
  const marathons = useSelector(selectMarathon.selectAll)
  const isLoading = useSelector((state) => state.marathons.loading)
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false)
  const [item, setItem] = useState()

  const onSave = (values) => {
    const data = pick(values, ["title", "description", "events", "range"])
    const promise = item
      ? dispatch(updateOneMarathon({ ...data, _id: item._id }))
      : dispatch(addOneMarathon(data))
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
      title: "Упражнение",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Описание",
      dataIndex: "description",
      key: "description",
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
            onClick={() => dispatch(removeOneMarathon(record._id))}
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
        <PlusOutlined /> Новый марафон
      </Button>
      <Table dataSource={marathons} columns={columns} rowKey="_id" />
      {showModal && (
        <MarathonForm
          onSave={onSave}
          isLoading={isLoading}
          item={item}
          onCancel={() => {
            setShowModal(false)
            setItem()
          }}
        />
      )}
    </Layout>
  )
}

export default Marathons
