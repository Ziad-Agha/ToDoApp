import { Routes, Route } from 'react-router-dom'
import HomePage from './HomePage'
import TaskForm from './Components/TaskForm'

function App(){
  return (
    <Routes>
       <Route
        path="/"
        element={<HomePage />}
      /> 
      <Route
      path="/taskform"
      element={<TaskForm/>}
      />
    </Routes>
  )
}

export default App
