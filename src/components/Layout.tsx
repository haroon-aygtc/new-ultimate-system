import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Home, User, LogOut, Menu, X, Search } from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";
import { Input } from "@/components/ui/input";
import LoginButton from "@/components/LoginButton";

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export default function Layout({ children, showSidebar = false }: LayoutProps) {
  const { user, signOut, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchValue);
    // Implement search functionality here
  };

  return (
    <div className="min-h-screen bg-brand-light flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-white shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/90">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl text-brand-primary">
                GuestApp
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="flex-1 flex items-center justify-between">
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
              <Link
                to="/"
                className="text-sm font-medium transition-colors hover:text-brand-primary"
              >
                Home
              </Link>
              {user && (
                <Link
                  to="/admin/guest-session-management"
                  className="text-sm font-medium transition-colors hover:text-brand-primary"
                >
                  Admin
                </Link>
              )}
            </nav>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center mx-4 flex-1 max-w-sm"
            >
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-8 bg-background"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </form>

            <div className="hidden md:flex items-center space-x-4">
              {isLoading ? (
                <div className="h-9 w-24 bg-muted animate-pulse rounded-md"></div>
              ) : user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm">{user.email}</span>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/account-settings">
                      <User className="h-4 w-4 mr-2" />
                      Account
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => signOut()}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LoginButton variant="outline" size="sm" />
                  <Button size="sm" asChild>
                    <Link to="/register">Register</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden flex items-center justify-center rounded-md p-2 text-foreground"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="container space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative w-full">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="pl-8 bg-background w-full"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </div>
              </form>

              <Link
                to="/"
                className="flex items-center py-2 text-sm font-medium transition-colors hover:text-brand-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
              {user && (
                <Link
                  to="/admin/guest-session-management"
                  className="flex items-center py-2 text-sm font-medium transition-colors hover:text-brand-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Admin
                </Link>
              )}
              {isLoading ? (
                <div className="h-9 w-full bg-muted animate-pulse rounded-md"></div>
              ) : user ? (
                <div className="space-y-2">
                  <p className="text-sm">{user.email}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full mb-2"
                  >
                    <Link
                      to="/account-settings"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Account
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => signOut()}
                    className="w-full"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <LoginButton
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setMobileMenuOpen(false)}
                  />
                  <Button size="sm" asChild className="w-full">
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        {showSidebar && <Sidebar />}

        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0 bg-brand-secondary text-white">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-white/80 md:text-left">
            &copy; {new Date().getFullYear()} GuestApp. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
