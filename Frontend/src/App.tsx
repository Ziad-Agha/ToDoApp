import { Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import LoginForm from "./Components/LoginForm";
import RegisterForm from "./Components/RegisterForm";
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterForm />}></Route>
      <Route path="/" element={<LoginForm />}></Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<HomePage />}>
          {/* <Route index element={<Navigate to="daily" />} />
          <Route path="daily" element={<DailyView />} />
          <Route path="weekly" element={<WeeklyView />} /> */}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
