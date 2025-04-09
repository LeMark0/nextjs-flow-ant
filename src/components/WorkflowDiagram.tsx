'use client'

import React, { useState } from 'react'
import { Background, Controls, ReactFlow } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { useWorkflowContext } from '@/context/WorkflowContext'
import { CreateNodeModal } from './CreateNodeModal'
import { EditableNode } from './EditableNode'

const nodeTypes = {
  input: EditableNode,
  output: EditableNode,
  default: EditableNode,
}

export const WorkflowDiagram = () => {
  const { nodes, edges, setNodes, setEdges, connectEdge } = useWorkflowContext()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div style={{ width: '100%', height: '100vh' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}
          onClick={() => setIsModalOpen(true)}
        >
          Create Node
        </Button>
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={setNodes}
          onEdgesChange={setEdges}
          onConnect={connectEdge}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      <CreateNodeModal open={isModalOpen} onCloseAction={() => setIsModalOpen(false)} />
    </>
  )
}
