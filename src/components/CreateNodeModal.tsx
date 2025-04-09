'use client'

import { Form, Input, Modal, Select } from 'antd'
import { useWorkflowContext } from '@/context/WorkflowContext'
import { NodeOrderType, typeOptions } from '@/constants'

type Props = {
  open: boolean
  onCloseAction: () => void
}

export const CreateNodeModal = ({ open, onCloseAction }: Props) => {
  const [form] = Form.useForm()
  const { addNode } = useWorkflowContext()

  const handleSubmit = async () => {
    const values = await form.validateFields()
    addNode(values.type as NodeOrderType, values.title)
    form.resetFields()
    onCloseAction()
  }

  return (
    <Modal
      title="Create Node"
      open={open}
      onCancel={() => {
        form.resetFields()
        onCloseAction()
      }}
      afterClose={() => {
        form.resetFields()
      }}
      onOk={handleSubmit}
      okText="Create"
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          name="type"
          label="Node Type"
          rules={[{ required: true, message: 'Please select a type' }]}
        >
          <Select options={typeOptions} />
        </Form.Item>

        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please enter a title' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}
