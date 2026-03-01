import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/home/Header';
import Hero from '@/components/home/Hero';
import Footer from '@/components/home/Footer';
import RecentArticles from '@/components/home/RecentArticles';
import { publicClient } from '@/services/axiosInstance';
const Home = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    let mounted = true;
    const fetchArticles = async () => {
      try {
        const { data } = await publicClient.get('/articles?limit=6&page=1');
        if (mounted && data && data.data) {
          setArticles(data.data);
        }
      } catch (error) {
        // log error for visibility
      }
    };
    fetchArticles();
    return () => { mounted = false; };
  }, []);

  const topStories = [
    { title: 'Election Update: Vote counting continues across Nepal', category: 'Politics', time: '1h ago' },
    { title: 'Cricket: Sidha XI chase down target in thrilling finish', category: 'Sports', time: '2h ago' },
    { title: 'Markets open higher amid global optimism', category: 'Business', time: '3h ago' },
  ];

  const featured = [
    { title: 'Inside the campaign: what voters are saying', image: null, excerpt: 'Field reports and expert analysis from battleground districts.' },
    { title: 'Cricket: Player of the series shines in rain-affected match', image: null, excerpt: 'A match report and highlight reel.' },
  ];

  // contact form handling will be implemented later

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <section className="lg:col-span-2 space-y-6">
          {/* Breaking / Hero */}
          <Hero />

          {/* Top Stories (recent published articles) */}
          <RecentArticles articles={articles.length ? articles : topStories} />

          {/* Featured long reads */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Featured</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featured.map((f, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">{f.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-700">{f.excerpt}</p>
                    <div className="mt-4">
                      <Button variant="outline">Read full story</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Right column */}
        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Live Cricket</CardTitle>
              <CardDescription className="text-xs">Score updates & highlights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Sidha XI</div>
                  <div className="text-sm text-slate-500">120/7 (20 ov)</div>
                </div>
                <div className="text-sm text-slate-500">5.2 ov</div>
              </div>
              <div className="mt-3">
                <Button variant="ghost">Match Centre</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Election Ticker</CardTitle>
              <CardDescription className="text-xs">Latest district updates</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between"><span>Kathmandu</span><span className="text-slate-500">Counting</span></li>
                <li className="flex justify-between"><span>Lalitpur</span><span className="text-slate-500">In progress</span></li>
                <li className="flex justify-between"><span>Pokhara</span><span className="text-slate-500">Partial</span></li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Newsletter</CardTitle>
              <CardDescription className="text-xs">Get breaking news in your inbox</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Input placeholder="Your email" />
                <Button className="w-full bg-slate-900 text-white">Subscribe</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Button variant="ghost" className="justify-start">Nepal Elections</Button>
                <Button variant="ghost" className="justify-start">Cricket</Button>
                <Button variant="ghost" className="justify-start">World</Button>
                <Button variant="ghost" className="justify-start">Business</Button>
                <Button variant="ghost" className="justify-start">Technology</Button>
                <Button variant="ghost" className="justify-start">Opinion</Button>
              </div>
            </CardContent>
          </Card>
        </aside>
      </main>

      <Footer />
    </div>
  );
};

export default Home;