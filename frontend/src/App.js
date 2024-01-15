import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Home';
import ProjectDetails from './ProjectDetails';
import OpenIssues from './openIssues'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>   
        <Route path="/projectDetails" element={<ProjectDetails />} />
        <Route path="/openIssues" element={<OpenIssues />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
