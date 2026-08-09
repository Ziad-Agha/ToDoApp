import { Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import LoginForm from "./Components/LoginForm";
import RegisterForm from "./Components/RegisterForm";
import WeeklyView from "./Components/WeeklyView";


function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />}></Route>
      <Route path="/register" element={<RegisterForm />}></Route>
      <Route path="/home" element={<HomePage />} />
      <Route path="/weekly-view" element={<WeeklyView />} />
    </Routes>
  );
}

export default App;
