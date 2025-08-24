// "use client"

// import React, { useCallback, useRef } from "react"
// import ReactFlow, {
//     Node,
//     Edge,
//     addEdge,
//     Background,
//     Controls,
//     MiniMap,
//     Connection,
//     useNodesState,
//     useEdgesState,
//     NodeMouseHandler,
//     Handle,
//     Position,
// } from "reactflow"
// import "reactflow/dist/style.css"
// import { Database, Brain, Plus, Edit, Trash2 } from "lucide-react"
// import {
//     ContextMenu,
//     ContextMenuContent,
//     ContextMenuItem,
//     ContextMenuTrigger,
// } from "@/components/ui/context-menu"
// import { Card, CardContent } from "@/components/ui/card"

// interface NodeData {
//     label: string
//     description: string
//     expanded?: boolean
//     [key: string]: any
// }

// const nodeTypes = {
//     orchestrationInput: OrchestrationInputNode,
//     claudeProcessor: ClaudeProcessorNode,
// }

// const initialNodes: Node[] = [
//     {
//         id: "1",
//         type: "orchestrationInput",
//         position: { x: 100, y: 100 },
//         data: {
//             label: "Database",
//             description: "Orchestration collection",
//             platforms: ["main", "linkedin", "x", "meta"],
//             collection: "Orchestration",
//             type: "content",
//             expanded: false,
//         },
//     },
//     {
//         id: "2",
//         type: "claudeProcessor",
//         position: { x: 400, y: 100 },
//         data: {
//             label: "Claude AI",
//             description: "Content generation",
//             model: "claude-sonnet-4-20250514",
//             systemPrompt:
//                 "You are a helpful AI assistant for generating social media content.",
//             userPrompt:
//                 "Generate engaging content for business ideas platform.",
//             status: "ready",
//             expanded: false,
//         },
//     },
// ]

// const initialEdges: Edge[] = [
//     {
//         id: "e1-2",
//         source: "1",
//         target: "2",
//         animated: true,
//         style: { stroke: "#8b5cf6", strokeWidth: 2 },
//     },
// ]

// function OrchestrationInputNode({
//     data,
//     selected,
// }: {
//     data: NodeData
//     selected?: boolean
// }) {
//     return (
//         <ContextMenu>
//             <ContextMenuTrigger>
//                 <div
//                     className={`relative ${data.expanded ? "w-[200px]" : "w-20 h-20"} transition-all duration-300`}
//                 >
//                     {/* Circular base design */}
//                     <div
//                         className={`${data.expanded ? "rounded-lg" : "rounded-full"} ${
//                             selected ? "ring-2 ring-purple-400" : ""
//                         } bg-white shadow-lg border-2 border-purple-400 flex items-center justify-center transition-all duration-300 ${
//                             data.expanded ? "h-auto p-4" : "w-20 h-20"
//                         }`}
//                     >
//                         {!data.expanded ? (
//                             <Database className='w-8 h-8 text-purple-600' />
//                         ) : (
//                             <Card className='w-full border-0 shadow-none'>
//                                 <CardContent className='p-4'>
//                                     <div className='flex items-center gap-2 mb-3'>
//                                         <Database className='w-5 h-5 text-purple-600' />
//                                         <h3 className='font-semibold text-gray-800'>
//                                             {data.label}
//                                         </h3>
//                                     </div>

//                                     <div className='space-y-2 text-sm'>
//                                         <div>
//                                             <span className='font-medium'>
//                                                 Collection:
//                                             </span>{" "}
//                                             {data.collection}
//                                         </div>
//                                         <div>
//                                             <span className='font-medium'>
//                                                 Type:
//                                             </span>{" "}
//                                             {data.type}
//                                         </div>
//                                         <div>
//                                             <span className='font-medium'>
//                                                 Platforms:
//                                             </span>
//                                             <div className='flex flex-wrap gap-1 mt-1'>
//                                                 {data.platforms?.map(
//                                                     (platform: string) => (
//                                                         <span
//                                                             key={platform}
//                                                             className='px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs'
//                                                         >
//                                                             {platform}
//                                                         </span>
//                                                     )
//                                                 )}
//                                             </div>
//                                         </div>
//                                         <div className='text-gray-500'>
//                                             {data.description}
//                                         </div>
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         )}
//                     </div>

