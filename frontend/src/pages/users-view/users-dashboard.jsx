import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { publicClient } from '@/services/axiosInstance';
import { useNavigate, useLocation } from 'react-router-dom';
import UsersHeader from '../../components/users-view/users-header';
import UsersFooter from '../../components/users-view/users-footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, Share2, Facebook, Twitter, MessageCircle, Copy, Eye, Linkedin } from 'lucide-react';
import { shareOnSocialMedia, copyToClipboard } from '@/utils/shareUtils';
import { setupHomepageSEO, buildArticleUrl } from '@/utils/seoUtils';
import { fetchAllArticles, fetchFeaturedArticles, fetchCategoizedArticles, setCurrentCategory } from '@/features/articles/articlesSlice';

const CATEGORIES = [
  { id: 'breaking', label: 'Breaking' },
  { id: 'politics', label: 'Politics' },
  { id: 'business', label: 'Business' },
  { id: 'technology', label: 'Technology' },
  { id: 'sports', label: 'Sports' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'health', label: 'Health' },
  { id: 'world', label: 'World' },
];

export default function UsersDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    allArticles,
    featuredArticles,
    categorizedArticles,
    currentCategory,
    loadingAll,
    loadingFeatured,
    loadingCategorized
  } = useSelector(state => state.articles);

  const { isAuthenticated } = useSelector(state => state.userAuth || {});
  const [likedArticles, setLikedArticles] = useState(new Set());
  const [shareOpen, setShareOpen] = useState(null);
  const [articleStats, setArticleStats] = useState({});
  const [ads, setAds] = useState([]);
  const [activeTab, setActiveTab] = useState('featured');

  // Sync activeTab with URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');

    if (categoryParam) {
      setActiveTab('category');
      dispatch(setCurrentCategory(categoryParam));
      dispatch(fetchCategoizedArticles({ category: categoryParam, limit: 1000, page: 1 }));
    } else if (location.pathname === '/articles') {
      setActiveTab('all');
      dispatch(setCurrentCategory(''));
      if (allArticles.length === 0) {
        dispatch(fetchAllArticles({ limit: 1000, page: 1 }));
      }
    } else {
      setActiveTab('featured');
      dispatch(setCurrentCategory(''));
    }
  }, [location.search, location.pathname, dispatch]);

  // Initial data fetch
  useEffect(() => {
    setupHomepageSEO();
    if (featuredArticles.length === 0) {
      dispatch(fetchFeaturedArticles(20));
    }
    if (allArticles.length === 0) {
      dispatch(fetchAllArticles({ limit: 1000, page: 1 }));
    }
    const likedSet = new Set(JSON.parse(localStorage.getItem('likedArticles') || '[]'));
    setLikedArticles(likedSet);
    fetchAds();
  }, [dispatch]);

  const fetchAds = async () => {
    try {
      const [sidebarResponse, topResponse] = await Promise.all([
        publicClient.get('/ads/position/sidebar'),
        publicClient.get('/ads/position/top'),
      ]);

      const sidebarAds = sidebarResponse?.data?.data || [];
      const topAds = topResponse?.data?.data || [];

      setAds(sidebarAds.length ? sidebarAds : []);
      if (sidebarAds.length === 0 && topAds.length > 0) {
        setAds(topAds);
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  };

  const handleCategoryFilter = (categoryId) => {
    if (categoryId) {
      navigate(`/?category=${categoryId}`);
    } else {
      navigate('/');
    }
  };

  const handleLike = async (articleId) => {
    try {
      if (likedArticles.has(articleId)) {
        await publicClient.delete(`/articles/${articleId}/like`, { data: { userId: 'guest-user' } });
        const newLiked = new Set(likedArticles);
        newLiked.delete(articleId);
        setLikedArticles(newLiked);
        localStorage.setItem('likedArticles', JSON.stringify(Array.from(newLiked)));
      } else {
        await publicClient.post(`/articles/${articleId}/like`, { userId: 'guest-user' });
        const newLiked = new Set(likedArticles);
        newLiked.add(articleId);
        setLikedArticles(newLiked);
        localStorage.setItem('likedArticles', JSON.stringify(Array.from(newLiked)));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleShare = async (e, platform, article) => {
    e.stopPropagation();
    try {
      await publicClient.post(`/articles/${article._id}/share`);
      setArticleStats(prev => ({
        ...prev,
        [article._id]: {
          ...prev[article._id],
          shareCount: (prev[article._id]?.shareCount || article.shareCount || 0) + 1
        }
      }));
    } catch (error) {
      console.error('Error tracking share:', error);
    }
    shareOnSocialMedia(platform, article);
    setShareOpen(null);
  };

  const handleCopyLink = (e, article) => {
    e.stopPropagation();
    const url = `${window.location.origin}${buildArticleUrl(article)}`;
    copyToClipboard(url);
    alert('Link copied to clipboard!');
    setShareOpen(null);
  };

  const handleCardClick = (article) => {
    navigate(buildArticleUrl(article));
  };

  const getArticleStats = (article) => ({
    likeCount: articleStats[article._id]?.likeCount || article.likeCount || 0,
    shareCount: articleStats[article._id]?.shareCount || article.shareCount || 0,
    views: article.views || 0,
  });

  const displayArticles = activeTab === 'featured'
    ? featuredArticles
    : activeTab === 'all'
    ? allArticles
    : categorizedArticles;

  const isLoading = activeTab === 'featured'
    ? loadingFeatured
    : activeTab === 'all'
    ? loadingAll
    : loadingCategorized;

  // Only show featured stories strip on Home and All tabs
  const showFeaturedStrip = activeTab === 'featured' || activeTab === 'all';
  // On category tabs, show featured strip BELOW the articles list
  const isCategoryTab = activeTab === 'category';

  // Reusable featured strip
  const FeaturedStrip = () => (
    <section className="bg-white py-8 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loadingFeatured
            ? [...Array(3)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="w-full h-40" />
                  <CardContent className="p-4">
                    <Skeleton className="h-6 mb-2" />
                    <Skeleton className="h-4 mb-4" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardContent>
                </Card>
              ))
            : (featuredArticles.length ? featuredArticles : allArticles.slice(0, 3)).slice(0, 3).map(article => (
                <div
                  key={article._id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group rounded-lg border border-gray-200 bg-white"
                  onClick={() => handleCardClick(article)}
                >
                  <div className="relative overflow-hidden h-40">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 left-3 bg-red-600 hover:bg-red-700">
                      {article.category}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 text-sm group-hover:text-red-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-3">{article.summary}</p>
                    <div className="flex gap-2 text-xs text-gray-500 justify-between items-center">
                      <div className="flex gap-2 items-center">
                        <span>{new Date(article.publishedDate || article.createdAt).toLocaleDateString()}</span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {getArticleStats(article).views}</span>
                      </div>
                      <div className="flex gap-2 items-center text-xs">
                        <span className="flex items-center gap-1"><Heart className="h-3 w-3 text-red-600" /> {getArticleStats(article).likeCount}</span>
                        <span className="flex items-center gap-1"><Share2 className="h-3 w-3 text-blue-600" /> {getArticleStats(article).shareCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );

  // Reusable article list
  const ArticleList = () => (
    <div className="lg:col-span-2">
      <Card>
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-2xl">
            {activeTab === 'featured'
              ? 'Featured Stories (Top 20)'
              : activeTab === 'all'
              ? 'All News'
              : `${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)} News`}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {isLoading
              ? [...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="grid grid-cols-4 gap-4">
                      <Skeleton className="col-span-1 h-24 rounded" />
                      <div className="col-span-3 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-2 w-1/3" />
                      </div>
                    </div>
                    {i < 7 && <Separator />}
                  </div>
                ))
              : displayArticles && displayArticles.length > 0
              ? displayArticles.map((article, idx) => (
                  <div key={article._id}>
                    <div
                      className="grid grid-cols-4 gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                      onClick={() => handleCardClick(article)}
                    >
                      <div className="col-span-1 overflow-hidden rounded h-24">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="col-span-3 flex flex-col justify-between relative">
                        <div>
                          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 mb-2">
                            {article.category}
                          </Badge>
                          {article.featured === 'yes' && (
                            <Badge className="ml-2 bg-yellow-500">Featured</Badge>
                          )}
                          <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm group-hover:text-red-600 transition-colors mt-2">
                            {article.title}
                          </h3>
                          <p className="text-xs text-gray-600 line-clamp-1 mt-1">{article.summary}</p>
                        </div>
                        <div className="flex gap-3 text-xs text-gray-500 justify-between items-center mt-2">
                          <div className="flex gap-2 items-center">
                            <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {getArticleStats(article).views}</span>
                            <span>&bull;</span>
                            <span>{new Date(article.publishedDate || article.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex gap-3 items-center text-xs" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className={`h-5 w-5 p-0 ${likedArticles.has(article._id) ? 'text-red-600' : 'text-gray-500'} hover:text-red-600`}
                                onClick={(e) => { e.stopPropagation(); handleLike(article._id); }}
                                title="Like"
                              >
                                <Heart className="h-3 w-3" fill={likedArticles.has(article._id) ? 'currentColor' : 'none'} />
                              </Button>
                              <span className="text-xs text-gray-500">{getArticleStats(article).likeCount}</span>
                            </div>
                            <div className="flex items-center gap-1 relative">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-5 w-5 p-0 text-gray-500 hover:text-blue-600"
                                onClick={(e) => { e.stopPropagation(); setShareOpen(shareOpen === article._id ? null : article._id); }}
                                title="Share"
                              >
                                <Share2 className="h-3 w-3" />
                              </Button>
                              <span className="text-xs text-gray-500">{getArticleStats(article).shareCount}</span>
                              {shareOpen === article._id && (
                                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10 flex gap-2">
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={(e) => handleShare(e, 'facebook', article)} title="Facebook">
                                    <Facebook className="h-4 w-4 text-blue-600" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={(e) => handleShare(e, 'twitter', article)} title="Twitter">
                                    <Twitter className="h-4 w-4 text-blue-400" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={(e) => handleShare(e, 'whatsapp', article)} title="WhatsApp">
                                    <MessageCircle className="h-4 w-4 text-green-600" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={(e) => handleShare(e, 'linkedin', article)} title="LinkedIn">
                                    <Linkedin className="h-4 w-4 text-blue-800" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={(e) => handleCopyLink(e, article)} title="Copy link">
                                    <Copy className="h-4 w-4 text-gray-600" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {idx < displayArticles.length - 1 && <Separator className="my-3" />}
                  </div>
                ))
              : <div className="text-center py-10"><p className="text-gray-500">No articles found</p></div>
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Reusable sidebar
  const Sidebar = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-red-600 to-red-800 border-0 text-white">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold mb-2">Premium Access</h3>
          <p className="text-sm opacity-90 mb-4">Get exclusive news and ad-free experience</p>
          <Button variant="outline" onClick={() => navigate('/payment')} className="w-full bg-white text-red-600 hover:bg-gray-100">
            Subscribe via Khalti
          </Button>
        </CardContent>
      </Card>

      {!isAuthenticated && (
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <h3 className="font-bold mb-2">Breaking News Alert</h3>
            <p className="text-sm text-gray-600 mb-4">Get instant notifications for breaking news</p>
            <div className="space-y-3">
              <Input type="email" placeholder="Your email" className="border-gray-300" />
              <Button className="w-full bg-red-600 hover:bg-red-700">Subscribe</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {ads.length > 0 ? (
        <div className="space-y-4">
          {ads.map((ad, index) => (
            <Card
              key={ad._id || `${ad.title}-${index}`}
              className="overflow-hidden border-0 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={async () => {
                try {
                  await publicClient.put(`/ads/${ad._id}/click`);
                  window.open(ad.linkUrl, '_blank', 'noopener,noreferrer');
                } catch (error) {
                  console.error('Error tracking ad click:', error);
                }
              }}
            >
              <div className="relative overflow-hidden bg-gray-200">
                {ad.imageUrl && (
                  <img src={ad.imageUrl} alt={ad.title} className="w-full h-52 object-cover hover:scale-105 transition-transform duration-300" />
                )}
                <div className="bg-white p-4">
                  <div className="text-[10px] uppercase tracking-wide text-red-600 font-bold mb-1">Sponsored</div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">{ad.title}</h4>
                  {ad.description && <p className="text-xs text-gray-600 line-clamp-3">{ad.description}</p>}
                  {ad.bannerText && <p className="mt-2 text-xs font-medium text-red-600">{ad.bannerText}</p>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gradient-to-br from-gray-200 to-gray-300 border-0 min-h-80 flex items-center justify-center">
          <CardContent className="text-center">
            <p className="text-gray-600 font-semibold">Advertisement</p>
            <p className="text-sm text-gray-500 mt-2">Your ad here</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6">
          <h3 className="font-bold mb-4">Follow Us</h3>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1">Facebook</Button>
            <Button size="sm" variant="outline" className="flex-1">Twitter</Button>
            <Button size="sm" variant="outline" className="flex-1">Instagram</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <UsersHeader />

      <main className="flex-1">

        {/* Featured strip ABOVE on Home/All tabs only */}
        {showFeaturedStrip && <FeaturedStrip />}

        {/* Hero Banner */}
        <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-4xl font-bold mb-2">News & Updates</h1>
            <p className="text-red-100 text-lg">Stay informed with the latest news and trending stories</p>
          </div>
        </section>

        {/* Category Filter Bar */}
        <section className="bg-white border-b border-gray-200 py-4 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Button
                variant={activeTab === 'featured' ? 'default' : 'outline'}
                size="sm"
                onClick={() => navigate('/')}
                className="flex-shrink-0"
              >
                Featured
              </Button>
              <Button
                variant={activeTab === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => navigate('/articles')}
                className="flex-shrink-0"
              >
                All News
              </Button>
              {CATEGORIES.map(cat => (
                <Button
                  key={cat.id}
                  variant={activeTab === 'category' && currentCategory === cat.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryFilter(cat.id)}
                  className="flex-shrink-0"
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <ArticleList />
            <Sidebar />
          </div>
        </div>

        {/* Featured strip BELOW on category tabs only */}
        {isCategoryTab && (
          <div className="border-t border-gray-200 mt-4">
            <FeaturedStrip />
          </div>
        )}

      </main>

      <UsersFooter />
    </div>
  );
}