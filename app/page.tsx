"use client"
import { useEffect, useState } from "react"
import { Plus, Trash, RefreshCcw, Pencil, Settings } from "lucide-react"
import axios from "axios"
import CreateTaskModal from "@/components/CreateTaskModal"
import { Skeleton } from "@/components/ui/skeleton"
import EditTaskModal from "@/components/EditTaskModal"
export default function Page() {
  interface data {
    _id: String
    text: String
    complete: Boolean
    timeStamp: String
  }

  const baseUrl = "https://todoappbackend-hugi.onrender.com/todos"
  const [data, setData] = useState<data[]>([])
  const [modal, setModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [editSelected, setEditSelected] = useState<{
    id: string | number
    text: string
  }>({ id: "", text: "" })
  const [loading, setLoading] = useState(true)

  async function fetchData() {
    if (!loading) {
      setLoading(true)
      console.log("📡Connecting to server...")
    }
    try {
      const response = await axios.get(`${baseUrl}`)
      const result = await response.data

      setData(result)
      setLoading(false)

      console.clear()
      console.log("🔥 Connected Successfully")
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  async function deleteTask(
    id: string | number,
    setLoadingState: React.Dispatch<boolean>
  ) {
    setLoadingState(true)
    try {
      await axios.delete(`${baseUrl}/delete/${id}`)
      console.log("Task deleted Successfully")
      setData(prev => {
        return prev.filter(task => task._id !== id)
      })
      setLoadingState(false)
    } catch (error) {
      console.error("Error Deleting Task:", error)
    }
  }

  async function completeTask(
    id: string | number,
    setLoadingState: React.Dispatch<boolean>
  ) {
    setLoadingState(true)
    try {
      await axios.put(`${baseUrl}/complete/${id}`)
      console.log(`Task Updated Successfully ${id}`)
      setData(prev => {
        return prev.map(item => {
          if (item._id === id) {
            return { ...item, complete: !item.complete }
          } else {
            return { ...item }
          }
        })
      })
      setLoadingState(false)
    } catch (error) {
      console.error("Error Updating Task:", error)
    }
  }

  async function saveEditTask(id: string | number, text: string) {
    try {
      await axios.put(`${baseUrl}/edit/${id}`, { text: text })
      console.log(`Task Edited Successfully ${id}, \n ${text} `)
      setEditModal(false)
    } catch (error) {
      console.error("Error Updating Task:", error)
    }

    setData(prev => {
      return prev.map(item => {
        if (item._id === id) {
          return { ...item, text: text }
        } else {
          return { ...item }
        }
      })
    })
  }

  function editHandler(id: string | number, text: string) {
    setEditSelected({ id: id.toString(), text: text })
    setEditModal(true)
  }

  return (
    <div
      className=" min-h-screen p-4
    bg-gradient-to-b from-[#1F2B3E] via-[#202B3E] to-[#171F2D]"
    >
      <main className="max-w-2xl mx-auto md:pt-10   min-h-[90vh] ">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-medium text-white flex">Todo App </h1>
          {/* Create Task Button */}
          <button
            onClick={() => setModal(true)}
            className="text-white rounded-lg flex items-center justify-center gap-2 px-2 py-2 transition-colors duration-150 lg:hover:text-blue-500 "
          >
            <span className="hidden md:inline-block">Create Task</span>
            <Plus className="w-8 h-8" />
          </button>
        </div>

        <div className="pt-10">
          <div className="flex items-center justify-between pb-4">
            <p className="text-sm text-gray-400  ">YOUR TASKS</p>
            <button
              className="mr-4 lg:hover:-translate-y-1 transition-transform duration-150"
              onClick={() => {
                setLoading(true)
                fetchData()
              }}
            >
              <RefreshCcw className="h-5 w-5 text-white" />
            </button>
          </div>
          <div className="max-h-[66vh] overflow-y-auto flex flex-col gap-4  track-hidden">
            {loading ? (
              <LoadingSkeleton />
            ) : (
              data?.map(task => (
                <Task
                  key={task._id.toString()}
                  id={task._id.toString()}
                  complete={Boolean(task.complete)}
                  completeTask={completeTask}
                  deleteTask={deleteTask}
                  text={task.text.toString()}
                  editHandler={editHandler}
                >
                  {task.text}
                </Task>
              ))
            )}
          </div>
          <div className="max-h-[90vh] overflow-y-auto flex flex-col gap-4 pt-4 "></div>

          {data.length === 0 && !loading ? (
            <button
              onClick={() => setModal(true)}
              className="w-full lg:w-1/2 mx-auto flex justify-center bg-slate-700 lg:hover:bg-gray-800/90 transition-all duration-150 rounded-lg p-2 gap-2"
            >
              New Task <Plus />
            </button>
          ) : loading ? (
            ""
          ) : (
            ""
          )}
        </div>
      </main>
      <div className="mt-4 max-w-2xl mx-auto text-center text-slate-700 ">
        <span className="text-xs">Created By</span> Steven Kyle
      </div>

      {/* MODAL */}
      <CreateTaskModal
        modal={modal}
        setModal={setModal}
        fetchData={fetchData}
      />
      <EditTaskModal
        modal={editModal}
        setModal={setEditModal}
        saveEditTask={saveEditTask}
        editSelected={editSelected}
        setEditSelected={setEditSelected}
      />
    </div>
  )
}

function Task({
  children,
  id,
  complete,
  completeTask,
  deleteTask,
  editHandler,
  text
}: {
  children?: React.ReactNode
  id: string | number
  complete: boolean
  text: string
  completeTask: (
    id: string | number,
    setLoadingState: React.Dispatch<boolean>
  ) => {}
  deleteTask: (
    id: string | number,
    setLoadingState: React.Dispatch<boolean>
  ) => {}
  editHandler: (id: string | number, text: string) => void
}) {
  const [loadingState, setLoadingState] = useState(false)

  return (
    <div
      className={`bg-[#131A27] p-2 px-4 rounded-lg flex items-center lg:hover:cursor-pointer ${
        loadingState
          ? "animate-pulse bg-slate-700 text-muted lg:hover:cursor-default"
          : ""
      }`}
      onClick={() => {
        completeTask(id.toString(), setLoadingState)
        setLoadingState(true)
      }}
    >
      <button
        className={`min-w-[1.25rem] min-h-[1.25rem] rounded-full ${
          complete ? "bg-green-500" : "bg-gray-800 shadow-none"
        } lg:hover:border lg:hover:-translate-y-1 transition-transform duration-150 shadow-md lg:hover:shadow-none shadow-green-800 ${
          loadingState ? "bg-slate-600 lg:hover:translate-y-0 " : ""
        }
        }`}
      ></button>
      <h3
        className={`ml-4 w-full  ${
          loadingState
            ? "text-slate-800"
            : complete
            ? "line-through text-slate-500"
            : "text-white"
        }`}
      >
        {children || "Task"}
      </h3>
      <div className="flex items-center gap-2">
        {/* EDIT BUTTON */}
        <button
          onClick={event => {
            event.stopPropagation()
            editHandler(id, text)
          }}
          className="min-w-[24px] min-h-[24px] ml-auto rounded-lg lg:hover:disabled:translate-y-0 disabled:text-slate-500 text-gray-600 relative lg:hover:-translate-y-1 transition-transform duration-150 "
          disabled={loadingState}
        >
          <Pencil className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5" />
        </button>
        {/* DELETE BUTTON */}
        <button
          onClick={event => {
            event.stopPropagation()
            deleteTask(id.toString(), setLoadingState)
          }}
          className="min-w-[24px] lg:hover:disabled:translate-y-0 min-h-[24px] ml-auto rounded-lg disabled:text-slate-500 text-red-500 relative lg:hover:-translate-y-1 transition-transform duration-150 "
          disabled={loadingState}
        >
          <Trash className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <>
      <Skeleton className="w-full min-h-[2.5rem] p-2 px-4 rounded-lg bg-[#131A27]" />
      <Skeleton className="w-full min-h-[2.5rem] p-2 px-4 rounded-lg bg-[#131A27]" />
      <Skeleton className="w-full min-h-[2.5rem] p-2 px-4 rounded-lg bg-[#131A27]" />
      <Skeleton className="w-full min-h-[2.5rem] p-2 px-4 rounded-lg bg-[#131A27]" />
      <Skeleton className="w-full min-h-[2.5rem] p-2 px-4 rounded-lg bg-[#131A27]" />
      <Skeleton className="w-full min-h-[2.5rem] p-2 px-4 rounded-lg bg-[#131A27]" />
      <Skeleton className="w-full min-h-[2.5rem] p-2 px-4 rounded-lg bg-[#131A27]" />
    </>
  )
}
