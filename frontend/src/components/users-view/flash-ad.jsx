import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { publicClient } from '@/services/axiosInstance';

const SESSION_KEY = 'sidhaFlashAdShown';

export default function FlashAd() {
  const [ad, setAd] = useState(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.startsWith('/admin') || pathname.startsWith('/auth/admin')) return;
    if (window.sessionStorage.getItem(SESSION_KEY)) return;

    let active = true;
    publicClient.get('/ads/position/flash')
      .then(({ data }) => {
        const firstAd = data?.data?.[0];
        if (active && firstAd) {
          window.sessionStorage.setItem(SESSION_KEY, '1');
          setAd(firstAd);
          if (firstAd._id) publicClient.put(`/ads/${firstAd._id}/view`).catch(() => {});
        }
      })
      .catch((error) => console.error('Failed to load flash ad', error));

    return () => {
      active = false;
    };
  }, [pathname]);

  if (!ad) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) setAd(null);
    }}>
      <section role="dialog" aria-modal="true" aria-label={ad.title} className="relative max-h-[90vh] w-full max-w-3xl overflow-auto rounded-md bg-white p-5 shadow-2xl">
        <button type="button" onClick={() => setAd(null)} aria-label="Close advertisement" className="absolute right-3 top-3 z-10 rounded-full bg-white p-2 text-slate-700 shadow hover:bg-slate-100">
          <X className="h-5 w-5" />
        </button>
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-red-600">Sponsored</p>
        <h2 className="mb-4 pr-10 text-xl font-semibold text-slate-900">{ad.title}</h2>
        {ad.imageUrl ? (
          ad.linkUrl ? (
            <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer sponsored" onClick={() => publicClient.put(`/ads/${ad._id}/click`).catch(() => {})}>
              <img src={ad.imageUrl} alt={ad.title} className="mx-auto max-h-[60vh] w-full object-contain" />
            </a>
          ) : (
            <img src={ad.imageUrl} alt={ad.title} className="mx-auto max-h-[60vh] w-full object-contain" />
          )
        ) : null}
        {ad.description || ad.bannerText ? <p className="mt-4 text-sm text-slate-600">{ad.description || ad.bannerText}</p> : null}
        {ad.linkUrl ? (
          <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer sponsored" onClick={() => publicClient.put(`/ads/${ad._id}/click`).catch(() => {})} className="mt-4 inline-flex rounded-sm bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800">
            Visit advertiser
          </a>
        ) : null}
      </section>
    </div>
  );
}