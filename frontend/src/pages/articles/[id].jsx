import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { publicClient } from '@/services/axiosInstance';
import UsersHeader from '@/components/users-view/users-header';
import UsersFooter from '@/components/users-view/users-footer';
import { Heart, Share2, Facebook, Twitter, MessageCircle, Copy, ChevronLeft } from 'lucide-react';
import { shareOnSocialMedia, copyToClipboard } from '@/utils/shareUtils';
import { Button } from '@/components/ui/button';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await publicClient.get(`/articles/${id}`);
        if (mounted && data && data.data) {
          setArticle(data.data);
          // Check if already liked
          const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '[]');
          setLiked(likedArticles.includes(id));
        } else {
          setError('Article not found');
        }
      } catch (err) {
        if (mounted) {
          console.error('Failed to fetch article', err);
          setError('Failed to load article. Please try again later.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const handleLike = async () => {
    try {
      if (liked) {
        await publicClient.delete(`/articles/${id}/like`, {
          data: { userId: 'guest-user' }
        });
        const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '[]');
        const updated = likedArticles.filter(aid => aid !== id);
        localStorage.setItem('likedArticles', JSON.stringify(updated));
        setLiked(false);
      } else {
        await publicClient.post(`/articles/${id}/like`, {
          userId: 'guest-user'
        });
        const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '[]');
        if (!likedArticles.includes(id)) {
          likedArticles.push(id);
          localStorage.setItem('likedArticles', JSON.stringify(likedArticles));
        }
        setLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleShare = (platform) => {
    shareOnSocialMedia(platform, article);
    setShareOpen(false);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/articles/${article._id}`;
    copyToClipboard(url);
    alert('Link copied to clipboard!');
    setShareOpen(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <UsersHeader />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto p-4">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="h-96 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </main>
        <UsersFooter />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <UsersHeader />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto p-4">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h2>
              <p className="text-gray-600 mb-4">{error || 'The article you are looking for does not exist.'}</p>
              <button
                onClick={() => navigate('/')}
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                Back to Home
              </button>
            </div>
          </div>
        </main>
        <UsersFooter />
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <UsersHeader />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition font-medium"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>

          {/* Main Content */}
          <article className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Featured Image */}
            {article.image && (
              <div className="w-full h-96 md:h-[500px] bg-gray-200 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="p-6 md:p-10">
              {/* Category Badge */}
              {article.category && (
                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wide ${getCategoryColor(article.category)}`}>
                    {article.category}
                  </span>
                </div>
              )}

              {/* Article Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {article.title}
              </h1>

              {/* Article Meta & Actions */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-gray-200 mb-6 gap-4">
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="font-semibold">By</span>
                    <span className="ml-2">{article.author || 'Unknown Author'}</span>
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <div>{formatDate(article.publishedDate || article.createdAt)}</div>
                  <span className="hidden sm:inline">•</span>
                  <div>{article.views || 0} views</div>
                </div>
                
                {/* Like and Share Buttons */}
                <div className="flex gap-3 items-center">
                  <Button
                    size="sm"
                    variant="outline"
                    className={`flex items-center gap-2 ${liked ? 'bg-red-50 text-red-600 border-red-300' : ''}`}
                    onClick={handleLike}
                  >
                    <Heart className="h-4 w-4" fill={liked ? 'currentColor' : 'none'} />
                    <span className="text-xs">{article.likeCount || 0}</span>
                  </Button>
                  
                  <div className="relative">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => setShareOpen(!shareOpen)}
                    >
                      <Share2 className="h-4 w-4" />
                      <span className="text-xs">Share</span>
                    </Button>
                    
                    {shareOpen && (
                      <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-3 z-10 min-w-max">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleShare('facebook')}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 rounded text-sm text-gray-700"
                          >
                            <Facebook className="h-4 w-4 text-blue-600" />
                            Facebook
                          </button>
                          <button
                            onClick={() => handleShare('twitter')}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 rounded text-sm text-gray-700"
                          >
                            <Twitter className="h-4 w-4 text-blue-400" />
                            Twitter
                          </button>
                          <button
                            onClick={() => handleShare('whatsapp')}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-green-50 rounded text-sm text-gray-700"
                          >
                            <MessageCircle className="h-4 w-4 text-green-600" />
                            WhatsApp
                          </button>
                          <button
                            onClick={() => handleShare('linkedin')}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 rounded text-sm text-gray-700"
                          >
                            <Share2 className="h-4 w-4 text-blue-700" />
                            LinkedIn
                          </button>
                          <div className="border-t border-gray-200 my-1"></div>
                          <button
                            onClick={handleCopyLink}
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

              {/* Article Summary */}
              {article.summary && (
                <div className="mb-6 text-lg text-gray-700 italic font-light bg-gray-100 p-4 rounded-lg border-l-4 border-blue-600">
                  {article.summary}
                </div>
              )}

              {/* Article Content */}
              <div className="prose prose-lg max-w-none text-gray-800 mb-6">
                {article.content ? (
                  <div dangerouslySetInnerHTML={{ __html: article.content }} />
                ) : (
                  <p>Content not available.</p>
                )}
              </div>

              {/* Tags */}
              {article.tags && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.split(',').map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition cursor-pointer"
                      >
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
        </div>
      </main>
      <UsersFooter />
    </div>
  );
};

export default ArticleDetail;
