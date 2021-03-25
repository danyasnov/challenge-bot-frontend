import { Form, Input, Modal } from "antd"
import React, { useEffect } from "react"

const { TextArea } = Input

const RationForm = ({ visible, onSave, onCancel, isLoading, item = {} }) => {
  const [form] = Form.useForm()
  useEffect(() => {
    form.resetFields()
  }, [form, item])
  return (
    <Modal
      visible={visible}
      title={`${item._id ? "Изменить" : "Создать"} рацион`}
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
          <Form.Item
            label="Диета A"
            name="dietA"
            rules={[
              {
                required: true,
                message: "Введите название!",
              },
            ]}
          >
            <TextArea />
          </Form.Item>
          <Form.Item
            label="Диета B"
            name="dietB"
            rules={[
              {
                required: true,
                message: "Введите название!",
              },
            ]}
          >
            <TextArea />
          </Form.Item>
          <Form.Item
            label="Диета C"
            name="dietC"
            rules={[
              {
                required: true,
                message: "Введите название!",
              },
            ]}
          >
            <TextArea />
          </Form.Item>
          <Form.Item
            label="Диета D"
            name="dietD"
            rules={[
              {
                required: true,
                message: "Введите название!",
              },
            ]}
          >
            <TextArea />
          </Form.Item>
        </Form>
      )}
    </Modal>
  )
}

function isValidHttpUrl(string) {
  let url

  try {
    url = new URL(string)
  } catch (_) {
    return false
  }

  return url.protocol === "http:" || url.protocol === "https:"
}

export default RationForm
