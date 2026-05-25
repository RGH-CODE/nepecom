import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Search, Menu, X, Package, Heart, LogOut, Settings } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { IsAuthenticated } from "../utils/authentication";

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("access");
  const username = localStorage.getItem("username") || "User";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [cartCount, setCartCount] = useState(0); // You can fetch this from your cart API
  const userMenuRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/search?q=${search}`);
      setShowSearch(false);
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("username");
    setShowUserMenu(false);
    navigate("/login");
  };

  return (
    <>
      {/* Top Banner (Optional - for promotions) */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-2 text-xs md:text-sm font-medium">
        🎉 Free Shipping on Orders Over Rs 5,000 | Use Code: FREESHIP
      </div>

      <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-lg shadow-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-16 md:h-20 items-center justify-between gap-4">
            {/* Left: Logo */}
            <div className="flex items-center gap-6 flex-shrink-0">
              <Link to="/" className="flex items-center gap-2 group">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative bg-gradient-to-br from-orange-500 to-red-500 p-2 rounded-full">
                    <Package className="h-5 w-5 md:h-6 md:w-6 text-white" />
                  </div>
                </motion.div>
                <span className="text-xl md:text-2xl font-black tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">
                    Nep
                  </span>
                  <span className="text-gray-900">Ecom</span>
                </span>
              </Link>

              {/* Desktop Navigation Links */}
              <div className="hidden lg:flex items-center gap-1">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/collections">Collections</NavLink>
                <NavLink to="/deals">Deals</NavLink>
                <NavLink to="/new-arrivals">New Arrivals</NavLink>
              </div>
            </div>

            {/* Center: Search Bar (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4">
              <div className="relative w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                <Input
                  type="search"
                  placeholder="Search for products, brands, and more..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleSearch}
                  className="w-full pl-12 pr-4 h-11 bg-gray-100 border-0 rounded-full focus:bg-white focus:ring-2 focus:ring-orange-500 transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
              {/* Mobile Search Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-orange-50"
                onClick={() => setShowSearch(true)}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Wishlist */}
              {isLoggedIn && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex hover:bg-orange-50 relative group"
                  asChild
                >
                  <Link to="/wishlist">
                    <Heart className="h-5 w-5 group-hover:text-orange-600 transition-colors" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      3
                    </span>
                  </Link>
                </Button>
              )}

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-orange-50 relative group"
                asChild
              >
                <Link to="/carts">
                  <ShoppingCart className="h-5 w-5 group-hover:text-orange-600 transition-colors" />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </Link>
              </Button>

              {/* Orders (Desktop) */}
              {isLoggedIn && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden lg:flex hover:bg-orange-50"
                  asChild
                >
                  <Link to="/orders">
                    <Package className="h-5 w-5" />
                  </Link>
                </Button>
              )}

              {/* User Menu */}
              {isLoggedIn ? (
                <div className="relative hidden md:block" ref={userMenuRef}>
                  <Button
                    variant="ghost"
                    className="gap-2 hover:bg-orange-50 rounded-full"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <div className="bg-gradient-to-br from-orange-500 to-red-500 p-1.5 rounded-full">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-semibold text-sm max-w-20 truncate">
                      {username}
                    </span>
                  </Button>

                  {/* User Dropdown Menu */}
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border overflow-hidden"
                      >
                        <div className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                          <p className="font-semibold">{username}</p>
                          <p className="text-xs opacity-90">Welcome back!</p>
                        </div>
                        <div className="py-2">
                          <UserMenuItem
                            to="/profile"
                            icon={<User className="h-4 w-4" />}
                            onClick={() => setShowUserMenu(false)}
                          >
                            My Profile
                          </UserMenuItem>
                          <UserMenuItem
                            to="/orders"
                            icon={<Package className="h-4 w-4" />}
                            onClick={() => setShowUserMenu(false)}
                          >
                            My Orders
                          </UserMenuItem>
                          <UserMenuItem
                            to="/wishlist"
                            icon={<Heart className="h-4 w-4" />}
                            onClick={() => setShowUserMenu(false)}
                            
                          >
                            Wishlist
                          </UserMenuItem>
                          <UserMenuItem
                            to="/complete-profile"
                            icon={<Settings className="h-4 w-4" />}
                            onClick={() => setShowUserMenu(false)}
                          >
                            Settings
                          </UserMenuItem>
                          <div className="border-t my-2" />
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-full font-semibold"
                    asChild
                  >
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-orange-50"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Category Bar (Optional - Desktop Only) */}
        <div className="hidden lg:block border-t bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center gap-8 py-3">
              <CategoryLink to="/search?q=beauty">Beauty</CategoryLink>
              <CategoryLink to="/search?q=stationery">Stationary</CategoryLink>
              <CategoryLink to="/search?q=home">Home & Living</CategoryLink>
             
              <CategoryLink to="/search?Books">Books</CategoryLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setShowSearch(false)}
          >
            <motion.div
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              exit={{ y: -100 }}
              className="bg-white p-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    autoFocus
                    type="search"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleSearch}
                    className="pl-10 h-12 rounded-full"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSearch(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b bg-white overflow-hidden md:hidden"
          >
            <div className="p-5 space-y-4">
              {/* User Info */}
              {isLoggedIn && (
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white">
                  <div className="bg-white/20 p-2 rounded-full">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{username}</p>
                    <p className="text-xs opacity-90">Welcome back!</p>
                  </div>
                </div>
              )}

              {/* Mobile Navigation */}
              <nav className="flex flex-col gap-1">
                <MobileNavLink
                  to="/"
                  icon={<Package className="h-5 w-5" />}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </MobileNavLink>
                <MobileNavLink
                  to="/collections"
                  icon={<Package className="h-5 w-5" />}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Collections
                </MobileNavLink>
                {isLoggedIn && (
                  <>
                    <MobileNavLink
                      to="/orders"
                      icon={<Package className="h-5 w-5" />}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      My Orders
                    </MobileNavLink>
                    <MobileNavLink
                      to="/wishlist"
                      icon={<Heart className="h-5 w-5" />}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Wishlist
                    </MobileNavLink>
                    <MobileNavLink
                      to="/profile"
                      icon={<User className="h-5 w-5" />}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </MobileNavLink>
                  </>
                )}
              </nav>

              {/* Mobile Auth Buttons */}
              {!isLoggedIn ? (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button
                    variant="outline"
                    asChild
                    className="w-full rounded-full"
                  >
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                  >
                    <Link
                      to="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full text-red-600 hover:bg-red-50 border-red-200 rounded-full"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="relative px-3 py-2 text-sm font-semibold text-gray-700 hover:text-orange-600 transition-colors group"
    >
      {children}
      <span className="absolute inset-x-3 -bottom-px h-0.5 bg-gradient-to-r from-orange-500 to-red-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
    </Link>
  );
}

function CategoryLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-sm text-gray-600 hover:text-orange-600 font-medium transition-colors"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, children, onClick, icon }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 h-12 px-4 rounded-xl hover:bg-orange-50 font-medium transition-colors text-gray-700"
    >
      {icon}
      {children}
    </Link>
  );
}

function UserMenuItem({ to, children, onClick, icon }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 transition-colors"
    >
      {icon}
      {children}
    </Link>
  );
}