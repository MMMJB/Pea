import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./Components/Header";

import Landing from "./Pages/Landing/Landing";

export default function App() {
  return (
    <div className="min-w-screen flex min-h-screen w-full flex-col bg-pea-light">
      <Header />
      <div className="flex-grow">
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}
