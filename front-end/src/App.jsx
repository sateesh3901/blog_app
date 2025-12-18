import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppNavbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Posts from "./pages/Posts";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import MyPosts from "./pages/author/MyPosts";
import Dashboard from "./pages/admin/Dashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManagePosts from "./pages/admin/ManagePosts";

function App() {
  return (
    <BrowserRouter>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/posts" element={<Posts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/author/posts"
          element={
            <ProtectedRoute role="AUTHOR">
              <MyPosts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="ADMIN">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="ADMIN">
              <ManageUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/posts"
          element={
            <ProtectedRoute role="ADMIN">
              <ManagePosts />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
