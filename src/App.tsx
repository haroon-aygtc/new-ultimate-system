import { Suspense, lazy, useEffect } from "react";
import {
  useRoutes,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import routes from "tempo-routes";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";

// Lazy load components for better performance
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AccountSettings = lazy(() => import("./pages/AccountSettings"));
const GuestSessionManagement = lazy(
  () => import("./pages/admin/GuestSessionManagement"),
);

// Loading component for suspense fallback
const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen w-screen bg-brand-light">
    <div className="flex flex-col items-center">
      <div className="h-8 w-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-brand-secondary font-medium">Loading...</p>
    </div>
  </div>
);

// Protected route component with enhanced role-based access control
const ProtectedRoute = ({
  element,
  requiredRole = "user",
  guestAllowed = false,
}: {
  element: React.ReactNode;
  requiredRole?: "guest" | "user" | "admin";
  guestAllowed?: boolean;
}) => {
  const { authUser, isLoading, hasPermission } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If not loading and either no user or insufficient permissions
    if (!isLoading && (!authUser || !hasPermission(requiredRole))) {
      // Store the attempted URL for redirect after login
      const returnUrl = encodeURIComponent(location.pathname + location.search);
      navigate(`/login?returnUrl=${returnUrl}`, { replace: true });
    }
  }, [authUser, isLoading, hasPermission, requiredRole, navigate, location]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Allow guest access if specified and user has at least guest role
  if (guestAllowed && authUser?.role === "guest") {
    return <>{element}</>;
  }

  // Check permissions for non-guest routes
  if (!authUser || !hasPermission(requiredRole)) {
    return null; // Return null as the useEffect will handle the redirect
  }

  return <>{element}</>;
};

// Public route that redirects authenticated users based on their role
const PublicRoute = ({ element }: { element: React.ReactNode }) => {
  const { authUser, isLoading } = useAuth();
  const location = useLocation();

  // Get the return URL from query params if it exists
  const searchParams = new URLSearchParams(location.search);
  const returnUrl = searchParams.get("returnUrl");

  if (isLoading) {
    return <LoadingScreen />;
  }

  // If user is authenticated, redirect based on role
  if (authUser) {
    if (returnUrl) {
      return <Navigate to={decodeURIComponent(returnUrl)} replace />;
    }

    if (authUser.role === "admin") {
      return <Navigate to="/admin/guest-session-management" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{element}</>;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<PublicRoute element={<Login />} />} />
      <Route
        path="/register"
        element={<PublicRoute element={<Register />} />}
      />
      <Route
        path="/forgot-password"
        element={<PublicRoute element={<ForgotPassword />} />}
      />
      <Route
        path="/reset-password"
        element={<PublicRoute element={<ResetPassword />} />}
      />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute
            element={<Home />}
            requiredRole="user"
            guestAllowed={true}
          />
        }
      />
      <Route
        path="/account-settings"
        element={
          <ProtectedRoute element={<AccountSettings />} requiredRole="user" />
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin/guest-session-management/*"
        element={
          <ProtectedRoute
            element={<GuestSessionManagement />}
            requiredRole="admin"
          />
        }
      />

      {/* Tempo routes */}
      {import.meta.env.VITE_TEMPO === "true" && <Route path="/tempobook/*" />}

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingScreen />}>
        <>
          <AppRoutes />
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
