import React, { Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { routes } from "./routes";
import Loading from "./components/Common/Loading";
import AdminLayout from "./components/Layout/AdminLayout";
import Login from "./pages/Login";
import CreatePartner from "./pages/Partners/CreatePartner";
import EditPartner from "./pages/Partners/EditPartner";
import CreateNews from "./pages/News/CreateNews";
import EditNews from "./pages/News/EditNews";
import ViewMedia from "./pages/Gallery/ViewMedia";
import CreateUser from "./pages/Users/CreateUser";
import EditUser from "./pages/Users/EditUser";
import CreateProgram from "./pages/Programs/CreateProgram";
import EditProgram from "./pages/Programs/EditProgram";
import Programs from "./pages/Programs/Programs";

// Lazy load the components
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Projects = React.lazy(() => import("./pages/Projects/Projects"));
const CreateProject = React.lazy(() =>
  import("./pages/Projects/CreateProject")
);
const EditProject = React.lazy(() => import("./pages/Projects/EditProject"));
const Partners = React.lazy(() => import("./pages/Partners/Partners"));
const News = React.lazy(() => import("./pages/News/News"));
const NewsForm = React.lazy(() => import("./pages/News/NewsForm"));
const Gallery = React.lazy(() => import("./pages/Gallery/Gallery"));
const UploadMedia = React.lazy(() => import("./pages/Gallery/UploadMedia"));
const Users = React.lazy(() => import("./pages/Users/Users"));
const Settings = React.lazy(() => import("./pages/Settings"));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loading />;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loading />;

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

// Main App Component
function App() {
  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <div className="App">
            <Suspense fallback={<Loading />}>
              <Routes>
                {/* Public Routes */}
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />

                {/* Protected Routes - All inside AdminLayout */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />

                  {/* Projects */}
                  <Route path="projects" element={<Projects />} />
                  <Route path="projects/create" element={<CreateProject/>} />
                  <Route path="projects/edit/:id" element={<EditProject/>} />

                  {/* Programs */}
                  <Route path="programs" element={<Programs />} />
                  <Route path="programs/create" element={<CreateProgram />} />
                  <Route path="programs/:id/edit" element={<EditProgram />} />

                  {/* Partners */}
                  <Route path="partners" element={<Partners />} />
                  <Route path="partners/create" element={<CreatePartner/>} />
                  <Route path="partners/edit/:id" element={<EditPartner/>} />

                  {/* News */}
                  <Route path="news" element={<News />} />
                  <Route path="news/create" element={<CreateNews/>} />
                  <Route path="news/edit/:id" element={<EditNews/>} />

                  {/* Gallery */}
                  <Route path="gallery" element={<Gallery />} />
                  <Route path="gallery/upload" element={<UploadMedia/>} />
                  <Route path="gallery/view/:id" element={<ViewMedia/>} />

                  {/* Users */}
                  <Route path="users" element={<Users />} />
                  <Route path="users/create" element={<CreateUser/>} />
                  <Route path="users/edit/:id" element={<EditUser/>} />

                  {/* Settings */}
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* Catch all route */}
                <Route
                  path="*"
                  element={<Navigate to="/dashboard" replace />}
                />
              </Routes>
            </Suspense>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: { background: "#363636", color: "#fff" },
                success: {
                  duration: 3000,
                  theme: { primary: "#10B981", secondary: "#fff" },
                },
                error: {
                  duration: 4000,
                  theme: { primary: "#EF4444", secondary: "#fff" },
                },
              }}
            />
          </div>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;