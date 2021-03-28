import React, { useEffect, useState } from "react"
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
  ConfigProvider,
} from "antd"
import moment from "moment"
import { useSelector } from "react-redux"
import { get } from "lodash"
import ru from "antd/lib/locale-provider/ru_RU"
import { selectMarathon } from "./marathonSlice"
import { selectTask } from "../tasks/taskSlice"
import { selectRation } from "../rations/rationSlice"

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

  // const rations = useSelector(selectRation.selectAll)
  // const rationEntities = useSelector(selectRation.selectEntities)

  const handleChangeTaskEvent = (task, date) => {
    const currentEvent = events.find((e) => e.date.isSame(date, "day"))
    if (!task && !currentEvent.ration) {
      return setEvents(events.filter((e) => !e.date.isSame(date, "day")))
    }
    if (currentEvent) {
      return setEvents(
        events.map((e) => (e.date.isSame(date, "day") ? { ...e, task } : e))
      )
    }
    return setEvents([...events, { date, task }])
  }
  // const handleChangeRationEvent = (ration, date) => {
  //   const currentEvent = events.find((e) => e.date.isSame(date, "day"))
  //   if (!ration && !currentEvent.task) {
  //     return setEvents(events.filter((e) => !e.date.isSame(date, "day")))
  //   }
  //   if (currentEvent) {
  //     return setEvents(
  //       events.map((e) => (e.date.isSame(date, "day") ? { ...e, ration } : e))
  //     )
  //   }
  //   return setEvents([...events, { date, ration }])
  // }

  const dateCellRender = (date) => {
    const currentEvent = events.find((e) => e.date.isSame(date, "day"))
    const isSelected = date.isSame(selectedDate, "day")

    if (isSelected) {
      return (
        <>
          <Select
            allowClear
            showSearch
            placeholder="Упражнение"
            defaultValue={currentEvent?.task}
            style={{ width: "100%" }}
            onChange={(task) => handleChangeTaskEvent(task, date)}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {tasks.map((t) => (
              <Option value={t._id} key={t._id}>
                {t.title}
              </Option>
            ))}
          </Select>
          {/* <Select */}
          {/*  allowClear */}
          {/*  showSearch */}
          {/*  placeholder="Рацион" */}
          {/*  defaultValue={currentEvent?.ration} */}
          {/*  style={{ width: "100%" }} */}
          {/*  onChange={(ration) => handleChangeRationEvent(ration, date)} */}
          {/*  filterOption={(input, option) => */}
          {/*    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 */}
          {/*  } */}
          {/* > */}
          {/*  {rations.map((t) => ( */}
          {/*    <Option value={t._id} key={t._id}> */}
          {/*      {t.title} */}
          {/*    </Option> */}
          {/*  ))} */}
          {/* </Select> */}
        </>
      )
    }
    if (currentEvent) {
      const badges = []
      const task = get(taskEntities, `${[currentEvent.task]}.title`)
      // const ration = get(rationEntities, `${[currentEvent.ration]}.title`)
      if (task) badges.push(<Badge status="success" text={task} />)
      // if (ration) badges.push(<Badge status="error" text={ration} />)
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>{badges}</div>
      )
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
      width="90%"
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
            disabledDate={(c) =>
              c && c < moment().subtract(1, "days").endOf("day")
            }
          />
        </Form.Item>
        {range && (
          <ConfigProvider locale={ru}>
            <Calendar
              validRange={range}
              dateCellRender={dateCellRender}
              onSelect={(d) => setSelectedDate(d)}
              value={selectedDate}
            />
          </ConfigProvider>
        )}
      </Form>
    </Modal>
  )
}

export default MarathonForm
