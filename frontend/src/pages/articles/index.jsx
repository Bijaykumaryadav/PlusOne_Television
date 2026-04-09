import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { publicClient } from '@/services/axiosInstance';
import UsersHeader from '@/components/users-view/users-header';
import UsersFooter from '@/components/users-view/users-footer';
import { Heart, Share2, Facebook, Twitter, MessageCircle, Copy, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { shareOnSocialMedia, copyToClipboard } from '@/utils/shareUtils';
import { fetchAllArticles } from '@/features/articles/articlesSlice';

const ArticlesList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allArticles, loadingAll } = useSelector(state => state.articles);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [likedArticles, setLikedArticles] = useState(new Set());
  const [shareOpen, setShareOpen] = useState(null);

  const categories = [
    'breaking',
    'politics',
    'business',
    'technology',
    'sports',
    'entertainment',
    'health',
    'world',
  ];

  useEffect(() => {
    if (allArticles.length === 0) {
      dispatch(fetchAllArticles({ limit: 1000, page: 1 }));
    }
    const likedSet = new Set(JSON.parse(localStorage.getItem('likedArticles') || '[]'));
    setLikedArticles(likedSet);
  }, [dispatch, allArticles.length]);

  useEffect(() => {
    if (selectedCategory) {
      const filtered = allArticles.filter(article =>
        article.category.toLowerCase() === selectedCategory.toLowerCase()
      );
      setFilteredArticles(filtered);
    } else {
      setFilteredArticles(allArticles);
    }
  }, [selectedCategory, allArticles]);

  const getCategoryColor = (category) => {
    const colors = {
      breaking: 'bg-red-100 text-red-800',
      politics: 'bg-blue-100 text-blue-800',
      business: 'bg-green-100 text-green-800',
      technology: 'bg-purple-100 text-purple-800',
      sports: 'bg-orange-100 text-orange-800',
      entertainment: 'bg-pink-100 text-pink-800',
      health: 'bg-yellow-100 text-yellow-800',
      world: 'bg-indigo-100 text-indigo-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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
        await publicClient.post(`/articles/${articleId}/like`, {
          userId: 'guest-user'
        });
        const newLiked = new Set(likedArticles);
        newLiked.add(articleId);
        setLikedArticles(newLiked);
        localStorage.setItem('likedArticles', JSON.stringify(Array.from(newLiked)));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleShare = (e, platform, article) => {
    e.stopPropagation();
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <UsersHeader />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Latest News &amp; Articles</h1>
            <p className="text-lg text-gray-600">Stay informed with our latest updates and insights</p>
          </div>

          {/* Category Filter */}
          <div className="mb-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Category</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange('')}
                className={`px-4 py-2 rounded-full transition font-medium ${
                  selectedCategory === ''
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                All ({allArticles.length})
              </button>
              {categories.map((category) => {
                const count = allArticles.filter(a => a.category.toLowerCase() === category.toLowerCase()).length;
                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-4 py-2 rounded-full transition font-medium capitalize ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {category} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Articles Grid */}
          {loadingAll ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="bg-gray-100 rounded-lg p-12 text-center">
              <p className="text-gray-600 text-lg font-medium">
                No articles found{selectedCategory ? ` in ${selectedCategory}` : ''}.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <div
                  key={article._id}
                  onClick={() => handleCardClick(article._id)}
                  className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:scale-105 cursor-pointer relative"
                >
                  {/* Image Container */}
                  <div className="h-48 w-full overflow-hidden bg-gray-200 relative">
                    {article.image ? (
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                        <span className="text-gray-600 text-4xl">📰</span>
                      </div>
                    )}
                    {/* Category Badge */}
                    {article.category && (
                      <div className="absolute top-3 left-3">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${getCategoryColor(article.category)}`}>
                          {article.category}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col h-48">
                    <h2 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition">
                      {article.title}
                    </h2>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3 flex-grow">
                      {article.summary || article.description || ''}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-200 mb-3">
                      <span>{article.author || 'Unknown'}</span>
                      <span>{formatDate(article.publishedDate || article.createdAt)}</span>
                    </div>

                    {/* Views and Action Buttons */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>👁️ {article.views || 0} views</span>
                      <div
                        className="flex gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          size="sm"
                          variant="ghost"
                          className={`h-6 w-6 p-0 ${likedArticles.has(article._id) ? 'text-red-600' : 'text-gray-500'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(article._id);
                          }}
                          title="Like article"
                        >
                          <Heart className="h-4 w-4" fill={likedArticles.has(article._id) ? 'currentColor' : 'none'} />
                        </Button>

                        <div className="relative">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-gray-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShareOpen(shareOpen === article._id ? null : article._id);
                            }}
                            title="Share article"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>

                          {shareOpen === article._id && (
                            <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10">
                              <div className="flex flex-col gap-1">
                                <button
                                  onClick={(e) => handleShare(e, 'facebook', article)}
                                  className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 rounded text-sm text-gray-700"
                                >
                                  <Facebook className="h-4 w-4 text-blue-600" />
                                  Facebook
                                </button>
                                <button
                                  onClick={(e) => handleShare(e, 'twitter', article)}
                                  className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 rounded text-sm text-gray-700"
                                >
                                  <Twitter className="h-4 w-4 text-blue-400" />
                                  Twitter
                                </button>
                                <button
                                  onClick={(e) => handleShare(e, 'whatsapp', article)}
                                  className="flex items-center gap-2 px-3 py-2 hover:bg-green-50 rounded text-sm text-gray-700"
                                >
                                  <MessageCircle className="h-4 w-4 text-green-600" />
                                  WhatsApp
                                </button>
                                <button
                                  onClick={(e) => handleShare(e, 'linkedin', article)}
                                  className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 rounded text-sm text-gray-700"
                                >
                                  <Linkedin className="h-4 w-4 text-blue-700" />
                                  LinkedIn
                                </button>
                                <div className="border-t border-gray-200 my-1"></div>
                                <button
                                  onClick={(e) => handleCopyLink(e, article)}
                                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded text-sm text-gray-700"
                                >
                                  <Copy className="h-4 w-4 text-gray-600" />
                                  Copy Link
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <UsersFooter />
    </div>
  );
};

export default ArticlesList;