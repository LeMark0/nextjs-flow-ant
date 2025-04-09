import { buildContext } from '@/lib/buildContext'

import { useCallback, useReducer } from 'react'
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
} from '@xyflow/react'
import { v4 as uuidv4 } from 'uuid'
import { NodeOrderType, NodeType } from '@/constants'
import { checkIfConnectionValid } from './helpers'

export interface WorkflowNode extends Node {
  data: {
    label: string
    type: NodeOrderType
  }
}

type WorkflowState = {
  nodes: WorkflowNode[]
  edges: Edge[]
  selectedNodeId: string | null
}

type Action =
  | { type: 'SET_NODES'; payload: WorkflowNode[] }
  | { type: 'SET_EDGES'; payload: Edge[] }
  | { type: 'ADD_NODE'; payload: WorkflowNode }
  | {
      type: 'UPDATE_NODE'
      payload: { id: string; updates: Partial<WorkflowNode['data']> }
    }
  | { type: 'ADD_EDGE'; payload: Edge }
  | { type: 'SET_SELECTED_NODE'; payload: string | null }

export interface WorkflowNode extends Node {
  data: {
    label: string
    type: NodeOrderType
  }
}

const initialNodes: WorkflowNode[] = [
  {
    id: '1',
    type: 'input',
    position: { x: 250, y: 0 },
    data: { label: 'Start Node', type: NodeOrderType.Start },
  },
  {
    id: '2',
    position: { x: 250, y: 150 },
    data: { label: 'Middle Node', type: NodeOrderType.Middle },
  },
  {
    id: '3',
    type: 'output',
    position: { x: 250, y: 300 },
    data: { label: 'End Node', type: NodeOrderType.End },
  },
]

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
]

const initialState: WorkflowState = {
  nodes: initialNodes,
  edges: initialEdges,
  selectedNodeId: null,
}

function reducer(state: WorkflowState, action: Action): WorkflowState {
  switch (action.type) {
    case 'SET_NODES':
      return { ...state, nodes: action.payload }
    case 'SET_EDGES':
      return { ...state, edges: action.payload }
    case 'ADD_NODE':
      return { ...state, nodes: [...state.nodes, action.payload] }
    case 'UPDATE_NODE':
      return {
        ...state,
        nodes: state.nodes.map((n) =>
          n.id === action.payload.id
            ? { ...n, data: { ...n.data, ...action.payload.updates } }
            : n,
        ),
      }
    case 'ADD_EDGE':
      return { ...state, edges: [...state.edges, action.payload] }
    case 'SET_SELECTED_NODE':
      return { ...state, selectedNodeId: action.payload }
    default:
      return state
  }
}

function getFlowNodeOrderType(order: NodeOrderType): NodeType | undefined {
  const nodeTypeMap: Record<NodeOrderType, NodeType | undefined> = {
    [NodeOrderType.Start]: NodeType.Input,
    [NodeOrderType.Middle]: undefined,
    [NodeOrderType.End]: NodeType.Output,
  }

  return nodeTypeMap[order]
}

// This hook is not exported and placed here to prevent improper usage outside of context
const useWorkflow = () => {
  const [state, dispatch] = useReducer(
    reducer,
    {
      nodes: [],
      edges: [],
      selectedNodeId: null,
    },
    () => initialState,
  )

  const setNodes = useCallback(
    (changes: NodeChange[]) => {
      dispatch({
        type: 'SET_NODES',
        payload: applyNodeChanges(changes, state.nodes) as WorkflowNode[],
      })
    },
    [state.nodes],
  )

  const setEdges = useCallback(
    (changes: EdgeChange[]) => {
      dispatch({
        type: 'SET_EDGES',
        payload: applyEdgeChanges(changes, state.edges),
      })
    },
    [state.edges],
  )

  const connectEdge = useCallback(
    (connection: Connection) => {
      const { source, target } = connection

      const sourceNode = state.nodes.find((n) => n.id === source)
      const targetNode = state.nodes.find((n) => n.id === target)

      if (!sourceNode || !targetNode) return

      const isValid = checkIfConnectionValid(sourceNode, targetNode, state.edges)

      if (!isValid) {
        console.warn('Invalid connection')
        return
      }

      const updatedEdges = addEdge({ ...connection, animated: true }, state.edges)
      dispatch({ type: 'SET_EDGES', payload: updatedEdges })
    },
    [state.nodes, state.edges],
  )

  const addNode = useCallback((type: NodeOrderType, label: string) => {
    const newNode: WorkflowNode = {
      id: uuidv4(),
      type: getFlowNodeOrderType(type),
      position: { x: 100, y: 100 },
      data: { label, type },
    }
    dispatch({ type: 'ADD_NODE', payload: newNode })
  }, [])

  const updateNode = useCallback((id: string, updates: Partial<WorkflowNode['data']>) => {
    dispatch({ type: 'UPDATE_NODE', payload: { id, updates } })
  }, [])

  const selectNode = useCallback((id: string | null) => {
    dispatch({ type: 'SET_SELECTED_NODE', payload: id })
  }, [])

  return {
    nodes: state.nodes,
    edges: state.edges,
    selectedNodeId: state.selectedNodeId,

    setNodes,
    setEdges,
    connectEdge,
    addNode,
    updateNode,
    selectNode,
  }
}

export const { ContextProvider: WorkflowProvider, useContext: useWorkflowContext } =
  buildContext(useWorkflow)
