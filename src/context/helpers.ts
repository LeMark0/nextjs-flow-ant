import { Edge } from '@xyflow/react'
import { WorkflowNode } from '@/context/WorkflowContext'
import { NodeOrderType } from '@/constants'

export function checkIfConnectionOrderValid(
  sourceType: NodeOrderType,
  targetType: NodeOrderType,
): boolean {
  return (
    (sourceType === NodeOrderType.Start && targetType === NodeOrderType.Middle) ||
    (sourceType === NodeOrderType.Middle && targetType === NodeOrderType.End)
  )
}

function startHasOutgoingConnection(source: WorkflowNode, edges: Edge[]): boolean {
  return (
    source.data.type === NodeOrderType.Start && edges.some((e) => e.source === source.id)
  )
}

function endHasIncomingConnection(target: WorkflowNode, edges: Edge[]): boolean {
  return (
    target.data.type === NodeOrderType.End && edges.some((e) => e.target === target.id)
  )
}

function middleHasIncomingConnection(target: WorkflowNode, edges: Edge[]): boolean {
  return (
    target.data.type === NodeOrderType.Middle && edges.some((e) => e.target === target.id)
  )
}

function middleHasOutgoingConnection(source: WorkflowNode, edges: Edge[]): boolean {
  return (
    source.data.type === NodeOrderType.Middle && edges.some((e) => e.source === source.id)
  )
}

export function checkIfConnectionNumberValid(
  source: WorkflowNode,
  target: WorkflowNode,
  edges: Edge[],
): boolean {
  return (
    !startHasOutgoingConnection(source, edges) &&
    !middleHasIncomingConnection(target, edges) &&
    !middleHasOutgoingConnection(source, edges) &&
    !endHasIncomingConnection(target, edges)
  )
}

export function checkIfConnectionValid(
  source: WorkflowNode,
  target: WorkflowNode,
  edges: Edge[],
): boolean {
  return (
    checkIfConnectionOrderValid(source.data.type, target.data.type) &&
    checkIfConnectionNumberValid(source, target, edges)
  )
}
