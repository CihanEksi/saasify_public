"use client";
import React, { useEffect } from 'react';
import { useLink } from '@/hooks/useLink';
import { useRouter } from 'next/navigation';

interface GoPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default function GoPage({ params }: GoPageProps) {
  const unwrappedParams = React.use(params);
  const { slug } = unwrappedParams;
  const shortLink = "/" + slug.join('/');
  const { getQuery } = useLink();
  const router = useRouter();

  const { data: linkData, error, isLoading } = getQuery({
    short: shortLink,
    id: "",
    page: 1,
    limit: 1,
    keyword: "",
  });

  useEffect(() => {
    if (!isLoading && linkData) {
      if (!linkData.data || linkData.data.length === 0) {
        router.push("/404");
      } else {
        const longUrl = linkData.data[0].long;
        const status = linkData.data[0].status;

        if (status === 'inactive') {
          return router.push("/404");
        }

        if (longUrl) {
          const urlToNavigate = longUrl.startsWith('http') ? longUrl : `https://${longUrl}`;
          window.location.href = urlToNavigate;
        }
      }
    }
  }, [linkData, isLoading, router]);

  if (isLoading) {
    return <div
      className='flex items-center justify-center h-screen'>
      <div className="loader text-4xl">Redirecting...</div>
    </div>;
  }

  return (
    <div
      className='flex items-center justify-center h-screen'>
      <div className="loader text-4xl">Redirecting...</div>
    </div>
  );
}