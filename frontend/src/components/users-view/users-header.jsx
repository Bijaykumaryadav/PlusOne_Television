import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Bell, User, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

export default function UsersHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.userAuth || {});

  const handleLogout = () => {
    dispatch({ type: 'USER_LOGOUT' });
    navigate('/');
  };

  const categories = ['Home', 'Politics', 'Sports', 'Business', 'Technology', 'Entertainment'];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Breaking News Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-3 flex items-center gap-4">
        <Badge variant="secondary" className="bg-white/20 text-white border-0 animate-pulse whitespace-nowrap">
          🔴 BREAKING
        </Badge>
        <div className="text-sm font-semibold truncate">Latest news updates and headlines</div>
      </div>

      {/* Main Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline min-w-max hover:opacity-80 transition-opacity">
            <img src="/logo.svg" alt="PlusOne" className="h-10 w-10" />
            <span className="text-lg font-bold text-gray-900 hidden sm:inline">Sidha Reporting</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 flex-1 justify-center">
            {categories.map(cat => (
              <Link
                key={cat}
                to={`/articles?category=${cat}`}
                className="text-sm font-medium text-gray-700 hover:text-red-600 relative transition-colors group"
              >
                {cat}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className={`relative transition-all duration-300 ${isSearchOpen ? 'w-72' : 'w-10'}`}>
              <Input
                type="text"
                placeholder="Search news..."
                className="w-full pl-10 py-2 h-10"
                onFocus={() => setIsSearchOpen(true)}
                onBlur={() => setIsSearchOpen(false)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            {/* Notifications */}
            {isAuthenticated && (
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5 text-gray-700" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs"
                >
                  3
                </Badge>
              </Button>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full overflow-hidden border-2 border-gray-200 hover:border-red-600 transition-colors">
                  <img
                    src={user?.profilePicture || '/avatar-placeholder.png'}
                    alt={user?.name}
                    className="w-9 h-9 object-cover"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/bookmarks" className="cursor-pointer">
                      <span className="mr-2">📌</span>
                      Saved Articles
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/preferences" className="cursor-pointer">
                      <span className="mr-2">⚙️</span>
                      Preferences
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="bg-red-600 hover:bg-red-700">
                <Link to="/auth/login" className="word-wrap">Advertise with us/Sponsor us</Link>
              </Button>
            )}

            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4 mt-6">
                  {categories.map(cat => (
                    <Link
                      key={cat}
                      to={`/articles?category=${cat}`}
                      className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                    >
                      {cat}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}