import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { publicClient } from '@/services/axiosInstance';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await publicClient.get('/articles/featured?limit=1');
        if (mounted && data && data.data && data.data.length) {
          setFeatured(data.data[0]);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load featured article', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (!featured) {
    return (
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase bg-red-600 inline-block px-2 py-1 rounded">Breaking</div>
              <h1 className="mt-4 text-3xl font-extrabold">SidhaReporting Live</h1>
              <p className="mt-2 text-slate-200 max-w-2xl">Stay tuned for breaking stories and featured reports.</p>
            </div>
            <div className="text-sm text-slate-200">
              <div className="mb-2">Live • Updated recently</div>
              <Button className="bg-white text-slate-900" size="sm">Live Dashboard</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-lg overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 items-center">
        {featured.image && (
          <div className="md:col-span-1 w-full h-48 overflow-hidden rounded">
            <img src={featured.image} alt={featured.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="md:col-span-2">
          <div className="text-xs uppercase bg-red-600 inline-block px-2 py-1 rounded">Featured</div>
          <h1 className="mt-4 text-3xl font-extrabold">{featured.title}</h1>
          <p className="mt-2 text-slate-200 max-w-2xl">{featured.summary}</p>
          <div className="mt-4">
            <Link to={`/articles/${featured._id}`} className="inline-block bg-white text-slate-900 px-4 py-2 rounded">Read full story</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
