import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import MainPage from "./Components/MainPage";
import Social from "./Components/Social";
import FriendPage from "./Components/FriendPage";
import RidePage from "./Components/RidePage";
import PhotoPage from "./Components/PhotoPage";
import "leaflet/dist/leaflet.css"

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <div>
      {isLoggedIn ? (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage onLogout={() => setIsLoggedIn(false)} />} />
        <Route path="/social" element={<Social />} />
        <Route path="/friend/:friendId" element={<FriendPage />} />
        <Route path="/ride/:rideId" element={<RidePage />} />
        <Route path="/photo/:photoId" element={<PhotoPage />} />
      </Routes>
    </Router>
      ) : (
        <Login onLogin={() => setIsLoggedIn(true)} onSkip={() => setIsLoggedIn(true)} />
      )}
      </div>
  );
};

export default App;
