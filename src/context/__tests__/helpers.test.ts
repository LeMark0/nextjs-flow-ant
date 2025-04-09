import { describe, expect, it } from 'vitest'

import {
  checkIfConnectionNumberValid,
  checkIfConnectionOrderValid,
  checkIfConnectionValid,
} from '../helpers'
import { NodeOrderType } from '@/constants'
import { Edge } from '@xyflow/react'
import { WorkflowNode } from '@/context/WorkflowContext'

const createNode = (id: string, type: NodeOrderType): WorkflowNode => ({
  id,
  position: { x: 0, y: 0 },
  data: { label: type, type },
  type: undefined,
})

describe('checkIfConnectionOrderValid', () => {
  it('should allow Start -> Middle', () => {
    expect(checkIfConnectionOrderValid(NodeOrderType.Start, NodeOrderType.Middle)).toBe(
      true,
    )
  })

  it('should allow Middle -> End', () => {
    expect(checkIfConnectionOrderValid(NodeOrderType.Middle, NodeOrderType.End)).toBe(
      true,
    )
  })

  it('should block Start -> End', () => {
    expect(checkIfConnectionOrderValid(NodeOrderType.Start, NodeOrderType.End)).toBe(
      false,
    )
  })

  it('should block Middle -> Start', () => {
    expect(checkIfConnectionOrderValid(NodeOrderType.Middle, NodeOrderType.Start)).toBe(
      false,
    )
  })
})

describe('checkIfConnectionNumberValid', () => {
  it('should block Start if already connected to a Middle', () => {
    const source = createNode('1', NodeOrderType.Start)
    const target = createNode('2', NodeOrderType.Middle)
    const edges: Edge[] = [{ id: 'e1', source: '1', target: '3' }]

    expect(checkIfConnectionNumberValid(source, target, edges)).toBe(false)
  })

  it('should block Middle if it already has incoming Start', () => {
    const source = createNode('1', NodeOrderType.Start)
    const target = createNode('2', NodeOrderType.Middle)
    const edges: Edge[] = [{ id: 'e1', source: '3', target: '2' }]

    expect(checkIfConnectionNumberValid(source, target, edges)).toBe(false)
  })

  it('should block Middle if it already has outgoing End', () => {
    const source = createNode('2', NodeOrderType.Middle)
    const target = createNode('3', NodeOrderType.End)
    const edges: Edge[] = [{ id: 'e1', source: '2', target: '4' }]

    expect(checkIfConnectionNumberValid(source, target, edges)).toBe(false)
  })

  it('should block End if it already has incoming Middle', () => {
    const source = createNode('2', NodeOrderType.Middle)
    const target = createNode('3', NodeOrderType.End)
    const edges: Edge[] = [{ id: 'e1', source: '4', target: '3' }]

    expect(checkIfConnectionNumberValid(source, target, edges)).toBe(false)
  })

  it('should allow connection when node limits are not reached', () => {
    const source = createNode('1', NodeOrderType.Start)
    const target = createNode('2', NodeOrderType.Middle)
    const edges: Edge[] = []

    expect(checkIfConnectionNumberValid(source, target, edges)).toBe(true)
  })
})

describe('checkIfConnectionValid', () => {
  it('should return true for Start -> Middle if none connected', () => {
    const source = createNode('1', NodeOrderType.Start)
    const target = createNode('2', NodeOrderType.Middle)

    expect(checkIfConnectionValid(source, target, [])).toBe(true)
  })

  it('should return false for Start -> End (invalid order)', () => {
    const source = createNode('1', NodeOrderType.Start)
    const target = createNode('2', NodeOrderType.End)

    expect(checkIfConnectionValid(source, target, [])).toBe(false)
  })

  it('should return false for valid order but blocked by connection limit', () => {
    const source = createNode('1', NodeOrderType.Start)
    const target = createNode('2', NodeOrderType.Middle)
    const edges: Edge[] = [{ id: 'e1', source: '1', target: '3' }]

    expect(checkIfConnectionValid(source, target, edges)).toBe(false)
  })
})
