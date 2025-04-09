import type { Node } from '@xyflow/react'
import { NodeOrderType } from '@/constants'

export type EditableWorkflowNode = Node<
  {
    label: string
    type: NodeOrderType
  },
  'default'
>
