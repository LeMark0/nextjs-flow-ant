'use client'

import { Form, Input, Modal, Select } from 'antd'
import { useWorkflowContext } from '@/context/WorkflowContext'
import { NodeOrderType } from '@/constants'

type Props = {
  open: boolean
  onCloseAction: () => void
}

const nodeTypeOptions = [
  { label: 'Start', value: NodeOrderType.Start },
  { label: 'Middle', value: NodeOrderType.Middle },
  { label: 'End', value: NodeOrderType.End },
]

export const CreateNodeModal = ({ open, onCloseAction }: Props) => {
  const [form] = Form.useForm()
  const { addNode } = useWorkflowContext()

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      addNode(values.type as NodeOrderType, values.title)
      form.resetFields()
      onCloseAction()
    } catch {
      // TODO: show validation errors if needed
    }
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
          <Select options={nodeTypeOptions} />
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
