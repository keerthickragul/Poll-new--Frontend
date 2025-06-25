import React, { useEffect } from 'react';
import './App.css';
import Home from './Home';
import Login from './Pages/User/Login';
import Signup from './Pages/User/Signup';
import Createpoll from './CreatepollHome';
import PollDetail from './Components/PollDetail';
import PollAnswer from './Components/PollAnswer';
import AnalyticsPage from './Pages/Analytics/AnalyticsPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  
 return (
    <>
     <BrowserRouter>
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Createpoll />} />
            <Route path="/newpoll/:id" element={<PollDetail />} />
            <Route path="/poll/:id" element={<PollAnswer />} />
            {/* <Route path="/analytics" element={<AnalyticsPage/>} />
             */}
            <Route path='/analytics' element = {<AnalyticsPage />} />
          </Routes>
        </BrowserRouter> 
    </>
  );
}

export default App;
