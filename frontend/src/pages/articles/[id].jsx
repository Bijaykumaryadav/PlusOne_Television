import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { publicClient } from '@/services/axiosInstance';
import UsersHeader from '@/components/users-view/users-header';
import UsersFooter from '@/components/users-view/users-footer';
import { Heart, Share2, Facebook, Twitter, MessageCircle, Copy, ChevronLeft, Linkedin, Eye } from 'lucide-react';
import { copyToClipboard, setArticleMetaTags } from '@/utils/shareUtils';
import { buildArticleUrl, setupArticleSEO } from '@/utils/seoUtils';
import { Button } from '@/components/ui/button';

// ─── inject / update <meta> tags dynamically ───────────────────────────────
const setMetaTag = (property, content, isName = false) => {
  if (!content) return;
  const attr = isName ? 'name' : 'property';
  let el = document.querySelector(`meta[${attr}="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const injectOGMeta = (article) => {
  const articleImage = article.image
    ? (article.image.startsWith('http://') || article.image.startsWith('https://') ? article.image : `https://sidhareporting.com${article.image}`)
    : 'https://sidhareporting.com/logofinal.png';
  const url = `${window.location.origin}${buildArticleUrl(article)}`;
  document.title = `${article.title} | Sidha Reporting`;

  // Open Graph (Facebook, LinkedIn, WhatsApp)
  setMetaTag('og:title', article.title);
  setMetaTag('og:description', article.summary || article.title);
  setMetaTag('og:image', articleImage);
  setMetaTag('og:image:secure_url', articleImage);
  setMetaTag('og:image:width', '1200');
  setMetaTag('og:image:height', '630');
  setMetaTag('og:image:alt', article.title);
  setMetaTag('og:url', url);
  setMetaTag('og:type', 'article');
  setMetaTag('og:site_name', 'Sidha Reporting');

  // Twitter Card
  setMetaTag('twitter:card', 'summary_large_image', true);
  setMetaTag('twitter:title', article.title, true);
  setMetaTag('twitter:description', article.summary || article.title, true);
  setMetaTag('twitter:image', articleImage, true);
  setMetaTag('twitter:image:alt', article.title, true);

  // Canonical
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url);
};

const getGuestId = () => {
  const storageKey = 'sidhaGuestId';
  let guestId = localStorage.getItem(storageKey);
  if (!guestId) {
    guestId = `guest-${crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
    localStorage.setItem(storageKey, guestId);
  }
  return guestId;
};

const cleanupMeta = () => {
  ['og:title','og:description','og:image','og:image:width','og:image:height',
   'og:url','og:type','og:site_name'].forEach(p => {
    const el = document.querySelector(`meta[property="${p}"]`);
    if (el) el.remove();
  });
  ['twitter:card','twitter:title','twitter:description','twitter:image'].forEach(n => {
    const el = document.querySelector(`meta[name="${n}"]`);
    if (el) el.remove();
  });
};

// ─── social share URLs ──────────────────────────────────────────────────────
const buildShareUrl = (platform, article) => {
  const url   = encodeURIComponent(`${window.location.origin}${buildArticleUrl(article)}`);
  const title = encodeURIComponent(article.title);
  const img   = encodeURIComponent(article.image || '');

  switch (platform) {
    case 'facebook':
      // Facebook scrapes OG tags from the URL automatically
      return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    case 'twitter':
      return `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
    case 'whatsapp':
      return `https://wa.me/?text=${title}%20${url}`;
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    default:
      return null;
  }
};

