import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { publicClient } from '@/services/axiosInstance';
import { useNavigate } from 'react-router-dom';
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
import { fetchAllArticles, fetchFeaturedArticles } from '@/features/articles/articlesSlice';

export default function UsersDashboard() {
  const dispatch = useDispatch();
  const { allArticles, featuredArticles, loadingAll, loadingFeatured } = useSelector(state => state.articles);
  const { isAuthenticated } = useSelector(state => state.userAuth || {});
  const [likedArticles, setLikedArticles] = useState(new Set());
  const [shareOpen, setShareOpen] = useState(null);
  const [articleStats, setArticleStats] = useState({});
  const [ads, setAds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (allArticles.length === 0) {
      dispatch(fetchAllArticles({ limit: 1000, page: 1 }));
    }
    if (featuredArticles.length === 0) {
      dispatch(fetchFeaturedArticles(3));
    }
    const likedSet = new Set(JSON.parse(localStorage.getItem('likedArticles') || '[]'));
    setLikedArticles(likedSet);
    fetchAds();
  }, [dispatch, allArticles.length, featuredArticles.length]);

  const fetchAds = async () => {
    try {
      const response = await publicClient.get('/ads/position/sidebar');
      if (response.data && response.data.data) {
        setAds(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  };

  const handleLike = async (articleId) => {
    try {
      if (likedArticles.has(articleId)) {
        await publicClient.delete(`/articles/${articleId}/like`, {
          data: { userId: 'guest-user' }
        });
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
    const url = `${window.location.origin}/articles/${article._id}`;
    copyToClipboard(url);
    alert('Link copied to clipboard!');
    setShareOpen(null);
  };

  const handleCardClick = (articleId) => {
    navigate(`/articles/${articleId}`);
  };

  const getArticleStats = (article) => {
    return {
      likeCount: articleStats[article._id]?.likeCount || article.likeCount || 0,
      shareCount: articleStats[article._id]?.shareCount || article.shareCount || 0,
      views: article.views || 0,
    };
  };

  const trendingTopics = [
    { rank: 1, title: 'Political Crisis Deepens as New Evidence Emerges', shares: '2.5K' },
    { rank: 2, title: 'Tech Industry Reports Record-Breaking Investments', shares: '2.1K' },
    { rank: 3, title: 'Climate Change: New International Agreement Reached', shares: '1.8K' },
    { rank: 4, title: 'Stock Market Volatility Affects Global Economy', shares: '1.5K' },
    { rank: 5, title: 'Celebrity News: Surprise Engagement Announcement', shares: '1.2K' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <UsersHeader />

      <main className="flex-1">
        {/* Featured Stories */}
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
                : (featuredArticles.length ? featuredArticles : allArticles.slice(0, 3)).map(article => (
                    <div
                      key={article._id}
                      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group rounded-lg border border-gray-200 bg-white"
                      onClick={() => handleCardClick(article._id)}
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
                        <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                          {article.summary}
                        </p>
                        <div className="flex gap-2 text-xs text-gray-500 justify-between items-center">
                          <div className="flex gap-2 items-center">
                            <span>{new Date(article.publishedDate || article.createdAt).toLocaleDateString()}</span>
                            <span>&bull;</span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" /> {getArticleStats(article).views}
                            </span>
                          </div>
                          <div className="flex gap-2 items-center text-xs">
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3 text-red-600" /> {getArticleStats(article).likeCount}
                            </span>
                            <span className="flex items-center gap-1">
                              <Share2 className="h-3 w-3 text-blue-600" /> {getArticleStats(article).shareCount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* All News */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <CardTitle>All News</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {loadingAll
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
                      : allArticles.map((article, idx) => (
                          <div key={article._id}>
                            <div
                              className="grid grid-cols-4 gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                              onClick={() => handleCardClick(article._id)}
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
                                  <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm group-hover:text-red-600 transition-colors">
                                    {article.title}
                                  </h3>
                                  <p className="text-xs text-gray-600 line-clamp-1 mt-1">
                                    {article.summary}
                                  </p>
                                </div>
                                <div className="flex gap-3 text-xs text-gray-500 justify-between items-center">
                                  <div className="flex gap-2 items-center">
                                    <span className="flex items-center gap-1">
                                      <Eye className="h-3 w-3" /> {getArticleStats(article).views}
                                    </span>
                                    <span>&bull;</span>
                                    <span>{new Date(article.publishedDate || article.createdAt).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex gap-3 items-center text-xs" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-center gap-1">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className={`h-5 w-5 p-0 ${likedArticles.has(article._id) ? 'text-red-600' : 'text-gray-500'} hover:text-red-600`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleLike(article._id);
                                        }}
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
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setShareOpen(shareOpen === article._id ? null : article._id);
                                        }}
                                        title="Share"
                                      >
                                        <Share2 className="h-3 w-3" />
                                      </Button>
                                      <span className="text-xs text-gray-500">{getArticleStats(article).shareCount}</span>
                                      {shareOpen === article._id && (
                                        <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10 flex gap-2">
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0"
                                            onClick={(e) => handleShare(e, 'facebook', article)}
                                            title="Share on Facebook"
                                          >
                                            <Facebook className="h-4 w-4 text-blue-600" />
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0"
                                            onClick={(e) => handleShare(e, 'twitter', article)}
                                            title="Share on Twitter"
                                          >
                                            <Twitter className="h-4 w-4 text-blue-400" />
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0"
                                            onClick={(e) => handleShare(e, 'whatsapp', article)}
                                            title="Share on WhatsApp"
                                          >
                                            <MessageCircle className="h-4 w-4 text-green-600" />
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0"
                                            onClick={(e) => handleShare(e, 'linkedin', article)}
                                            title="Share on LinkedIn"
                                          >
                                            <Linkedin className="h-4 w-4 text-blue-800" />
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0"
                                            onClick={(e) => handleCopyLink(e, article)}
                                            title="Copy link"
                                          >
                                            <Copy className="h-4 w-4 text-gray-600" />
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {idx < allArticles.length - 1 && <Separator className="my-3" />}
                          </div>
                        ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="text-lg">Trending Now</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {trendingTopics.map((topic, idx) => (
                      <div key={idx}>
                        <div className="flex items-start gap-3 p-2 rounded hover:bg-gray-50 transition-colors cursor-pointer group">
                          <div className="text-2xl font-bold text-red-600 flex-shrink-0 w-8">
                            {topic.rank}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors">
                              {topic.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">{topic.shares} shares</p>
                          </div>
                        </div>
                        {idx < trendingTopics.length - 1 && <Separator className="my-2" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Premium Subscription */}
              <Card>
                <CardHeader>
                  <CardTitle>Premium Subscription</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" onClick={() => navigate('/payment')}>
                    Subscribe via Khalti
                  </Button>
                </CardContent>
              </Card>

              {/* Newsletter */}
              {!isAuthenticated && (
                <Card className="bg-gradient-to-br from-red-600 to-red-800 border-0 text-white">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-2">Never Miss Breaking News</h3>
                    <p className="text-sm opacity-90 mb-4">
                      Get instant notifications for breaking news and updates.
                    </p>
                    <div className="space-y-3">
                      <Input
                        type="email"
                        placeholder="Your email"
                        className="bg-white/20 text-white placeholder:text-white/60 border-white/30"
                      />
                      <Button
                        type="button"
                        className="w-full bg-white text-red-600 hover:bg-gray-100"
                      >
                        Subscribe Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Ad Banner */}
              {ads.length > 0 ? (
                <Card
                  className="overflow-hidden border-0 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={async () => {
                    try {
                      await publicClient.put(`/ads/${ads[0]._id}/click`);
                      window.open(ads[0].linkUrl, '_blank');
                    } catch (error) {
                      console.error('Error tracking ad click:', error);
                    }
                  }}
                >
                  <div className="relative overflow-hidden h-80 bg-gray-200">
                    {ads[0].imageUrl && (
                      <img
                        src={ads[0].imageUrl}
                        alt={ads[0].title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    {ads[0].bannerText && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-4">
                        <p className="font-semibold text-sm">{ads[0].bannerText}</p>
                      </div>
                    )}
                  </div>
                </Card>
              ) : (
                <Card className="bg-gradient-to-br from-gray-200 to-gray-300 border-0 min-h-80 flex items-center justify-center">
                  <CardContent className="text-center">
                    <p className="text-gray-600 font-semibold">Advertisement</p>
                    <p className="text-sm text-gray-500 mt-2">Your ad here</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <UsersFooter />
    </div>
  );
}