//                     {/* Connection handles */}
//                     <Handle
//                         type='source'
//                         position={Position.Right}
//                         className='w-3 h-3 bg-purple-400'
//                     />
//                     <Handle
//                         type='target'
//                         position={Position.Left}
//                         className='w-3 h-3 bg-purple-400'
//                     />
//                 </div>
//             </ContextMenuTrigger>
//             <ContextMenuContent>
//                 <ContextMenuItem>
//                     <Edit className='w-4 h-4 mr-2' />
//                     Edit Node
//                 </ContextMenuItem>
//                 <ContextMenuItem className='text-red-600'>
//                     <Trash2 className='w-4 h-4 mr-2' />
//                     Delete Node
//                 </ContextMenuItem>
//             </ContextMenuContent>
//         </ContextMenu>
//     )
// }

// function ClaudeProcessorNode({
//     data,
//     selected,
// }: {
//     data: NodeData
//     selected?: boolean
// }) {
//     return (
//         <ContextMenu>
//             <ContextMenuTrigger>
//                 <div
//                     className={`relative ${data.expanded ? "w-80" : "w-20 h-20"} transition-all duration-300`}
//                 >
//                     {/* Circular base design */}
//                     <div
//                         className={`${data.expanded ? "rounded-lg" : "rounded-full"} ${
//                             selected ? "ring-2 ring-blue-400" : ""
//                         } bg-white shadow-lg border-2 border-blue-400 flex items-center justify-center transition-all duration-300 ${
//                             data.expanded ? "h-auto p-4" : "w-20 h-20"
//                         }`}
//                     >
//                         {!data.expanded ? (
//                             <Brain className='w-8 h-8 text-blue-600' />
//                         ) : (
//                             <Card className='w-full border-0 shadow-none'>
//                                 <CardContent className='p-4'>
//                                     <div className='flex items-center gap-2 mb-3'>
//                                         <Brain className='w-5 h-5 text-blue-600' />
//                                         <h3 className='font-semibold text-gray-800'>
//                                             {data.label}
//                                         </h3>
//                                         <span
//                                             className={`ml-auto px-2 py-1 rounded text-xs ${
//                                                 data.status === "ready"
//                                                     ? "bg-green-100 text-green-700"
//                                                     : data.status ===
//                                                         "processing"
//                                                       ? "bg-yellow-100 text-yellow-700"
//                                                       : "bg-gray-100 text-gray-700"
//                                             }`}
//                                         >
//                                             {data.status}
//                                         </span>
//                                     </div>

//                                     <div className='space-y-2 text-sm'>
//                                         <div>
//                                             <span className='font-medium'>
//                                                 Model:
//                                             </span>{" "}
//                                             {data.model}
//                                         </div>
//                                         <div>
//                                             <span className='font-medium'>
//                                                 System Prompt:
//                                             </span>
//                                             <div className='mt-1 p-2 bg-gray-50 rounded text-xs max-h-16 overflow-y-auto'>
//                                                 {data.systemPrompt ||
//                                                     "Not configured"}
//                                             </div>
//                                         </div>
//                                         <div>
//                                             <span className='font-medium'>
//                                                 User Prompt:
//                                             </span>
//                                             <div className='mt-1 p-2 bg-gray-50 rounded text-xs max-h-16 overflow-y-auto'>
//                                                 {data.userPrompt ||
//                                                     "Not configured"}
//                                             </div>
//                                         </div>
//                                         <div className='text-gray-500'>
//                                             {data.description}
//                                         </div>
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         )}
//                     </div>

