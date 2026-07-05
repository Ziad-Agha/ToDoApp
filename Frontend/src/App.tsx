import { Routes, Route } from 'react-router-dom'
import HomePage from './HomePage'

import './App.css'
import TaskMenu from './Components/TaskMenu'

function App(){
  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage />}
      />
      <Route
      path="/menu"
      element={<TaskMenu/>}
      />
    </Routes>
  )
}

export default App
