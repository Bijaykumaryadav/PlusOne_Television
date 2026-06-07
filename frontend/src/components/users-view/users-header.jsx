import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import logo from '@/assets/logofinal.png';
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
import { Eye, Heart, Share2, X } from 'lucide-react';

// Primary nav — always visible on desktop
const PRIMARY_NAV = [
  { label: 'Home', path: '/' },
  { label: 'All', path: '/articles' },
  { label: 'Sports', path: '/?category=sports' },
  { label: 'Business', path: '/?category=business' },
  { label: 'Technology', path: '/?category=technology' },
  { label: 'Entertainment', path: '/?category=entertainment' },
];

// Secondary nav — shown in "More" dropdown on desktop, full list on mobile
const MORE_NAV = [
  { label: 'Politics', path: '/?category=politics' },
  { label: 'Breaking', path: '/?category=breaking' },
  { label: 'Health', path: '/?category=health' },
  { label: 'World', path: '/?category=world' },
  { label: 'Notices', path: '/notices' },
  { label: 'About Us', path: '/about' },
  { label: 'Careers', path: '/careers' },
];

// All nav combined for mobile
const ALL_NAV = [...PRIMARY_NAV, ...MORE_NAV];

export default function UsersHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [previewArticle, setPreviewArticle] = useState(null);
  const [currentTickerIndex, setCurrentTickerIndex] = useState(0);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.userAuth || {});
  const { featuredArticles, allArticles } = useSelector(state => state.articles || {});

  const tickerArticles = (featuredArticles?.length ? featuredArticles : allArticles || []).slice(0, 20);

  useEffect(() => {
    if (tickerArticles.length === 0) return;
    const interval = setInterval(() => {
      setCurrentTickerIndex(prev => (prev + 1) % tickerArticles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [tickerArticles.length]);

  // Close "More" dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    dispatch({ type: 'USER_LOGOUT' });
    navigate('/');
  };

  const handleTickerClick = (article) => setPreviewArticle(article);

  const handlePreviewNavigate = (articleId) => {
    setPreviewArticle(null);
    navigate(`/articles/${articleId}`);
  };

  const getIsActive = (path) => {
    const params = new URLSearchParams(location.search);
    const currentCategory = params.get('category');
    if (path === '/' && location.pathname === '/' && !currentCategory) return true;
    if (path === '/articles' && location.pathname === '/articles' && !currentCategory) return true;
    if (path.startsWith('/?category=')) {
      const cat = path.split('=')[1];
      return currentCategory === cat;
    }
    return location.pathname === path;
  };

  const isMoreActive = MORE_NAV.some(item => getIsActive(item.path));

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-md">
        {/* Breaking News Ticker */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 flex items-center gap-3">
          <Badge variant="secondary" className="bg-white/20 text-white border-0 animate-pulse whitespace-nowrap flex-shrink-0 text-xs">
            🔴 BREAKING
          </Badge>
          <div className="flex items-center gap-1 flex-shrink-0">
            {tickerArticles.slice(0, 10).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentTickerIndex(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === currentTickerIndex % Math.min(tickerArticles.length, 10)
                    ? 'bg-white w-2 h-2'
                    : 'bg-white/40 w-1.5 h-1.5'
                }`}
              />
            ))}
          </div>
          <div className="flex-1 overflow-hidden relative h-5">
            {tickerArticles.map((article, i) => (
              <button
                key={article._id}
                onClick={() => handleTickerClick(article)}
                className={`absolute inset-0 text-left text-sm font-semibold truncate w-full transition-all duration-500 hover:text-yellow-200 ${
                  i === currentTickerIndex
                    ? 'opacity-100 translate-y-0'
                    : i === (currentTickerIndex - 1 + tickerArticles.length) % tickerArticles.length
                    ? 'opacity-0 -translate-y-full'
                    : 'opacity-0 translate-y-full'
                }`}
              >
                {i + 1}. {article.title}
              </button>
            ))}
          </div>
          <div className="flex gap-1 flex-shrink-0 items-center">
            <button onClick={() => setCurrentTickerIndex(prev => (prev - 1 + tickerArticles.length) % tickerArticles.length)} className="text-white/70 hover:text-white text-lg px-1 transition-colors">‹</button>
            <span className="text-white/50 text-xs">{tickerArticles.length > 0 ? `${currentTickerIndex + 1}/${tickerArticles.length}` : ''}</span>
            <button onClick={() => setCurrentTickerIndex(prev => (prev + 1) % tickerArticles.length)} className="text-white/70 hover:text-white text-lg px-1 transition-colors">›</button>
          </div>
        </div>

        {/* Main Header */}
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 no-underline min-w-max hover:opacity-80 transition-opacity">
              <img src={logo} alt="Sidha Reporting" className="h-10 w-10" />
              <span className="text-lg font-bold text-gray-900 hidden sm:inline">Sidha Reporting</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-6 flex-1 justify-center items-center">
              {PRIMARY_NAV.map(item => {
                const isActive = getIsActive(item.path);
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`text-sm font-medium relative transition-colors group whitespace-nowrap ${
                      isActive ? 'text-red-600' : 'text-gray-700 hover:text-red-600'
                    }`}
                  >
                    {item.label}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-red-600 transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                  </Link>
                );
              })}

              {/* More dropdown */}
              <div className="relative" ref={moreRef}>
                <button
                  onClick={() => setMoreOpen(prev => !prev)}
                  className={`text-sm font-medium flex items-center gap-1 transition-colors ${
                    isMoreActive ? 'text-red-600' : 'text-gray-700 hover:text-red-600'
                  }`}
                >
                  More <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
                </button>
                {moreOpen && (
                  <div className="absolute top-full left-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                    {MORE_NAV.map(item => {
                      const isActive = getIsActive(item.path);
                      return (
                        <Link
                          key={item.label}
                          to={item.path}
                          onClick={() => setMoreOpen(false)}
                          className={`block px-4 py-2 text-sm transition-colors ${
                            isActive ? 'text-red-600 bg-red-50 font-semibold' : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                          }`}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <div className={`relative transition-all duration-300 ${isSearchOpen ? 'w-56' : 'w-10'}`}>
                <Input
                  type="text"
                  placeholder="Search news..."
                  className="w-full pl-10 py-2 h-10"
                  onFocus={() => setIsSearchOpen(true)}
                  onBlur={() => setIsSearchOpen(false)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>

              {isAuthenticated && (
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5 text-gray-700" />
                  <Badge variant="destructive" className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs">3</Badge>
                </Button>
              )}

              <Button asChild className="hidden sm:flex bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold gap-2">
                <Link to="/payment" state={{ source: 'header', referrer: isAuthenticated ? 'premium' : 'advertiser' }}>
                  <span>⭐</span>
                  <span className="hidden lg:inline">{isAuthenticated ? 'Upgrade Premium' : 'Advertise'}</span>
                  <span className="lg:hidden">Premium</span>
                </Link>
              </Button>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="rounded-full overflow-hidden border-2 border-gray-200 hover:border-red-600 transition-colors">
                    <img src={user?.profilePicture || '/avatar-placeholder.png'} alt={user?.name} className="w-9 h-9 object-cover" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer"><User className="w-4 h-4 mr-2" /> Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/bookmarks" className="cursor-pointer"><span className="mr-2">📌</span> Saved Articles</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/preferences" className="cursor-pointer"><span className="mr-2">⚙️</span> Preferences</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/payment" className="cursor-pointer"><span className="mr-2">⭐</span> Upgrade Premium</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild className="sm:hidden bg-red-600 hover:bg-red-700">
                  <Link to="/payment">Premium</Link>
                </Button>
              )}

              {/* Mobile hamburger */}
              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon"><Menu className="w-6 h-6" /></Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <div className="mt-6 space-y-1">
                    {ALL_NAV.map(item => {
                      const isActive = getIsActive(item.path);
                      const isSection = item.label === 'Notices' || item.label === 'About Us' || item.label === 'Careers';
                      return (
                        <div key={item.label}>
                          {isSection && item.label === 'Notices' && (
                            <div className="px-3 pt-4 pb-1">
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Company</p>
                            </div>
                          )}
                          <Link
                            to={item.path}
                            className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                              isActive ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-700 hover:bg-gray-50 hover:text-red-600'
                            }`}
                          >
                            {item.label}
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Article Preview Modal */}
      {previewArticle && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4" onClick={() => setPreviewArticle(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden z-10"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setPreviewArticle(null)} className="absolute top-3 right-3 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 transition-colors">
              <X className="w-4 h-4" />
            </button>
            <div className="relative h-48 overflow-hidden">
              <img src={previewArticle.image} alt={previewArticle.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <Badge className="absolute top-3 left-3 bg-red-600 hover:bg-red-700 text-xs">{previewArticle.category}</Badge>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 line-clamp-3">{previewArticle.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">{previewArticle.summary}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {previewArticle.views || 0}</span>
                <span className="flex items-center gap-1"><Heart className="h-3 w-3 text-red-500" /> {previewArticle.likeCount || 0}</span>
                <span className="flex items-center gap-1"><Share2 className="h-3 w-3 text-blue-500" /> {previewArticle.shareCount || 0}</span>
                <span className="ml-auto">{new Date(previewArticle.publishedDate || previewArticle.createdAt).toLocaleDateString()}</span>
              </div>
              <button onClick={() => handlePreviewNavigate(previewArticle._id)} className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
                Read Full Article →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}