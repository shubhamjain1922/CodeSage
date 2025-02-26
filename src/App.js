import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Question from "./pages/Question";
import { ModalProvider } from "./context/ModalContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ModalProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/question/:id" element={<Question />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </ModalProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
