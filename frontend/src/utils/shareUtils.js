// Share utilities for social media sharing

export const shareOnSocialMedia = (platform, article) => {
  const { title, _id } = article;
  const shareUrl = `${window.location.origin}/articles/${_id}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  let url = '';

  switch (platform.toLowerCase()) {
    case 'facebook':
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      break;
    case 'twitter':
      url = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
      break;
    case 'linkedin':
      url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
      break;
    case 'whatsapp':
      url = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
      break;
    case 'telegram':
      url = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
      break;
    case 'email':
      url = `mailto:?subject=${encodedTitle}&body=Check out this article: ${shareUrl}`;
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
