import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import UserManager from "./pages/UserManager";
import DeviceManager from "./pages/DeviceManager"
import MyDevice from "./pages/MyDevice"



// Placeholder components for other routes



// function UserManager() {
//   return <div className="p-6 text-[#4E4D4D] text-[24px]">User Manager Page</div>;
// }

function Support() {
  return <div className="p-6 text-[#4E4D4D] text-[24px]">Support Page</div>;
}

function ChangePassword() {
  return <div className="p-6 text-[#4E4D4D] text-[24px]">Change Password Page</div>;
}

function Logout() {
  const navigate = useNavigate();
  localStorage.removeItem("authToken"); // Example logout logic
  navigate("/home");
  return null;
}

function App() {
  return (
    <div className="flex flex-col lg:flex-row lg:bg-[#DADADA] min-h-screen">
      <Sidebar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/my-device" element={<MyDevice />} />
        <Route path="/device-manager" element={<DeviceManager />} />
        <Route path="/user-manager" element={<UserManager />} />
        <Route path="/support" element={<Support />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/" element={<Navigate to="/home" />} /> {/* Redirect root to /home */}
        <Route path="*" element={<MyDevice />} /> {/* Fallback route */}
      </Routes>
    </div>
  );
}

export default App;