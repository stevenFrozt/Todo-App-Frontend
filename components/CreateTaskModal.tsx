import axios from "axios"
import { X } from "lucide-react"
import { useState } from "react"

interface data {
  _id: String
  text: String
  complete: Boolean
  timeStamp: String
}

export default function CreateTaskModal({
  modal,
  setModal,
  fetchData
}: {
  modal: boolean
  setModal: React.Dispatch<boolean>
  fetchData: () => void
}) {
  const baseUrl = "https://todoappbackend-hugi.onrender.com/todos"
  const [text, setText] = useState("")

  async function createTask(newText: string) {
    try {
      await axios.post(`${baseUrl}/new/`, { text: newText })
      console.log(`Task Created Successfully`)
      fetchData()
    } catch (error) {
      console.error("Error Creating Task:", error)
    }
  }

  return (
    <div
      onClick={() => setModal(false)}
      className={` ${
        modal ? "" : "hidden"
      } fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  backdrop-blur-sm w-screen h-screen`}
    >
      <div
        onClick={event => event.stopPropagation()} // Prevent the Click event from parent
        className="  p-4 shadow-xl rounded-lg fixed bg-[#171F2D] w-[95vw] lg:w-1/4 overflow-hidden max-w-2xl max-h-[70vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="flex justify-between items-center text-white">
          <h1>Create Task</h1>
          <button
            onClick={() => setModal(false)}
            className="lg:hover:-translate-y-1 transition-all duration-150"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {/* Content */}
        <div className="py-4">
          <textarea
            onChange={event => {
              setText(event.target.value)
            }}
            value={text}
            rows={3}
            placeholder="Write your Task here ..."
            className="w-full p-2 rounded-lg text-slate-800 shadow-inner focus:outline-none focus:border-blue-500 border-2"
          />
        </div>
        <div className="flex justify-end gap-4 text-white">
          <button
            onClick={() => setModal(false)}
            className="px-4 py-2 border lg:hover:border-gray-600 lg:hover:-translate-y-1 transition-all duration-150  rounded-lg "
          >
            Cancel
          </button>
          <button
            onClick={() => {
              createTask(text)
              setText("")
              setModal(false)
            }}
            className="px-4 py-2 shadow-lg lg:hover:shadow-none shadow-blue-800 lg:hover:bg-blue-800 bg-blue-700 rounded-lg lg:hover:-translate-y-1 transition-all duration-150"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}
