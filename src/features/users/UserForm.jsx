import { Form, Input, Modal, Select, Image, Row, Col, Slider } from "antd"
import React, { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { Line } from "@ant-design/charts"
import moment from "moment"
import axios from "axios"
import { selectMarathon } from "../marathons/marathonSlice"
import { foodGroupsDict, measureKeyDict } from "../utils"

const { Option } = Select

const UserForm = ({ visible, onSave, onCancel, isLoading, item = {} }) => {
  const [form] = Form.useForm()
  const ref = useRef()
  const [pics, setPics] = useState([])

  const marathons = useSelector(selectMarathon.selectAll)
  const initial = {
    ...item,
    marathons: item.marathons.map((m) => m.id),
  }

  useEffect(() => {
    form.resetFields()
  }, [form, item])

  useEffect(() => {
    axios(`/api/getUserPics/${item._id}`).then((res) => {
      setPics(res.data)
    })
  }, [])

  const data = item.measurements.reduce((acc, val) => {
    const nextM = []
    Object.entries(val).forEach(([key, value]) => {
      if (measureKeyDict[key]) {
        nextM.push({
          value,
          category: measureKeyDict[key],
          date: moment(val.created_at).format("YYYY-MM-DD HH:mm:ss"),
        })
      }
    })
    return [...acc, ...nextM]
  }, [])

  const photos = pics
    .filter((p) => !!p.items.length)
    .map((val) => (
      <>
        <p>{moment(val.created_at).format("YYYY-MM-DD HH:mm:ss")}</p>
        <Row gutter={[16, 16]}>
          {val.items.map((url) => (
            <Col span={6}>
              <Image width={150} key={url} src={url} crossorigin="anonymous" />
            </Col>
          ))}
        </Row>
      </>
    ))

  return (
    <Modal
      visible={visible}
      title="Изменить пользователя"
      okText="Сохранить"
      width="80%"
      cancelText="Отменить"
      onCancel={onCancel}
      okButtonProps={{ disabled: isLoading, loading: isLoading }}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields()
            onSave(values)
          })
          .catch((info) => {
            console.log("Validate Failed:", info)
          })
      }}
    >
      {visible && (
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={initial}
        >
          <Form.Item label="Марафоны" name="marathons">
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Выберите марафон"
              onChange={(v) =>
                form.setFieldsValue({
                  marathons: v,
                })
              }
            >
              {marathons.map((m) => (
                <Option value={m._id} key={m._id}>
                  {m.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Группа питания" name="foodGroup">
            <Select
              allowClear
              style={{ width: "100%" }}
              placeholder="Выберите группу питания"
              onChange={(v) =>
                form.setFieldsValue({
                  foodGroup: v,
                })
              }
            >
              {Object.keys(foodGroupsDict).map((key) => (
                <Option value={key} key={key}>
                  {foodGroupsDict[key]}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {!!data.length && (
            <Line
              data={data}
              xField="date"
              yField="value"
              seriesField="category"
              color={[
                "#FAA219",
                "#0074D9",
                "#7FDBFF",
                "#3D9970",
                "#B10DC9",
                "#FF4136",
                "#85144b",
                "#FFDC00",
                "#111111",
              ]}
              chartRef={ref}
            />
          )}
          {photos}
        </Form>
      )}
    </Modal>
  )
}

export default UserForm
