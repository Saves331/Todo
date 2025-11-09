
import { useEffect, useState } from 'react'
import './App.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";


function App() {
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState("all");
  const [dateSort, setDateSort] = useState("oldest");
  const [tasks, setTasks] = useState(
    () => {
      const saved = (localStorage.getItem("tasks"))
      return saved ? JSON.parse(saved) : []
    }
  );
  
  useEffect(() => {
    const saved = (localStorage.getItem("tasks"))
    if(saved) {
      setTasks(JSON.parse(saved))
    }
  }, []
)

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

    function handleSubmit(e) {
      e.preventDefault();

      if(title.trim() !== "" && description.trim() !== "") {
      setTasks([...tasks, {id: Date.now(), title, description, isCompleted: false, createdAt: new Date().toISOString(), isEditing: false}])

      setDescription("")
      setTitle("")
    }

    }

    function removeTask(id) {
       setTasks(tasks.filter(task => task.id !== id))
    
    }

    function removeAll() {
      setTasks([])
    }

    function toggleCheck(id, checked) {
      setTasks(tasks.map(task => task.id === id ? {...task, isCompleted: checked} : task))
    }

    function toggleIsEditing(id) {
      setTasks(tasks.map(task => task.id === id ? {...task, isEditing: !task.isEditing} : task))
    }

    function updateTitle(id, value) {
      setTasks(tasks.map(task => task.id === id ? {...task, title: value} : task))
    }

    function finishEdit(id) {
      setTasks(tasks.map(task => task.id === id ? {...task, isEditing: false} : task))
    }

  
    let sortedTasks = dateSort === "oldest" ? [...tasks].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) : dateSort === "newest" ? [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : tasks

    const filteredTasks = selected === "completed" ? sortedTasks.filter(t => t.isCompleted === true) 
                                                    : selected === "active" 
                                                    ? sortedTasks.filter(t => t.isCompleted === false) 
                                                    : sortedTasks 
  return (
    <>
     

     <h1>Create a Task:</h1>

     <form onSubmit={handleSubmit}>
          <div>
          <input className='border p-2' type="text" placeholder='Title' value={title} onChange={(e) => {setTitle(e.target.value)}} required/>
          <input className='border p-2' type="text" placeholder='task description' value={description} onChange={(e) => setDescription(e.target.value)} required/>
        </div>

      <div className='flex gap-3'>
        <button className='cursor-pointer border bg-green-500' type='submit'>Create</button>
        <button className='cursor-pointer border bg-amber-400' onClick={removeAll} type='button'>Remove All</button>
      </div>
        
        
        <div className='flex'>
          <select value={selected} onChange={(e) => setSelected(e.target.value)} className='border'>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select> 

        <select value={dateSort} onChange={(e) => setDateSort(e.target.value)} className='border'>
          <option value="oldest">Oldest</option>
          <option value="newest">Newest</option>
        </select>
        </div>

        
     </form>
     


    {filteredTasks.length === 0 ? <h2 className='text-2xl mt-5 p-5'>No Tasks here...</h2> : <ol>
      {filteredTasks.map((task, index) => (
      <li key={index} className="m-5 p-3 li relative">
        <button onClick={() => toggleIsEditing(task.id)} className='absolute right-4 cursor-pointer'>
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>
        <div className='w-[80%] m-auto'>
          {task.isEditing === true ? <input className='border p-2' type="text" placeholder='Title' value={task.title} onChange={(e) => {updateTitle(task.id, e.target.value)}} 
           onKeyDown={
            (e) => {
              if(e.key === "Enter") {
                finishEdit(task.id)
              }
           }} required/> 
           : <h1 className={task.isCompleted ? "line-through" : null}>{task.title}</h1>}      
                <h3 className='border inline-block'>Created: {new Date(task.createdAt).toLocaleDateString()}</h3>
                <h2>-{task.description}</h2>
        </div>

                   <div className='flex justify-center items-center'>
          <label className='border flex gap-2 items-center p-2'>
          <h2 className='text-xl'>Done!</h2>
          <input className='p-2 h-4 w-4' type="checkbox" checked={task.isCompleted} onChange={(e) => {toggleCheck(task.id, e.target.checked)}}/>
        </label>
        <button className='bg-red-500 m-3 text-white' onClick={() => removeTask(task.id)}>Delete</button>
        </div>
        
      </li>
     ))}

    </ol>}
    
         </>
  )
}

export default App

