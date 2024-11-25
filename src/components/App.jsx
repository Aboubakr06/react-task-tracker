// import React from 'react' (for class use) 
import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './Header'
import Tasks from './Tasks'
import AddTask from './AddTask'
import Footer from './Footer'
import About from './About'

function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
       const tasksFromServer = await fetchTasks()
       setTasks(tasksFromServer)     
    }

    getTasks()
  }, [])


// fetch Tasks
const fetchTasks = async () => {
  const res /* response*/  = await fetch('http://localhost:5000/tasks')
  const data = await res.json()

  return data
}

// fetch Task
const fetchTask = async (id) => {
  const res /* response*/  = await fetch(`http://localhost:5000/tasks/${id}`)
  const data = await res.json()

  return data
}

// Add Task 
const addTask = async (task) => {
  const res = await fetch('http://localhost:5000/tasks' ,{
   method: 'POST',
    headers: {
      'Content-type':'application/json',
    },
    body: JSON.stringify(task)
  })

  const data = await res.json()

  setTasks([...tasks, data])
  const id = Math.floor(Math.random() * 1000 + 1)

  const newTask = { id, ...task }
  setTasks([...tasks, newTask])
  
} 

// Delete task
const deletTask = async (id) => {
  await fetch(`http://localhost:5000/tasks/${id}`, {
    method: 'DELETE',  
  })

  setTasks(tasks.filter((task) => task.id !== id))
}

// Toggle Reminder
const toggleReminder = async (id) => {
  const taskToToggle = await fetchTask(id)
  const updTask = {...taskToToggle,
  reminder: !taskToToggle.reminder }

  const res = await fetch(`http://localhost:5000/tasks/${id}` , {
    method: 'PUT',
    headers: {
      'Content-type':'application/json',
    },
    body: JSON.stringify(updTask)
  })

  const data = await res.json()

  setTasks(
    tasks.map((task) => 
     task.id === id ? {...task, reminder: 
      data.reminder } : task
  )
  )
}

  return (
    <BrowserRouter>
       <div className='container'>
       <Header 
      onAdd={() => setShowAddTask
      (!showAddTask)} 
      showAdd={showAddTask}
      />  
    
       <Routes>
         <Route
            path="/"
            element={
              <>
              {showAddTask && <AddTask onAdd={addTask} />}
              {tasks.length > 0 ? (
              <Tasks tasks={tasks} onDelete=
              {deletTask} onToggle={toggleReminder}/>
              ) : (
                'No Tasks To Show'
              )}
              </>
            }
          />
          <Route path="/about" element={<About />} />      
       </Routes>  
       <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App