import { Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import TaskForm from "./Components/TaskForm";
import LoginForm from "./Components/LoginForm";
import RegisterForm from "./Components/RegisterForm";


function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />}></Route>
      <Route path="/register" element={<RegisterForm />}></Route>
      <Route path="/home" element={<HomePage />} />
      <Route path="/taskform" element={<TaskForm />} />
    </Routes>
  );
}

export default App;
