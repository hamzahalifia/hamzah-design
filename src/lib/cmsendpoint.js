const CMS_API_BASE = import.meta.env.PUBLIC_PAYLOAD_API_URL || import.meta.env.VITE_CMS_API_URL || '';
const CMS_BASE = import.meta.env.PUBLIC_PAYLOAD_BASE_URL || import.meta.env.VITE_CMS_BASE_URL || (CMS_API_BASE ? CMS_API_BASE.replace('/api', '') : '');

/** Resolve relative media URLs to absolute */
function resolveMediaUrl(url) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${CMS_BASE}${url}`;
}

/** Resolve category relationship (returns name string or null) */
function resolveCategory(cat) {
  if (!cat) return null;
  if (typeof cat === 'string') return cat;
  return cat.name || cat.id || null;
}

/**
 * Generic fetch wrapper for Payload CMS REST API
 */
async function payloadFetch(endpoint, options = {}) {
  try {
    const url = `${CMS_API_BASE}${endpoint}`;
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Payload API error: ${res.status} — ${err}`);
    }
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch from Payload CMS:', err);
    throw err;
  }
}

/**
 * Fetch all case studies for the listing page
 */
export async function fetchCaseStudies() {
  const data = await payloadFetch('/case-studies?depth=1&sort=-publishedAt');
  return data.docs.map((doc) => ({
    _id: doc.id,
    title: doc.title,
    slug: doc.slug,
    description: doc.description,
    company: doc.company,
    year: doc.year,
    category: resolveCategory(doc.category),
    heroImage: resolveMediaUrl(doc.heroImage?.url),
    featured: doc.featured || false,
    publishedAt: doc.publishedAt,
  }));
}

/**
 * Fetch featured case studies (up to 4)
 */
export async function fetchFeaturedCaseStudies() {
  const data = await payloadFetch('/case-studies?where[featured][equals]=true&depth=1&sort=-publishedAt&limit=4');
  return data.docs.map((doc) => ({
    _id: doc.id,
    title: doc.title,
    slug: doc.slug,
    description: doc.description,
    heroImage: resolveMediaUrl(doc.heroImage?.url),
    featured: true,
    publishedAt: doc.publishedAt,
  }));
}

/**
 * Fetch a single case study by slug
 */
export async function fetchSingleCaseStudy(slug) {
  const data = await payloadFetch(`/case-studies?where[slug][equals]=${encodeURIComponent(slug)}&depth=2`);
  if (data.docs.length === 0) {
    throw new Error(`Case study not found: ${slug}`);
  }
  const doc = data.docs[0];
  return {
    _id: doc.id,
    title: doc.title,
    slug: doc.slug,
    description: doc.description,
    company: doc.company,
    role: doc.role,
    year: doc.year,
    startDate: doc.startDate,
    endDate: doc.endDate,
    teamMembers: (doc.teamMembers || []).map(member => ({
        fullName: member.fullName,
        linkedinURL: member.linkedinURL,
        photo: resolveMediaUrl(member.photo?.url)
    })),
    category: resolveCategory(doc.category),
    heroImage: resolveMediaUrl(doc.heroImage?.url),
    logo: resolveMediaUrl(doc.logo?.url),
    content: doc.content || null,
    seoTitle: doc.seoTitle || null,
    seoDescription: doc.seoDescription || null,
    ogImage: resolveMediaUrl(doc.ogImage?.url),
    canonicalURL: doc.canonicalURL || null,
    keywords: doc.keywords || null,
    publishedAt: doc.publishedAt,
  };
}

/**
 * Fetch related case studies, excluding the current one
 */
export async function fetchRelatedCaseStudies(currentId, currentSlug) {
  const data = await payloadFetch(
    `/case-studies?where[and][0][id][not_equals]=${encodeURIComponent(currentId)}&where[and][1][slug][not_equals]=${encodeURIComponent(currentSlug)}&depth=1&sort=-publishedAt&limit=3`
  );
  return data.docs.map((doc) => ({
    _id: doc.id,
    title: doc.title,
    slug: doc.slug,
    heroImage: resolveMediaUrl(doc.heroImage?.url),
    year: doc.year,
    publishedAt: doc.publishedAt,
  }));
}

/**
 * Fetch all explorations
 */
export async function fetchExplorations() {
  const data = await payloadFetch('/explorations?depth=1&sort=-createdAt&limit=100');
  return data.docs.map((doc) => ({
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    category: doc.category,
    description: doc.description,
    mediaType: doc.mediaType || 'image',
    image: resolveMediaUrl(doc.image?.url),
    videoFile: resolveMediaUrl(doc.videoFile?.url),
    videoEmbedUrl: doc.videoEmbedUrl || '',
    aspect_ratio: doc.aspectRatio || '1:1',
    keywords: doc.keywords || '',
    is_highlighted: doc.isHighlighted ? 1 : 0,
    created_at: doc.createdAt || doc.publishedAt,
  }));
}

/**
 * Fetch highlighted explorations
 */
export async function fetchHighlightedExplorations() {
  const data = await payloadFetch('/explorations?where[isHighlighted][equals]=true&depth=1&sort=-createdAt');
  return data.docs.map((doc) => ({
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    category: doc.category,
    description: doc.description,
    mediaType: doc.mediaType || 'image',
    image: resolveMediaUrl(doc.image?.url),
    videoFile: resolveMediaUrl(doc.videoFile?.url),
    videoEmbedUrl: doc.videoEmbedUrl || '',
    aspect_ratio: doc.aspectRatio || '1:1',
    keywords: doc.keywords || '',
    is_highlighted: 1,
    created_at: doc.createdAt || doc.publishedAt,
  }));
}

// Keep these as convenience wrappers to maintain compatibility with existing components.
// The component code imports these names; we provide equivalents using the new Payload fetchers.
export const CASE_STUDIES_QUERY = { type: 'case-studies' };
export const FEATURED_CASE_STUDIES_QUERY = { type: 'featured-case-studies' };
export function SINGLE_CASE_STUDY_QUERY(slug) {
  return { type: 'single-case-study', slug };
}
export function RELATED_CASE_STUDIES_QUERY(id, slug) {
  return { type: 'related-case-studies', id, slug };
}

/**
 * Main dispatcher: mimics the old `sanityFetch` signature for backward compatibility.
 * Components calling this will be routed to the appropriate Payload endpoint.
 */
export async function cmsFetch(query, params = {}) {
  switch (query.type) {
    case 'case-studies':
      return fetchCaseStudies();
    case 'featured-case-studies':
      return fetchFeaturedCaseStudies();
    case 'single-case-study':
      return fetchSingleCaseStudy(params.slug || query.slug);
    case 'related-case-studies':
      return fetchRelatedCaseStudies(params.id || query.id, params.slug || query.slug);
    case 'explorations':
      return fetchExplorations();
    case 'highlighted-explorations':
      return fetchHighlightedExplorations();
    default:
      throw new Error(`Unknown query type: ${query.type}`);
  }
}
