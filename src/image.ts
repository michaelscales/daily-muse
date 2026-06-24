import { config } from './config.js';

export interface ReferenceImage {
  url: string;
  photographerName: string;
  photographerUrl: string;
}

export async function fetchImage(keyword: string): Promise<ReferenceImage> {
  const endpoint = new URL('https://api.unsplash.com/search/photos');
  endpoint.searchParams.set('query', keyword);
  endpoint.searchParams.set('orientation', 'landscape');
  endpoint.searchParams.set('per_page', '20');
  endpoint.searchParams.set('content_filter', 'high');

  const res = await fetch(endpoint, {
    headers: { Authorization: `Client-ID ${config.unsplashAccessKey}` },
  });
  if (!res.ok) throw new Error(`Unsplash failed: ${res.status} ${res.statusText}`);

  const data = await res.json();
  if (!data.results?.length) throw new Error(`No image results for: ${keyword}`);

  const photo = data.results[Math.floor(Math.random() * data.results.length)];

  if (photo.links?.download_location) {
    await fetch(photo.links.download_location, {
      headers: { Authorization: `Client-ID ${config.unsplashAccessKey}` },
    }).catch(() => {});
  }

  const ref = '?utm_source=daily_muse&utm_medium=referral';
  return {
    url: photo.urls.regular,
    photographerName: photo.user.name,
    photographerUrl: `${photo.user.links.html}${ref}`,
  };
}
