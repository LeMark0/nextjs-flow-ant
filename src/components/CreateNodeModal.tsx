'use client'

import { Form, Input, Modal, Select } from 'antd'
import { useState } from 'react'
import { useWorkflowContext } from '@/context/WorkflowContext'
import { NodeType } from '@/constants'

type Props = {
  open: boolean
  onCloseAction: () => void
}

const nodeTypeOptions = [
  { label: 'Start', value: NodeType.Start },
  { label: 'Middle', value: NodeType.Middle },
  { label: 'End', value: NodeType.End },
]

export const CreateNodeModal = ({ open, onCloseAction }: Props) => {
  const [form] = Form.useForm()
  const { addNode } = useWorkflowContext()
  const [isFormValid, setIsFormValid] = useState(false)

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      addNode(values.type as NodeType, values.title)
      form.resetFields()
      onCloseAction()
    } catch {
      // TODO: show validation errors if needed
    }
  }

  const handleFormChange = () => {
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length > 0)
    const hasTouched = form.isFieldsTouched(true)
    setIsFormValid(!hasErrors && hasTouched)
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
        setIsFormValid(false)
      }}
      onOk={handleSubmit}
      okText="Create"
      okButtonProps={{ disabled: !isFormValid }}
    >
      <Form layout="vertical" form={form} onValuesChange={handleFormChange}>
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
