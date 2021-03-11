import React, { useState } from "react"
import {
  Layout,
  Menu,
  Table,
  Row,
  Modal,
  Form,
  Input,
  Button,
  Calendar,
  Badge,
  DatePicker,
  Select,
} from "antd"
import moment from "moment"
import { useSelector } from "react-redux"
import { get } from "lodash"
import { selectMarathon } from "./marathonSlice"
import { selectTask } from "../tasks/taskSlice"

const { Option } = Select
const { RangePicker } = DatePicker

const MarathonForm = ({ onSave, onCancel, isLoading, item = {} }) => {
  const [form] = Form.useForm()
  const [range, setRange] = useState(item.range || null)
  const [events, setEvents] = useState(item.events || [])
  const [selectedDate, setSelectedDate] = useState(
    item.range ? item.range[0] : null
  )
  const tasks = useSelector(selectTask.selectAll)
  const taskEntities = useSelector(selectTask.selectEntities)

  const handleChangeEvent = (task, date) => {
    const currentEvent = events.find((e) => e.date.isSame(date, "day"))
    if (!task) {
      return setEvents(events.filter((e) => !e.date.isSame(date, "day")))
    }
    if (currentEvent) {
      return setEvents(
        events.map((e) => (e.date.isSame(date, "day") ? { ...e, task } : e))
      )
    }
    return setEvents([...events, { date, task }])
  }

  const dateCellRender = (date) => {
    const currentEvent = events.find((e) => e.date.isSame(date, "day"))
    const isSelected = date.isSame(selectedDate, "day")

    if (isSelected) {
      return (
        <Select
          allowClear
          defaultValue={currentEvent?.task}
          style={{ width: "100%" }}
          onChange={(task) => handleChangeEvent(task, date)}
        >
          {tasks.map((t) => (
            <Option value={t._id} key={t._id}>
              {t.title}
            </Option>
          ))}
        </Select>
      )
    }
    if (currentEvent) {
      const title = get(taskEntities, `${[currentEvent.task]}.title`)
      return <Badge status="success" text={title} />
    }

    return null
  }

  return (
    <Modal
      visible
      title={`${item._id ? "Изменить" : "Создать"} марафон`}
      okText="Сохранить"
      cancelText="Отменить"
      onCancel={onCancel}
      width="80%"
      okButtonProps={{ disabled: isLoading, loading: isLoading }}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields()
            onSave({ ...values, events })
          })
          .catch((info) => {
            console.log("Validate Failed:", info)
          })
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={item}
      >
        <Form.Item
          label="Название"
          name="title"
          rules={[
            {
              required: true,
              message: "Введите название!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Описание" name="description">
          <Input />
        </Form.Item>
        <Form.Item
          label="Дистанция"
          name="range"
          rules={[
            {
              required: true,
              message: "Выберите дистанцию!",
            },
          ]}
        >
          <RangePicker
            ranges={range}
            onChange={(r) => {
              setRange(r)
              setSelectedDate(r ? r[0] : null)
            }}
            disabledDate={(c) => c && c < moment().endOf("day")}
          />
        </Form.Item>
        {range && (
          <Calendar
            validRange={range}
            dateCellRender={dateCellRender}
            onSelect={(d) => setSelectedDate(d)}
            value={selectedDate}
          />
        )}

        {/* <Form.Item */}
        {/*  label="URL" */}
        {/*  name="url" */}
        {/*  rules={[ */}
        {/*    { */}
        {/*      required: true, */}
        {/*      message: "Введите URL!", */}
        {/*    }, */}
        {/*  ]} */}
        {/* > */}
        {/*  <Input /> */}
        {/* </Form.Item> */}
      </Form>
    </Modal>
  )
}

export default MarathonForm
