
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { useAdmin } from "@/hooks/useAdmin";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();

        if (data) {
          const name = data.first_name || data.last_name || user.email?.split('@')[0] || 'User';
          setUserName(name);
        } else {
          setUserName(user.email?.split('@')[0] || 'User');
        }
      }
    };

    fetchUserName();
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm dark:bg-background/80"
          : "bg-transparent"
      }`}
    >
      <div className="container px-4 mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">ProcessPilot</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="text-foreground/80 hover:text-primary font-medium"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-foreground/80 hover:text-primary font-medium"
          >
            About
          </Link>
          <Link
            to="/request"
            className="text-foreground/80 hover:text-primary font-medium"
          >
            Request
          </Link>
          
          <ThemeToggle />
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-2">
                  <User className="w-4 h-4 mr-2" />
                  {userName}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer">Dashboard</Link>
                </DropdownMenuItem>
                
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer flex items-center">
                        <Shield className="w-4 h-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/admin/add" className="cursor-pointer">
                        Add Admin
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="outline" className="ml-2">
                Sign In
              </Button>
            </Link>
          )}
        </nav>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            className="text-foreground/80 hover:text-primary"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md shadow-md transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="container mx-auto py-4 px-4 flex flex-col space-y-4">
          <Link
            to="/"
            className="text-foreground/80 hover:text-primary font-medium py-2"
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-foreground/80 hover:text-primary font-medium py-2"
            onClick={closeMenu}
          >
            About
          </Link>
          <Link
            to="/request"
            className="text-foreground/80 hover:text-primary font-medium py-2"
            onClick={closeMenu}
          >
            Request
          </Link>
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-foreground/80 hover:text-primary font-medium py-2"
                onClick={closeMenu}
              >
                Dashboard
              </Link>
              
              {isAdmin && (
                <>
                  <Link
                    to="/admin"
                    className="text-foreground/80 hover:text-primary font-medium py-2 flex items-center"
                    onClick={closeMenu}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Dashboard
                  </Link>
                  <Link
                    to="/admin/add"
                    className="text-foreground/80 hover:text-primary font-medium py-2"
                    onClick={closeMenu}
                  >
                    Add Admin
                  </Link>
                </>
              )}
              
              <Button 
                variant="ghost" 
                className="justify-start px-0 hover:bg-transparent" 
                onClick={() => {
                  handleSignOut();
                  closeMenu();
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <Link
              to="/auth"
              className="text-foreground/80 hover:text-primary font-medium py-2"
              onClick={closeMenu}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
