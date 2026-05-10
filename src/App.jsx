import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import OrdersPage from "./components/Orders";
import Collections from "./pages/collections"
import { CartCards } from "./components/CartCards";
import SignUp from "./pages/Signup"
import SearchPage from "./pages/SearchPage";
import ActivatePage from "./pages/ActivatePage";
export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/activate/:uid/:token"
        element={<ActivatePage/>}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/carts" element={<CartCards />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </>
  );
}
