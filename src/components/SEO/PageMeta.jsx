import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function PageMeta({
  title = 'Alifia Hamzah — Product Designer',
  description = 'Portfolio of Alifia Hamzah, Product Designer specializing in data-driven enterprise tools and story-data approach.',
  keywords = 'product designer, UI/UX, portfolio, enterprise design, data-driven, Alifia Hamzah',
  ogImage = '/images/general/profilephoto.webp',
  canonical = 'https://hamzah.design',
  schema = null,
}) {
  return (
    <Helmet>
      {/* Primary Meta */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Alifia Hamzah" />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content="Alifia Hamzah Design Portfolio" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:creator" content="@hamzahalifia" />

      {/* Schema.org JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}