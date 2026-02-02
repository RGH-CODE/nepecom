import { Link } from "react-router-dom";
import { ShoppingCart, User, Search, Menu, X, Package } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Navbar() {
  const isLoggedIn = !!localStorage.getItem("access");
  const username = localStorage.getItem("username") || "User";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <motion.div
                initial={{ rotate: -10 }}
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-primary/10 p-1.5 rounded-full"
              >
                <Package className="h-6 w-6 text-primary" />
              </motion.div>
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                NepEcom
              </span>
            </Link>
          </div>

          {/* Center: Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/collections">Collections</NavLink>
          </div>

          {/* Right: Search & Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden lg:flex relative items-center w-64 transition-all focus-within:w-80 mr-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-9 h-9 bg-muted/50 border-transparent focus:bg-background focus:border-input transition-colors rounded-full"
              />
            </div>

            <Button variant="ghost" size="icon" asChild className="relative hover:bg-primary/10 transition-colors">
              <Link to="/carts">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
              </Link>
            </Button>

            {isLoggedIn ? (
              <Button variant="ghost" size="sm" asChild className="gap-2 rounded-full hover:bg-primary/10">
                <Link to="/profile">
                  <div className="bg-primary/20 p-1 rounded-full">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="hidden lg:inline-block font-medium">{username}</span>
                </Link>
              </Button>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button size="sm" className="rounded-full" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-b bg-background overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search products..." className="w-full pl-9 bg-muted/50 rounded-full" />
              </div>
              <nav className="flex flex-col gap-1">
                <MobileNavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</MobileNavLink>
                <MobileNavLink to="/collections" onClick={() => setIsMobileMenuOpen(false)}>Collections</MobileNavLink>
              </nav>
              {!isLoggedIn && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavLink({ to, children }) {
  return (
    <Link to={to} className="relative group px-1 py-1 text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
      {children}
      <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
    </Link>
  );
}

function MobileNavLink({ to, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center h-10 px-4 rounded-md hover:bg-muted font-medium transition-colors"
    >
      {children}
    </Link>
  )
}
