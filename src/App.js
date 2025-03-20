import "./App.css";
import React, { useEffect, useRef, useState } from "react";
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
import MyPhoto from "./Components/MyPhoto";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [data, setData] = useState([]);
  const dataId = useRef(0);  

  const getData = async () => {
    const res = await fetch(
      "https://3cf0-210-99-254-13.ngrok-free.app"
    ).then((res) => res.json());

    const initData = res.slice(0, 20).map((it) => {
      return {
        author: it.email,
        content: it.body,
        emotion: Math.floor(Math.random() * 5) + 1,
        created_date: new Date().getTime(),
        id: dataId.current++,
      };
    });
    setData(initData);
  };

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
              <Route path="/myphoto/:photoId" element={<MyPhoto />} />
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
