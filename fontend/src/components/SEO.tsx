import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  type?: string;
  jsonLd?: Record<string, any>;
}

export function SEO({ 
  title, 
  description = "Hệ thống quản lý chuỗi quán cafe Trung Nguyên - Giải pháp quản lý toàn diện, hiện đại.", 
  type = "website", 
  jsonLd 
}: SEOProps) {
  return (
    <Helmet>
      <title>{title} | Trung Nguyên Cafe</title>
      <meta name="description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
