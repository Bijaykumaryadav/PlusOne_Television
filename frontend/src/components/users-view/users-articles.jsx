import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function FeaturedArticles({ articles, loading }) {
  return (
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
        : articles.map(article => (
            <Card
              key={article._id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="relative overflow-hidden h-40">
                <img
                  src={article.thumbnail}
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
  );
}