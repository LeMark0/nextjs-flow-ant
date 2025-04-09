import { Handle, NodeProps, Position } from '@xyflow/react'
import { Button } from 'antd'
import { useWorkflowContext } from '@/context/WorkflowContext'
import { NodeOrderType } from '@/constants'
import { EditableWorkflowNode } from '@/types'

export const EditableNode = ({ id, data }: NodeProps<EditableWorkflowNode>) => {
  const { selectNode } = useWorkflowContext()
  const { type } = data

  return (
    <div className="flex align-center items-center justify-between text-gray-700">
      {type !== NodeOrderType.Start && <Handle type="target" position={Position.Top} />}

      <div className="text-xs truncate">{data.label}</div>
      <Button size="small" className="text-xs" onClick={() => selectNode(id)}>
        Edit
      </Button>

      {type !== NodeOrderType.End && <Handle type="source" position={Position.Bottom} />}
    </div>
  )
}
