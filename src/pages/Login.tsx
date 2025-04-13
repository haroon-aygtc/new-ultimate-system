import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn, getUserRole } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogIn, AlertCircle } from "lucide-react";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    location.state?.message || null,
  );

  // Get the return URL from query params if it exists
  const searchParams = new URLSearchParams(location.search);
  const returnUrl = searchParams.get("returnUrl");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      const { data: authData, error: authError } = await signIn(
        data.email,
        data.password,
      );

      if (authError) {
        setError(authError.message);
        return;
      }

      if (authData && authData.user) {
        // Get user role
        const {
          role,
          isGuest,
          error: roleError,
        } = await getUserRole(authData.user.id);

        if (roleError) {
          setError("Error retrieving user role");
          return;
        }

        // Redirect based on role
        if (returnUrl) {
          navigate(decodeURIComponent(returnUrl));
        } else if (role === "admin") {
          navigate("/admin/guest-session-management");
        } else if (role === "user") {
          navigate("/"); // Regular users go to home page
        } else {
          setError("Invalid user role");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-md mx-auto py-10"
      >
        <Card className="border-brand-muted/20 shadow-lg bg-white">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-brand-secondary">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-brand-muted">
              Sign in to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {successMessage && (
              <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert className="mb-4 border-destructive/50 text-destructive">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="your.email@example.com"
                          type="email"
                          autoComplete="email"
                          {...field}
                          disabled={isLoading}
                          className="border-brand-muted/30 focus-visible:ring-brand-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <Link
                          to="/forgot-password"
                          className="text-xs text-brand-primary hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          autoComplete="current-password"
                          {...field}
                          disabled={isLoading}
                          className="border-brand-muted/30 focus-visible:ring-brand-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-brand-primary text-white hover:bg-brand-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </span>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-brand-muted">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-brand-primary hover:underline"
              >
                Create an account
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </Layout>
  );
}
