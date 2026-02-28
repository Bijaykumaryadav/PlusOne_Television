import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { publicClient } from '@/services/axiosInstance';

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await publicClient.get(`/articles/${id}`);
        if (mounted && data && data.data) setArticle(data.data);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch article', err);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  if (!article) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
      <div className="text-sm text-slate-500 mb-4">By {article.author} • {article.publishedDate ? new Date(article.publishedDate).toLocaleString() : ''}</div>
      {article.image && <img src={article.image} alt={article.title} className="w-full h-72 object-cover rounded mb-4" />}
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
    </div>
  );
};

export default ArticleDetail;
