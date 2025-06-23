import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Main from "./Components/Main";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import Social from "./Components/Social";
import FriendPage from "./Components/FriendPage";
import Ride from "./Components/Ride";
import PhotoPage from "./Components/PhotoPage";
import MyRideList from "./Components/MyRideList";
import MyRide from "./Components/MyRide";
import MyPhoto from "./Components/MyPhoto";
import MyPage from "./Components/MyPage";
import ChangeProfilePic from "./Components/ChangeProfilePic";
import ChangeId from './Components/ChangeId';
import ChangeNick from './Components/ChangeNick';
import MyTeam from "./Components/MyTeam";
import MemberPage from "./Components/MemberPage";
import TeamList from "./Components/TeamList";
import ApplyTeam from "./Components/ApplyTeam";
import MyApplications from "./Components/MyApplications";
import CreateTeam from "./Components/CreateTeam";
import ChangePassword from "./Components/ChangePassword";

import "./Styles/Desktop/App.css";
import "./Styles/Desktop/Navbar.css";
import "./Styles/Desktop/Main.css";
import "./Styles/Desktop/SignIn.css";
import "./Styles/Desktop/SignUp.css";
import "./Styles/Desktop/Social.css";
import "./Styles/Desktop/FriendPage.css";
import "./Styles/Desktop/Ride.css";
import "./Styles/Desktop/PhotoPage.css";
import "./Styles/Desktop/MyRideList.css";
import "./Styles/Desktop/MyRide.css";
import "./Styles/Desktop/MyPhoto.css";

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Router>
      <Navbar />
      <div className="page-container">
        <Routes>
          {isSignedIn ? (
            <>
              <Route path="/" element={<Main />} />
              <Route path="/social" element={<Social />} />
              <Route path="/friend/:friendId" element={<FriendPage />} />
              <Route path="/ride/:rideId" element={<Ride />} />
              <Route path="/photo/:photoId" element={<PhotoPage />} />
              <Route path="/myridelist" element={<MyRideList />} />
              <Route path="/myride/:rideId" element={<MyRide />} />
              <Route path="/myphoto/:photoId" element={<MyPhoto />} />
              <Route path="/mypage" element={<MyPage onSignIn={setIsSignedIn} />} />
              <Route path="/change-profile-image" element={<ChangeProfilePic />} />
              <Route path="/change-id" element={<ChangeId />} />
              <Route path="/change-nick" element={<ChangeNick />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/my-team" element={<MyTeam />} />
              <Route path="/member/:memberId" element={<MemberPage />} />
              <Route path="/team/list" element={<TeamList />} />
              <Route path="/apply-team/:teamId" element={<ApplyTeam />} />
              <Route path="/my-applications" element={<MyApplications />} />
              <Route path="/create-team" element={<CreateTeam />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/signin" element={<SignIn onSignIn={setIsSignedIn} />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="*" element={<Navigate to="/signin" />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}
