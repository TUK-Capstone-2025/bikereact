import "./App.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Login from "./Components/Login";
import MainPage from "./Components/MainPage";
import Social from "./Components/Social";
import FriendPage from "./Components/FriendPage";
import RidePage from "./Components/RidePage";
import PhotoPage from "./Components/PhotoPage";
import MyRideList from "./Components/MyRideList";
import MyRide from "./Components/MyRide";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Navbar />
      <div className="page-container">
        <Routes>
          {/* If user is logged in, show these routes */}
          {isLoggedIn ? (
            <>
              <Route path="/" element={<MainPage />} />
              <Route path="/social" element={<Social />} />
              <Route path="/friend/:friendId" element={<FriendPage />} />
              <Route path="/ride/:rideId" element={<RidePage />} />
              <Route path="/photo/:photoId" element={<PhotoPage />} />
              <Route path="/myridelist" element={<MyRideList />} />
              <Route path="/myride/:rideId" element={<MyRide />} />
              {/* Catch-all route for invalid paths */}
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            // If user is not logged in, show login page
            <>
              <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
              {/* Redirect any other route to login page */}
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
