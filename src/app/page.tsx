'use client'

import '@ant-design/v5-patch-for-react-19'
import dynamic from 'next/dynamic'

const WorkflowDiagram = dynamic(
  () => import('@/components/WorkflowDiagram').then((mod) => mod.WorkflowDiagram),
  { ssr: false },
)

export default function Home() {
  return <WorkflowDiagram />
}
