'use client'

import { Button, Drawer, Form, Input, Select, Space } from 'antd'
import { useCallback, useEffect, useMemo } from 'react'
import { useWorkflowContext } from '@/context/WorkflowContext'
import { typeOptions } from '@/constants'

export const EditNodeDrawer = () => {
  const [form] = Form.useForm()
  const { selectedNodeId, nodes, edges, updateNode, selectNode } = useWorkflowContext()

  const node = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId),
    [nodes, selectedNodeId],
  )

  const hasConnections = useMemo(
    () =>
      Boolean(node) && edges.some((e) => e.source === node?.id || e.target === node?.id),
    [edges, node],
  )

  const handleClose = useCallback(() => {
    form.resetFields()
    selectNode(null)
  }, [form, selectNode])

  const handleSubmit = async () => {
    const values = await form.validateFields()
    if (node) {
      updateNode(node.id, values)
      handleClose()
    }
  }

  const isOpen = Boolean(node)

  useEffect(
    function initialiseForm() {
      if (node) {
        form.setFieldsValue(node.data)
      }
    },
    [node, form],
  )

  return (
    <Drawer
      title="Edit Node"
      open={isOpen}
      onClose={handleClose}
      width={360}
      destroyOnClose
      footer={
        <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Space>
      }
    >
      {node && (
        <Form layout="vertical" form={form}>
          <Form.Item
            name="label"
            label="Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="type" label="Type">
            <Select options={typeOptions} disabled={hasConnections} />
          </Form.Item>
        </Form>
      )}
    </Drawer>
  )
}
