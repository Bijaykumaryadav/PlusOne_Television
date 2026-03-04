import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { publicClient } from '@/services/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import UsersHeader from '../../components/users-view/users-header';
import UsersFooter from '../../components/users-view/users-footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function UsersDashboard() {
  const [articles, setArticles] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useSelector(state => state.userAuth || {});
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      // Fetch featured and latest articles from backend
      const [featuredRes, latestRes] = await Promise.all([
        publicClient.get('/articles/featured?limit=3'),
        publicClient.get('/articles?limit=10&page=1'),
      ]);

      if (featuredRes.data && featuredRes.data.data) setFeatured(featuredRes.data.data);
      if (latestRes.data && latestRes.data.data) setArticles(latestRes.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setLoading(false);
    }
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
        {/* featured stories */}
        <section className="bg-white py-8 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {loading
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
                : (featured.length ? featured : articles.slice(0, 3)).map(article => (
                    <Card
                      key={article._id}
                      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                    >
                      <div className="relative overflow-hidden h-40">
                        <img
                          src={article.thumbnail || article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge className="absolute top-3 left-3 bg-red-600 hover:bg-red-700">
                          {article.category}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 text-sm group-hover:text-red-600 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                          {article.description}
                        </p>
                        <div className="flex gap-2 text-xs text-gray-500">
                          <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{article.readTime} min read</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
            </div>
          </div>
        </section>

        {/* category nav */}
        <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex overflow-x-auto gap-6 py-3">
              {['Trending','Politics','Sports','Business','Technology','Entertainment','Health'].map(cat => (
                <Button
                  key={cat}
                  variant="ghost"
                  className="text-sm font-medium whitespace-nowrap hover:text-red-600 hover:bg-red-50"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* main content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <CardTitle>Latest News</CardTitle>
                    <Button asChild variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      <Link to="/articles">View All →</Link>
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    {loading
                      ? [...Array(5)].map((_, i) => (
                          <div key={i} className="space-y-3">
                            <div className="grid grid-cols-4 gap-4">
                              <Skeleton className="col-span-1 h-24 rounded" />
                              <div className="col-span-3 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton class="h-3 w-1/2" />
                                <Skeleton class="h-2 w-1/3" />
                              </div>
                            </div>
                            {i < 4 && <Separator />}
                          </div>
                        ))
                      : articles.map((article, idx) => (
                          <div key={article._id}>
                            <div className="grid grid-cols-4 gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                              <div className="col-span-1 overflow-hidden rounded h-24">
                                <img
                                  src={article.thumbnail || article.image}
                                  alt={article.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                              </div>
                              <div className="col-span-3 flex flex-col justify-between">
                                <div>
                                  <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 mb-2">
                                    {article.category}
                                  </Badge>
                                  <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm group-hover:text-red-600 transition-colors">
                                    {article.title}
                                  </h3>
                                  <p className="text-xs text-gray-600 line-clamp-1 mt-1">
                                    {article.description}
                                  </p>
                                </div>
                                <div className="flex gap-3 text-xs text-gray-500">
                                  <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                                  <span>•</span>
                                  <span>{article.readTime} min read</span>
                                </div>
                              </div>
                            </div>
                            {idx < articles.length - 1 && <Separator className="my-3" />}
                          </div>
                        ))}
                  </div>
                </CardContent>
              </Card>
            </div>

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

              {/* premium subscription card */}
              <Card>
                <CardHeader>
                  <CardTitle>Premium Subscription</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/payment')}
                  >
                    Subscribe via eSewa
                  </Button>
                </CardContent>
              </Card>

              {!isAuthenticated && (
                <Card className="bg-gradient-to-br from-red-600 to-red-800 border-0 text-white">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-2">Never Miss Breaking News</h3>
                    <p className="text-sm opacity-90 mb-4">
                      Get instant notifications for breaking news and updates.
                    </p>
                    <form className="space-y-3">
                      <Input
                        type="email"
                        placeholder="Your email"
                        className="bg-white/20 text-white placeholder:text-white/60 border-white/30"
                        required
                      />
                      <Button
                        type="submit"
                        className="w-full bg-white text-red-600 hover:bg-gray-100"
                      >
                        Subscribe Now
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-gradient-to-br from-gray-200 to-gray-300 border-0 min-h-80 flex items-center justify-center">
                <CardContent className="text-center">
                  <p className="text-gray-600 font-semibold">Advertisement</p>
                  <p className="text-sm text-gray-500 mt-2">Your ad here</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <UsersFooter />
    </div>
  );
}