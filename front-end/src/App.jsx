import { Routes, Route } from "react-router-dom";
import AppNavbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import PublicPosts from "./pages/PublicPosts";
import PostDetail from "./pages/PostDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import MyPosts from "./pages/author/MyPosts";
import CreatePost from "./pages/author/CreatePost";
import EditPost from "./pages/author/EditPost";
import Dashboard from "./pages/admin/Dashboard";
import ManagePosts from "./pages/admin/ManagePosts";
import ManageUsers from "./pages/admin/ManageUsers";

function App() {
  return (
    <>
      <AppNavbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<PublicPosts />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/author/posts"
          element={
            <ProtectedRoute role="AUTHOR">
              <MyPosts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/author/posts/create"
          element={
            <ProtectedRoute role="AUTHOR">
              <CreatePost />
            </ProtectedRoute>
          }
        />

        <Route
          path="/author/posts/edit/:id"
          element={
            <ProtectedRoute role="AUTHOR">
              <EditPost />
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
    </>
  );
}

export default App;
