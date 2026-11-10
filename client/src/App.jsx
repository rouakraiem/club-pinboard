import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./features/posts/HomePage";
import PostDetailPage from "./features/posts/PostDetailPage";
import AuthPage from "./features/auth/AuthPage";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="wrap">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </main>
    </>
  );
}
