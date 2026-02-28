import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const RecentArticles = ({ articles = [] }) => {
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {articles.map((a, i) => (
        <Card key={a._id || i} className="hover:shadow-md">
          {a.image && (
            <div className="w-full h-44 overflow-hidden">
              <img src={a.image} alt={a.title} className="w-full h-full object-cover" />
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-base font-bold">
              <Link to={`/articles/${a._id}`}>{a.title}</Link>
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">{a.category} • {a.publishedDate ? new Date(a.publishedDate).toLocaleString() : ''}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-700">{a.summary || a.excerpt || ''}</p>
            <div className="mt-2">
              <Link to={`/articles/${a._id}`} className="text-sm text-sky-600">Read more →</Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RecentArticles;
