'use client';

import {useState, useEffect} from 'react';
import {useTranslations} from 'next-intl';
import Image from 'next/image';

interface InstagramPost {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
  timestamp: string;
}

interface InstagramGalleryProps {
  accessToken?: string;
  limit?: number;
  className?: string;
}

// For static export, we'll use pre-fetched data or a fallback
export default function InstagramGallery({
  accessToken,
  limit = 12,
  className = '',
}: InstagramGalleryProps) {
  const t = useTranslations('portfolio');
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const token = accessToken || process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN;

      if (!token) {
        setError('Instagram access token not configured');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,permalink,caption,timestamp&limit=${limit}&access_token=${token}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch Instagram posts');
        }

        const data = await response.json();
        setPosts(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [accessToken, limit]);

  if (loading) {
    return (
      <div className={`instagram-gallery loading ${className}`}>
        <div className="gallery-grid">
          {Array.from({length: limit}).map((_, i) => (
            <div key={i} className="gallery-item skeleton" />
          ))}
        </div>
      </div>
    );
  }

  if (error || posts.length === 0) {
    // Fallback to placeholder gallery
    return (
      <div className={`instagram-gallery fallback ${className}`}>
        <div className="gallery-grid">
          {Array.from({length: limit}).map((_, i) => (
            <div key={i} className="gallery-item placeholder">
              <div className="placeholder-content">
                <span>Portfolio Image</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`instagram-gallery ${className}`}>
      <div className="gallery-grid">
        {posts.map((post) => (
          <div
            key={post.id}
            className="gallery-item"
          >
            <Image
              src={post.media_type === 'VIDEO' ? post.thumbnail_url || post.media_url : post.media_url}
              alt={post.caption?.slice(0, 100) || 'Auto detailing work'}
              width={300}
              height={300}
              className="gallery-image"
              loading="lazy"
            />
            {post.media_type === 'VIDEO' && (
              <div className="video-indicator">
                <PlayIcon />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}