// ─── Component ──────────────────────────────────────────────────────────────
const ArticleDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [article, setArticle]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [liked, setLiked]         = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const shareRef                  = useRef(null);

  // Live counters (optimistic)
  const [likeCount,  setLikeCount]  = useState(0);
  const [shareCount, setShareCount] = useState(0);
  const [viewCount,  setViewCount]  = useState(0);
  const [reactionPending, setReactionPending] = useState(false);

  // ── fetch article ──
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await publicClient.get(`/articles/${slug}`);
        if (mounted && data?.data) {
          const a = data.data;
          setArticle(a);
          setLikeCount(a.likeCount   || 0);
          setShareCount(a.shareCount || 0);
          setViewCount(a.views       || 0);

          const liked = JSON.parse(localStorage.getItem(`likedArticles:${getGuestId()}`) || '[]');
          setLiked(liked.includes(a._id));

          // Inject route-specific SEO metadata and schema so article keywords rank in search and social previews
          setArticleMetaTags(a);
          setupArticleSEO(a);
          injectOGMeta(a);
        } else {
          setError('Article not found');
        }
      } catch (err) {
        if (mounted) setError('Failed to load article. Please try again later.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
      cleanupMeta();
    };
  }, [slug]);

  // ── close share dropdown on outside click ──
  useEffect(() => {
    const handler = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target)) {
        setShareOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── like handler ──
  const handleLike = async () => {
    if (!article || reactionPending) return;

    // Optimistic update
    const wasLiked = liked;
    const guestId = getGuestId();
    const storageKey = `likedArticles:${guestId}`;
    setLiked(!wasLiked);
    setLikeCount(prev => wasLiked ? Math.max(0, prev - 1) : prev + 1);
    setReactionPending(true);

    try {
      if (wasLiked) {
        const { data } = await publicClient.delete(`/articles/${article._id}/like`, { data: { userId: guestId } });
        setLikeCount(data?.data?.likeCount ?? 0);
        const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
        localStorage.setItem(storageKey, JSON.stringify(stored.filter(aid => aid !== article._id)));
      } else {
        const { data } = await publicClient.post(`/articles/${article._id}/like`, { userId: guestId });
        setLikeCount(data?.data?.likeCount ?? 0);
        const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
        if (!stored.includes(article._id)) {
          stored.push(article._id);
          localStorage.setItem(storageKey, JSON.stringify(stored));
        }
      }
    } catch (err) {
      // Rollback on failure
      setLiked(wasLiked);
      setLikeCount(prev => wasLiked ? prev + 1 : Math.max(0, prev - 1));
      console.error('Error toggling like:', err);
    } finally {
      setReactionPending(false);
    }
  };

  // ── share handler ──
  const handleShare = async (platform) => {
    if (!article || reactionPending) return;
    setShareOpen(false);

    // Optimistic count bump
    setShareCount(prev => prev + 1);
    setReactionPending(true);

    // Track on backend
    try {
      const { data } = await publicClient.post(`/articles/${article._id}/share`);
      setShareCount(data?.data?.shareCount ?? 0);
    } catch (err) {
      setShareCount(prev => Math.max(0, prev - 1));
      console.error('Share tracking error:', err);
    } finally {
      setReactionPending(false);
    }

    // Open platform share window
    const shareUrl = buildShareUrl(platform, article);
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=500,noopener,noreferrer');
    }
  };

  // ── copy link ──
  const handleCopyLink = async () => {
    if (!article || reactionPending) return;
    const url = `${window.location.origin}${buildArticleUrl(article)}`;
    copyToClipboard(url);
    setShareOpen(false);
    setShareCount(prev => prev + 1);
    setReactionPending(true);
    try {
      const { data } = await publicClient.post(`/articles/${article._id}/share`);
      setShareCount(data?.data?.shareCount ?? 0);
    } catch (err) {
      setShareCount(prev => Math.max(0, prev - 1));
      console.error('Copy share tracking error:', err);
    } finally {
      setReactionPending(false);
    }
    alert('Link copied to clipboard!');
  };

  // ─── helpers ───
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      breaking:      'bg-red-100 text-red-800 border-red-200',
      politics:      'bg-blue-100 text-blue-800 border-blue-200',
      business:      'bg-green-100 text-green-800 border-green-200',
      technology:    'bg-purple-100 text-purple-800 border-purple-200',
      sports:        'bg-orange-100 text-orange-800 border-orange-200',
      entertainment: 'bg-pink-100 text-pink-800 border-pink-200',
      health:        'bg-yellow-100 text-yellow-800 border-yellow-200',
      world:         'bg-indigo-100 text-indigo-800 border-indigo-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // ─── Loading ───
  if (loading) return (
    <div className="flex flex-col min-h-screen bg-white">
      <UsersHeader />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-96 bg-gray-200 rounded" />
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => <div key={i} className="h-4 bg-gray-200 rounded" />)}
            </div>
          </div>
        </div>
      </main>
      <UsersFooter />
    </div>
  );

  // ─── Error ───
  if (error || !article) return (
    <div className="flex flex-col min-h-screen bg-white">
      <UsersHeader />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => navigate('/')} className="bg-red-600 hover:bg-red-700 text-white">
            Back to Home
          </Button>
        </div>
      </main>
      <UsersFooter />
    </div>
  );

  const articleUrl = `${window.location.origin}${buildArticleUrl(article)}`;

  // ─── Main Render ───
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <UsersHeader />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">

          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-red-600 transition font-medium group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          <article className="bg-white rounded-2xl shadow-lg overflow-hidden">

            {/* Hero Image */}
            {article.image && (
              <div className="relative w-full h-72 md:h-[480px] overflow-hidden bg-gray-200">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                {/* Category overlay */}
                {article.category && (
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getCategoryColor(article.category)}`}>
                      {article.category}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="p-6 md:p-10">

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {article.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-gray-100 mb-6">
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <span>By <strong className="text-gray-700">{article.author || 'Sidha Reporting'}</strong></span>
                  <span>•</span>
                  <span>{formatDate(article.publishedDate || article.createdAt)}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" /> {viewCount.toLocaleString()} views
                  </span>
                </div>

                {/* Like + Share */}
                <div className="flex items-center gap-2">
                  {/* Like button */}
                  <button
                    onClick={handleLike}
                    disabled={reactionPending}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
                      liked
                        ? 'bg-red-50 border-red-300 text-red-600 shadow-sm'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600'
                    }`}
                  >
                    <Heart className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} />
                    <span>{likeCount.toLocaleString()}</span>
                  </button>

                  {/* Share button + dropdown */}
                  <div className="relative" ref={shareRef}>
                    <button
                      onClick={() => setShareOpen(prev => !prev)}
                      disabled={reactionPending}
                      className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-all duration-200"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>{shareCount.toLocaleString()}</span>
                    </button>

                    {shareOpen && (
                      <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl p-2 z-50 w-52">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-1.5">Share via</p>

                        {[
                          { platform: 'facebook', label: 'Facebook',  icon: <Facebook className="w-4 h-4 text-blue-600" />,   hover: 'hover:bg-blue-50'  },
                          { platform: 'twitter',  label: 'Twitter / X', icon: <Twitter  className="w-4 h-4 text-sky-500" />,    hover: 'hover:bg-sky-50'   },
                          { platform: 'whatsapp', label: 'WhatsApp',  icon: <MessageCircle className="w-4 h-4 text-green-600" />, hover: 'hover:bg-green-50' },
                          { platform: 'linkedin', label: 'LinkedIn',  icon: <Linkedin className="w-4 h-4 text-blue-800" />,   hover: 'hover:bg-blue-50'  },
                        ].map(({ platform, label, icon, hover }) => (
                          <button
                            key={platform}
                            onClick={() => handleShare(platform)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 transition-colors ${hover}`}
                          >
                            {icon} {label}
                          </button>
                        ))}

                        <div className="border-t border-gray-100 my-1" />
                        <button
                          onClick={handleCopyLink}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Copy className="w-4 h-4 text-gray-500" /> Copy Link
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Summary callout */}
              {article.summary && (
                <div className="mb-7 p-5 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
                  <p className="text-base text-gray-700 italic leading-relaxed">{article.summary}</p>
                </div>
              )}

              {/* Body */}
              <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed
                              prose-headings:font-bold prose-headings:text-gray-900
                              prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline
                              prose-img:rounded-xl prose-blockquote:border-red-500
                              prose-strong:text-gray-900">
                {article.content
                  ? <div dangerouslySetInnerHTML={{ __html: article.content }} />
                  : <p className="text-gray-500">Content not available.</p>
                }
              </div>

              {/* Tags */}
              {article.tags && (
                <div className="mt-10 pt-6 border-t border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.split(',').map((tag, i) => (
                      <span key={i} className="bg-gray-100 hover:bg-red-50 hover:text-red-700 text-gray-600 px-3 py-1 rounded-full text-sm transition-colors cursor-pointer">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom share strip */}
              <div className="mt-10 pt-6 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-500 mb-3">Share this article</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { platform: 'facebook', label: 'Facebook',   bg: 'bg-blue-600 hover:bg-blue-700',  icon: <Facebook className="w-4 h-4" />        },
                    { platform: 'twitter',  label: 'Twitter / X', bg: 'bg-sky-500 hover:bg-sky-600',    icon: <Twitter  className="w-4 h-4" />         },
                    { platform: 'whatsapp', label: 'WhatsApp',   bg: 'bg-green-600 hover:bg-green-700', icon: <MessageCircle className="w-4 h-4" />   },
                    { platform: 'linkedin', label: 'LinkedIn',   bg: 'bg-blue-800 hover:bg-blue-900',  icon: <Linkedin className="w-4 h-4" />         },
                  ].map(({ platform, label, bg, icon }) => (
                    <button
                      key={platform}
                      onClick={() => handleShare(platform)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium transition-colors ${bg}`}
                    >
                      {icon} {label}
                    </button>
                  ))}
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Copy className="w-4 h-4" /> Copy Link
                  </button>
                </div>

                {/* Live stats strip */}
                <div className="flex gap-6 mt-5 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Eye  className="w-4 h-4 text-gray-400" />
                    <strong className="text-gray-700">{viewCount.toLocaleString()}</strong> views
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-red-400" fill="currentColor" />
                    <strong className="text-gray-700">{likeCount.toLocaleString()}</strong> likes
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Share2 className="w-4 h-4 text-blue-400" />
                    <strong className="text-gray-700">{shareCount.toLocaleString()}</strong> shares
                  </span>
                </div>
              </div>

            </div>
          </article>
        </div>
      </main>

      <UsersFooter />
    </div>
  );
};

export default ArticleDetail;