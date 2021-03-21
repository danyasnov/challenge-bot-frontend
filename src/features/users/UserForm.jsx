import { Form, Input, Modal, Select } from "antd"
import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { selectMarathon } from "../marathons/marathonSlice"

const { Option } = Select

const UserForm = ({ visible, onSave, onCancel, isLoading, item = {} }) => {
  const [form] = Form.useForm()
  const marathons = useSelector(selectMarathon.selectAll)
  const initial = {
    marathons: item.marathons.map((m) => m.id),
  }

  useEffect(() => {
    form.resetFields()
  }, [form, item])
  return (
    <Modal
      visible={visible}
      title="Изменить пользователя"
      okText="Сохранить"
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
        </Form>
      )}
    </Modal>
  )
}

export default UserForm
