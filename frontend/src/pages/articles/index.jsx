import React, { useEffect, useState } from 'react';
import { publicClient } from '@/services/axiosInstance';
import RecentArticles from '@/components/home/RecentArticles';

const ArticlesList = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await publicClient.get('/articles?limit=12&page=1');
        if (mounted && data && data.data) setArticles(data.data);
      } catch (err) {
        // log to help debug fetch issues during development
        // eslint-disable-next-line no-console
        console.error('Failed to fetch articles', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Latest Articles</h1>
      <RecentArticles articles={articles} />
    </div>
  );
};

export default ArticlesList;
