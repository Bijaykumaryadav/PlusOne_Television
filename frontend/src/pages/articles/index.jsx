import React, { useEffect, useState } from 'react';
import { publicClient } from '@/services/axiosInstance';
import { Link } from 'react-router-dom';
import UsersHeader from '@/components/users-view/users-header';
import UsersFooter from '@/components/users-view/users-footer';

const ArticlesList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await publicClient.get('/articles?limit=20&page=1');
        if (mounted && res.data && res.data.data) setArticles(res.data.data);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch articles', err);
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <UsersHeader />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Latest Articles</h1>
      {loading ? (
            <p>Loading...</p>
          ) : articles.length === 0 ? (
            <p>No articles found.</p>
          ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <Link
              to={`/articles/${article._id}`}
              key={article._id}
              className="block border rounded overflow-hidden hover:shadow"
            >
              <div className="h-48 w-full overflow-hidden bg-gray-100">
                {article.thumbnail || article.image ? (
                  <img
                    src={article.thumbnail || article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-lg mb-2">{article.title}</h2>
                <p className="text-sm text-gray-600 line-clamp-2">{article.summary || article.description || ''}</p>
              </div>
            </Link>
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
