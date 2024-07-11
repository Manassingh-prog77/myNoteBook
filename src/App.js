import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NoteState from "./context/notes/notesstate";
import Alert from "./components/Alert";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { useState } from "react";


function App() {
  const [alert,setalert] = useState(null);
  const showalert = (message, type) =>{
    setalert({
      msg : message,
      type: type
  })
  setTimeout(() => {setalert(null)},1500);
}
  return (
    <>
      <NoteState>
        <Router>
          <Navbar showalert={showalert}/>
          <Alert alert={alert}/>
          <div className="container">
            <Routes>
              <Route exact path="/" element={<Home showalert={showalert}/>} />
              <Route exact path="/about" element={<About />} />
              <Route exact path="/login" element={<Login showalert={showalert} />} />
              <Route exact path="/signup" element={<SignUp showalert={showalert} />} />
            </Routes>
          </div>
        </Router>
      </NoteState>
    </>
  );
}

export default App;