//                     {/* Connection handles */}
//                     <Handle
//                         type='source'
//                         position={Position.Right}
//                         className='w-3 h-3 bg-blue-400'
//                     />
//                     <Handle
//                         type='target'
//                         position={Position.Left}
//                         className='w-3 h-3 bg-blue-400'
//                     />
//                 </div>
//             </ContextMenuTrigger>
//             <ContextMenuContent>
//                 <ContextMenuItem>
//                     <Edit className='w-4 h-4 mr-2' />
//                     Edit Node
//                 </ContextMenuItem>
//                 <ContextMenuItem className='text-red-600'>
//                     <Trash2 className='w-4 h-4 mr-2' />
//                     Delete Node
//                 </ContextMenuItem>
//             </ContextMenuContent>
//         </ContextMenu>
//     )
// }

// export default function InfiniteCanvas() {
//     const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
//     const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
//     const reactFlowWrapper = useRef<HTMLDivElement>(null)

//     const onConnect = useCallback(
//         (params: Connection) => setEdges((eds) => addEdge(params, eds)),
//         [setEdges]
//     )

//     const onNodeClick: NodeMouseHandler = useCallback(
//         (event, node) => {
//             event.preventDefault()
//             setNodes((nds) =>
//                 nds.map((n) =>
//                     n.id === node.id
//                         ? {
//                               ...n,
//                               data: { ...n.data, expanded: !n.data.expanded },
//                           }
//                         : { ...n, data: { ...n.data, expanded: false } }
//                 )
//             )
//         },
//         [setNodes]
//     )

//     const addNode = useCallback(
//         (type: string, position: { x: number; y: number }) => {
//             const newNode: Node = {
//                 id: `${nodes.length + 1}`,
//                 type,
//                 position,
//                 data: {
//                     label:
//                         type === "orchestrationInput"
//                             ? "Database"
//                             : "Claude AI",
//                     description:
//                         type === "orchestrationInput"
//                             ? "New data source"
//                             : "New AI processor",
//                     expanded: false,
//                     ...(type === "orchestrationInput"
//                         ? {
//                               platforms: ["main"],
//                               collection: "New Collection",
//                               type: "content",
//                           }
//                         : {
//                               model: "claude-sonnet-4-20250514",
//                               systemPrompt: "",
//                               userPrompt: "",
//                               status: "ready",
//                           }),
//                 },
//             }
//             setNodes((nds) => [...nds, newNode])
//         },
//         [nodes.length, setNodes]
//     )

//     return (
//         <div className='w-full h-96 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50'>
//             <ContextMenu>
//                 <ContextMenuTrigger asChild>
//                     <div ref={reactFlowWrapper} className='w-full h-full'>
//                         <ReactFlow
//                             nodes={nodes}
//                             edges={edges}
//                             onNodesChange={onNodesChange}
//                             onEdgesChange={onEdgesChange}
//                             onConnect={onConnect}
//                             onNodeClick={onNodeClick}
//                             nodeTypes={nodeTypes}
//                             fitView
//                             className='bg-gray-800'
//                             connectOnClick={false}
//                             proOptions={{ hideAttribution: true }}
//                         >
//                             <Background color='#000' gap={16} />
//                             <Controls />
//                             <MiniMap
//                                 className='!bg-gray-800'
//                                 maskColor='rgb(240, 240, 240, 0.6)'
//                             />
//                         </ReactFlow>
//                     </div>
//                 </ContextMenuTrigger>
//                 <ContextMenuContent>
//                     <ContextMenuItem
//                         onClick={() =>
//                             addNode("orchestrationInput", { x: 200, y: 200 })
//                         }
//                     >
//                         <Plus className='w-4 h-4 mr-2' />
//                         Add Database Node
//                     </ContextMenuItem>
//                     <ContextMenuItem
//                         onClick={() =>
//                             addNode("claudeProcessor", { x: 300, y: 200 })
//                         }
//                     >
//                         <Plus className='w-4 h-4 mr-2' />
//                         Add Claude Node
//                     </ContextMenuItem>
//                 </ContextMenuContent>
//             </ContextMenu>
//         </div>
//     )
// }
