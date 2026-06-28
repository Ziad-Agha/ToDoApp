import { Routes, Route } from 'react-router-dom'
import HomePage from './HomePage'
import WeeklyView from './WeeklyView'

import './App.css'

function App() {

  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage />}
      />
        <Route
            path="/weekly-view"
            element={<WeeklyView />}
        />
    </Routes>
  )
}

export default App
