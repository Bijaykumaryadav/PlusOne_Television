import { useEffect, useState } from 'react';
import { publicClient } from '@/services/axiosInstance';

export default function AdSlot({ position, fallbackPosition, variant = 'card', className = '' }) {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    let active = true;
    publicClient.get(`/ads/position/${position}`)
      .then(({ data }) => {
        const primaryAds = data?.data || [];
        if (!active) return;
        if (primaryAds.length || !fallbackPosition) {
          setAds(primaryAds);
          return;
        }
        return publicClient.get(`/ads/position/${fallbackPosition}`).then(({ data: fallbackData }) => {
          if (active) setAds(fallbackData?.data || []);
        });
      })
      .catch((error) => console.error(`Failed to load ${position} ads`, error));
    return () => {
      active = false;
    };
  }, [position, fallbackPosition]);

  useEffect(() => {
    ads.forEach((ad) => {
      if (ad?._id) publicClient.put(`/ads/${ad._id}/view`).catch(() => {});
    });
  }, [ads]);

  if (!ads.length) return null;
  const isLinked = (ad) => /^https?:\/\//i.test(ad.linkUrl || '');
  const isHeader = variant === 'header';

  return (
    <section className={className} aria-label="Sponsored content">
      <div className={isHeader ? 'mx-auto flex max-w-5xl flex-wrap gap-3' : 'space-y-4'}>
        {ads.map((ad) => {
          const content = (
            <>
              {ad.imageUrl ? (
                <img
                  src={ad.imageUrl}
                  alt={ad.title}
                  className={isHeader
                    ? 'h-16 w-40 shrink-0 object-contain'
                    : 'max-h-72 w-full bg-slate-50 object-contain'}
                />
              ) : null}
              <div className={isHeader ? 'min-w-0 flex-1 py-2' : 'p-4'}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">Sponsored</span>
                <h3 className="truncate text-sm font-semibold text-slate-900">{ad.title}</h3>
                {(ad.description || ad.bannerText) ? (
                  <p className="mt-1 line-clamp-2 text-xs text-slate-600">{ad.description || ad.bannerText}</p>
                ) : null}
              </div>
            </>
          );
          const className = isHeader
            ? 'flex min-h-24 min-w-0 flex-1 basis-80 items-center gap-5 border-x border-slate-200 bg-white px-5 py-3'
            : 'block overflow-hidden rounded-md border border-slate-200 bg-white';

          return isLinked(ad) ? (
            <a
              key={ad._id}
              href={ad.linkUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              onClick={() => publicClient.put(`/ads/${ad._id}/click`).catch(() => {})}
              className={`${className} hover:border-slate-300 hover:bg-slate-50`}
            >
              {content}
            </a>
          ) : (
            <div key={ad._id} className={className}>
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}