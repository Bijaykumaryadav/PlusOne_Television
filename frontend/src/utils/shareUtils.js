// Share utilities for social media sharing with dynamic article metadata

// Update article share count and metadata
export const recordShareCount = async (articleId, platform, client) => {
  try {
    await client.put(`/articles/${articleId}/share`, {
      platform,
      sharedAt: new Date(),
    });
  } catch (error) {
    console.error('Error recording share:', error);
  }
};

// Enhance meta tags for better social media preview
export const setArticleMetaTags = (article) => {
  if (!article) return;

  const { title, summary, image, _id, category, author } = article;
  const url = `${window.location.origin}/articles/${_id}`;

  // Update Open Graph meta tags
  updateMetaTag('og:title', title);
  updateMetaTag('og:description', summary);
  updateMetaTag('og:image', image);
  updateMetaTag('og:url', url);
  updateMetaTag('og:type', 'article');

  // Update Twitter Card meta tags
  updateMetaTag('twitter:title', title);
  updateMetaTag('twitter:description', summary);
  updateMetaTag('twitter:image', image);
  updateMetaTag('twitter:card', 'summary_large_image');

  // Update article-specific meta tags
  updateMetaTag('article:published_time', new Date(article.publishedDate).toISOString());
  updateMetaTag('article:author', author);
  updateMetaTag('article:section', category);
  
  // Update page title and description
  document.title = `${title} | Sidha Reporting`;
  updateMetaTag('description', summary);
  updateMetaTag('keywords', `${category}, ${author}, news, ${title}`);
};

// Helper to update or create meta tags
const updateMetaTag = (name, content) => {
  let tag = document.querySelector(`meta[property="${name}"], meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    if (name.startsWith('og:') || name.startsWith('article:')) {
      tag.setAttribute('property', name);
    } else {
      tag.setAttribute('name', name);
    }
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

export const shareOnSocialMedia = async (platform, article, client) => {
  const { title, summary, image, _id } = article;
  const shareUrl = `${window.location.origin}/articles/${_id}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedSummary = encodeURIComponent(summary || title);
  const encodedImage = encodeURIComponent(image);

  // Record share before opening
  if (client) {
    recordShareCount(_id, platform, client);
  }

  let url = '';

  switch (platform.toLowerCase()) {
    case 'facebook':
      // Facebook will use OG meta tags from the page
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`;
      break;
    case 'twitter':
      url = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&via=SidhaReporting`;
      break;
    case 'linkedin':
      url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
      break;
    case 'whatsapp':
      url = `https://wa.me/?text=${encodedTitle}%0A${encodedSummary}%0A${encodedUrl}`;
      break;
    case 'telegram':
      url = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}%0A${encodedSummary}`;
      break;
    case 'email':
      url = `mailto:?subject=${encodedTitle}&body=${encodedSummary}%0A%0A${shareUrl}`;
      break;
    default:
      return;
  }

  if (platform.toLowerCase() === 'email') {
    window.location.href = url;
  } else {
    window.open(url, '_blank', 'width=600,height=400');
  }
};

export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    return true;
  }).catch(err => {
    console.error('Failed to copy:', err);
    return false;
  });
};

export const getLikesFromLocalStorage = (articleId) => {
  try {
    const likes = localStorage.getItem('article_likes');
    if (!likes) return { liked: false, count: 0 };
    const likesObj = JSON.parse(likes);
    return likesObj[articleId] || { liked: false, count: 0 };
  } catch (e) {
    console.error('Error getting likes from localStorage:', e);
    return { liked: false, count: 0 };
  }
};

export const toggleLike = (articleId) => {
  try {
    let likes = {};
    const existingLikes = localStorage.getItem('article_likes');
    if (existingLikes) {
      likes = JSON.parse(existingLikes);
    }

    if (!likes[articleId]) {
      likes[articleId] = { liked: false, count: 0 };
    }

    likes[articleId].liked = !likes[articleId].liked;
    if (likes[articleId].liked) {
      likes[articleId].count += 1;
    } else {
      likes[articleId].count = Math.max(0, likes[articleId].count - 1);
    }

    localStorage.setItem('article_likes', JSON.stringify(likes));
    return likes[articleId];
  } catch (e) {
    console.error('Error toggling like:', e);
    return { liked: false, count: 0 };
  }
};
