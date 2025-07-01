// react
import { Route, Routes } from "react-router-dom";

// pages
import Home from "../pages/user/home-page/Home";
import Explore from "../pages/user/explore-page/Explore";
import Profile from "../pages/user/profile-page/Profile";
import AddItem from "../pages/user/add-page/AddItem";
import Match from "../pages/user/match-page/Match";
import ItemDetail from "../pages/user/item-detail-page/ItemDetail";
import Login from "../pages/user/auth-page/Login";
import Registration from "../pages/user/auth-page/Registration";
import Notification from "../pages/user/notif-page/Notification";
import Message from "../pages/user/message-page/Message";
import MessageDetail from "../pages/user/message-page/MessageDetail";
import ForgotPassword from "../pages/user/auth-page/ForgotPassword";
import Terms from "../pages/user/terms-page/Terms";

import Test from "../components/ui/Test";
// test
import Onboarding from "../pages/user/auth-page/Onboarding";

export default function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Onboarding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/home" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/add-item" element={<AddItem />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/match" element={<Match />} />
      <Route path="/item-detail" element={<ItemDetail />} />
      <Route path="/notification" element={<Notification />} />
      <Route path="/messages" element={<Message />} />
      {/* <Route path="/message-detail" element={<MessageDetail />} /> */}
      <Route path="/message-detail/:matchId" element={<MessageDetail />} />
      <Route path="/terms" element={<Terms />} />

      {/* test */}
      <Route path="/test" element={<Test />} />
    </Routes>
  );
}
