import { ReactElement } from 'react'

import { describe, expect, it } from 'vitest'
import { fireEvent, render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import { Position, ReactFlowProvider } from '@xyflow/react'

import { EditableNode } from '../EditableNode'
import { NodeOrderType } from '@/constants'
import { WorkflowProvider } from '@/context/WorkflowContext'

export const renderWithWorkflow = (ui: ReactElement, options = {}) => {
  return render(
    <ReactFlowProvider>
      <WorkflowProvider>{ui}</WorkflowProvider>
    </ReactFlowProvider>,
    options,
  )
}

const baseProps = {
  id: 'node-1',
  type: 'default' as const,
  data: {
    label: 'Test Node',
    type: NodeOrderType.Middle,
  },
  selected: false,
  dragging: false,
  deletable: true,
  draggable: true,
  selectable: true,
  connectable: true,
  zIndex: 0,
  sourcePosition: Position.Bottom,
  targetPosition: Position.Top,
  width: 100,
  height: 40,
  position: { x: 0, y: 0 },
  dataInternals: {},
  events: {},
  // ✅ satisfy the expected fields
  isConnectable: true,
  positionAbsoluteX: 0,
  positionAbsoluteY: 0,
} as const

describe('EditableNode', () => {
  it('should render the node label', () => {
    renderWithWorkflow(<EditableNode {...baseProps} />)
    expect(screen.getByText('Test Node')).toBeInTheDocument()
  })

  it('should call selectNode when Edit button is clicked', () => {
    renderWithWorkflow(<EditableNode {...baseProps} />)
    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
  })

  it('should show both handles for a middle node', () => {
    renderWithWorkflow(<EditableNode {...baseProps} />)
    const handles = screen.getAllByRole('handle')
    expect(handles).toHaveLength(2)
  })

  it('should show only bottom handle for a start node', () => {
    renderWithWorkflow(
      <EditableNode
        {...baseProps}
        data={{ ...baseProps.data, type: NodeOrderType.Start }}
      />,
    )
    const handles = screen.getAllByRole('handle')
    expect(handles).toHaveLength(1)
  })

  it('should show only top handle for an end node', () => {
    renderWithWorkflow(
      <EditableNode
        {...baseProps}
        data={{ ...baseProps.data, type: NodeOrderType.End }}
      />,
    )
    const handles = screen.getAllByRole('handle')
    expect(handles).toHaveLength(1)
  })
})
