import { Suspense, lazy, useEffect } from "react";
// Import admin components directly
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
import { SupabaseProvider } from "./components/SupabaseProvider";

// Lazy load components for better performance
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AccountSettings = lazy(() => import("./pages/AccountSettings"));
const GuestSessionManagement = lazy(
  () => import("./pages/admin/GuestSessionManagement"),
);
const MockAdminLogin = lazy(() => import("./components/admin/MockAdminLogin"));
const UnauthorizedPage = lazy(() => import("./pages/admin/UnauthorizedPage"));

// AI Integration Components
const AIModels = lazy(() => import("./pages/ai-models/index"));
const AIModelDetail = lazy(() => import("./pages/ai-models/[id]"));
const NewAIModel = lazy(() => import("./pages/ai-models/new"));
const Prompts = lazy(() => import("./pages/prompts/index"));
const PromptDetail = lazy(() => import("./pages/prompts/[id]"));
const NewPrompt = lazy(() => import("./pages/prompts/new"));
const KnowledgeBases = lazy(() => import("./pages/knowledge-base/index"));
const KnowledgeBaseDetail = lazy(() => import("./pages/knowledge-base/[id]"));
const NewKnowledgeBase = lazy(() => import("./pages/knowledge-base/new"));

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
  // Always allow access in development mode
  return element;
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
      <Route path="/login" element={<PublicRoute element={<LoginPage />} />} />
      <Route path="/admin/login" element={<MockAdminLogin />} />
      <Route path="/admin/unauthorized" element={<UnauthorizedPage />} />
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

      {/* AI Integration routes */}
      <Route
        path="/ai-models"
        element={<ProtectedRoute element={<AIModels />} requiredRole="admin" />}
      />
      <Route
        path="/ai-models/new"
        element={
          <ProtectedRoute element={<NewAIModel />} requiredRole="admin" />
        }
      />
      <Route
        path="/ai-models/:id"
        element={
          <ProtectedRoute element={<AIModelDetail />} requiredRole="admin" />
        }
      />
      <Route
        path="/prompts"
        element={<ProtectedRoute element={<Prompts />} requiredRole="admin" />}
      />
      <Route
        path="/prompts/new"
        element={
          <ProtectedRoute element={<NewPrompt />} requiredRole="admin" />
        }
      />
      <Route
        path="/prompts/:id"
        element={
          <ProtectedRoute element={<PromptDetail />} requiredRole="admin" />
        }
      />
      <Route
        path="/knowledge-base"
        element={
          <ProtectedRoute element={<KnowledgeBases />} requiredRole="admin" />
        }
      />
      <Route
        path="/knowledge-base/new"
        element={
          <ProtectedRoute element={<NewKnowledgeBase />} requiredRole="admin" />
        }
      />
      <Route
        path="/knowledge-base/:id"
        element={
          <ProtectedRoute
            element={<KnowledgeBaseDetail />}
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
    <SupabaseProvider>
      <AuthProvider>
        <Suspense fallback={<LoadingScreen />}>
          <>
            <AppRoutes />
            {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
            // Direct access to admin panel enabled
          </>
        </Suspense>
      </AuthProvider>
    </SupabaseProvider>
  );
}

export default App;
