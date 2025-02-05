import './index.css';
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Changed HashRouter to BrowserRouter
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import WelcomePage from './pages/WelcomePage';
import VerificationPage from './pages/VerificationPage'; 
import MainPage from './pages/MainPage';
import ProfilePage from './pages/Profile';


function App() {


  return (
    <Router> {/* Changed HashRouter to BrowserRouter */}
      <div>

        <Routes>
        <Route path="/" element={<Signin />} />  
        <Route path="/signup" element={<Signup />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/verification/*" element={<VerificationPage />} /> 
        <Route path="/main" element={<MainPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>


    </Router>
  );
}

export default App;


























