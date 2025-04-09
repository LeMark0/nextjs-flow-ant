'use client'

import React, { useState } from 'react'
import { Background, Controls, ReactFlow } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { useWorkflowContext } from '@/context/WorkflowContext'
import { CreateNodeModal } from './CreateNodeModal'

// TODO: for start and end nodes remove attach point after connecting
// TODO: make sure that middle node can only connect to one start and one end
// TODO: make sure that start/end can only connect with middle

export const WorkflowDiagram = () => {
  const { nodes, edges, setNodes, setEdges, connectEdge } = useWorkflowContext()
  const [isModalOpen, setIsModalOpen] = useState(false)

  console.log('nodes: ', nodes)
  // console.log('edges: ', edges)

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
