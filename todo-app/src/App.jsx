import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import ToDoList from "./components/ToDoList.jsx";

function App() {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/todolist" element={<ToDoList />}  />
      </Routes>
    </Router>
  )
}

export default App;