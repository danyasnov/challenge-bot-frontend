import { Form, Input, Modal, Select, Image, Row, Col, Slider } from "antd"
import React, { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { Line } from "@ant-design/charts"
import moment from "moment"
import axios from "axios"
import { selectMarathon } from "../marathons/marathonSlice"

const { Option } = Select
const keyDict = {
  age: "Возраст",
  chest: "Грудь",
  height: "Рост",
  leftHipCoverage: "Левая нога",
  narrowWaist: "Узкое место талии",
  pelvis: "Таз",
  rightHipCoverage: "Правая нога",
  weight: "Вес",
  wideWaist: "Широкое место талии",
}
const photoKeyDict = {
  backPhotoUrl: "Сзади",
  frontPhotoUrl: "Спереди",
  leftPhotoUrl: "Слева",
  rightPhotoUrl: "Справа",
}
const UserForm = ({ visible, onSave, onCancel, isLoading, item = {} }) => {
  const [form] = Form.useForm()
  const ref = useRef()
  const [pics, setPics] = useState([])

  const marathons = useSelector(selectMarathon.selectAll)
  const initial = {
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
      if (keyDict[key]) {
        nextM.push({
          value,
          category: keyDict[key],
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
              <Image width={150} key={url} src={url} />
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
