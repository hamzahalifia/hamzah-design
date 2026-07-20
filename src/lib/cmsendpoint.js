const DEFAULT_CMS_BASE = 'https://hamzah-design-cms.onrender.com';
const DEFAULT_CMS_API_BASE = `${DEFAULT_CMS_BASE}/api`;

const CMS_API_BASE = import.meta.env.PUBLIC_PAYLOAD_API_URL || DEFAULT_CMS_API_BASE;
const CMS_BASE =
  import.meta.env.PUBLIC_PAYLOAD_BASE_URL ||
  (CMS_API_BASE ? CMS_API_BASE.replace(/\/api\/?$/, '') : DEFAULT_CMS_BASE);
const R2_ENDPOINT = import.meta.env.PUBLIC_R2_ENDPOINT || '';
const R2_BUCKET = import.meta.env.PUBLIC_R2_BUCKET || '';

function trimSlashes(value = '') {
  return value.replace(/^\/+|\/+$/g, '');
}

function joinUrlSegments(...segments) {
  const filtered = segments.filter(Boolean).map((segment, index) => {
    if (index === 0) return String(segment).replace(/\/+$/g, '');
    return trimSlashes(String(segment));
  });
  return filtered.join('/');
}

function buildR2MediaUrl(pathOrFilename) {
  if (!R2_ENDPOINT || !pathOrFilename) return null;

  const endpoint = R2_ENDPOINT.replace(/\/+$/g, '');
  const cleanedPath = trimSlashes(String(pathOrFilename));
  const normalizedBucket = trimSlashes(R2_BUCKET);

  if (!normalizedBucket) return `${endpoint}/${cleanedPath}`;
  if (endpoint.endsWith(`/${normalizedBucket}`)) return `${endpoint}/${cleanedPath}`;

  return joinUrlSegments(endpoint, normalizedBucket, cleanedPath);
}

function extractMediaFilename(url) {
  if (!url) return null;
  const pathname = url.startsWith('http') ? new URL(url).pathname : url;
  const filename = pathname.split('/').filter(Boolean).pop();
  return filename ? decodeURIComponent(filename) : null;
}

/** Resolve relative media URLs to absolute */
function resolveMediaUrl(media) {
  if (!media) return null;

  if (typeof media === 'string') {
    if (media.startsWith('http')) return media;
    if (R2_ENDPOINT) {
      const filename = extractMediaFilename(media);
      const r2Url = buildR2MediaUrl(filename || media);
      if (r2Url) return r2Url;
    }
    if (media.startsWith('/')) return `${CMS_BASE}${media}`;
    return buildR2MediaUrl(media) || `${CMS_BASE}/${trimSlashes(media)}`;
  }

  const fallbackPath =
    media.filename ||
    media.key ||
    media.path ||
    media.name ||
    extractMediaFilename(media.url);
  const r2Url = buildR2MediaUrl(fallbackPath);
  if (r2Url) return r2Url;

  const directUrl =
    media.url ||
    media.thumbnailURL ||
    media.thumbnailUrl ||
    media.sizes?.card?.url ||
    media.sizes?.tablet?.url ||
    media.sizes?.hero?.url;

  if (directUrl) {
    if (directUrl.startsWith('http')) return directUrl;
    if (directUrl.startsWith('/')) return `${CMS_BASE}${directUrl}`;
  }

  return null;
}

/** Resolve category relationship (returns name string or null) */
function resolveCategory(cat) {
  if (!cat) return null;
  if (typeof cat === 'string') return cat;
  return cat.name || cat.id || null;
}

function extractSortableYear(year) {
  if (typeof year === 'number' && Number.isFinite(year)) return year;
  if (typeof year === 'string') {
    const match = year.match(/\d{4}/);
    return match ? Number(match[0]) : Number.NEGATIVE_INFINITY;
  }
  return Number.NEGATIVE_INFINITY;
}

function sortCaseStudiesByYear(items) {
  return [...items].sort((a, b) => {
    const yearDiff = extractSortableYear(b.year) - extractSortableYear(a.year);
    if (yearDiff !== 0) return yearDiff;

    const publishedAtA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const publishedAtB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return publishedAtB - publishedAtA;
  });
}

function isPublishedCaseStudy(doc) {
  if (!doc) return false;

  // Handle draft status
  if (doc.status === 'draft') return false;

  // If status is 'publish-now', it is always published
  if (doc.status === 'publish-now') return true;

  // If status is 'schedule', it is published only if the scheduled time has passed
  if (doc.status === 'schedule') {
    if (!doc.publishedAt) return false;
    const publishedTime = new Date(doc.publishedAt).getTime();
    if (!Number.isFinite(publishedTime)) return false;
    return publishedTime <= Date.now();
  }

  // Fallback for old documents that do not have the status field yet
  if (doc._status && doc._status !== 'published') return false;
  if (!doc.publishedAt) return false;

  const publishedTime = new Date(doc.publishedAt).getTime();
  if (!Number.isFinite(publishedTime)) return false;

  return publishedTime <= Date.now();
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
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const body = await res.text();
      throw new Error(
        `Payload API returned ${contentType || 'unknown content type'} from ${url}: ${body.slice(0, 120)}`,
      );
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
  const docs = data.docs
    .filter(isPublishedCaseStudy)
    .map((doc) => ({
    _id: doc.id,
    title: doc.title,
    slug: doc.slug,
    description: doc.description,
    company: doc.company,
    year: doc.year,
    category: resolveCategory(doc.category),
    heroImage: resolveMediaUrl(doc.heroImage),
    featured: doc.featured || false,
    publishedAt: doc.publishedAt,
  }));
  return sortCaseStudiesByYear(docs);
}

/**
 * Fetch featured case studies (up to 4)
 */
export async function fetchFeaturedCaseStudies() {
  const data = await payloadFetch('/case-studies?where[featured][equals]=true&depth=1&sort=-publishedAt&limit=4');
  return data.docs
    .filter(isPublishedCaseStudy)
    .map((doc) => ({
    _id: doc.id,
    title: doc.title,
    slug: doc.slug,
    description: doc.description,
    heroImage: resolveMediaUrl(doc.heroImage),
    featured: true,
    publishedAt: doc.publishedAt,
  }));
}

/**
 * Fetch a single case study by slug
 */
export async function fetchSingleCaseStudy(slug, preview = false) {
  const draftParam = preview ? '&draft=true' : '';
  const data = await payloadFetch(`/case-studies?where[slug][equals]=${encodeURIComponent(slug)}&depth=2${draftParam}`);
  const doc = preview ? data.docs[0] : data.docs.find(isPublishedCaseStudy);
  if (!doc) {
    throw new Error(`Case study not found: ${slug}`);
  }
  return {
    _id: doc.id,
    title: doc.title,
    slug: doc.slug,
    description: doc.description,
    company: doc.company,
    liveWebsite: doc.liveWebsite || null,
    role: doc.role,
    year: doc.year,
    startDate: doc.startDate,
    endDate: doc.endDate,
    teamMembers: (doc.teamMembers || []).map(member => ({
        fullName: member.fullName,
        linkedinURL: member.linkedinURL,
        photo: resolveMediaUrl(member.photo)
    })),
    category: resolveCategory(doc.category),
    heroImage: resolveMediaUrl(doc.heroImage),
    logo: resolveMediaUrl(doc.logo),
    content: doc.content || null,
    seoTitle: doc.seoTitle || null,
    seoDescription: doc.seoDescription || null,
    ogImage: resolveMediaUrl(doc.ogImage),
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
  return data.docs
    .filter(isPublishedCaseStudy)
    .map((doc) => ({
    _id: doc.id,
    title: doc.title,
    slug: doc.slug,
    description: doc.description,
    heroImage: resolveMediaUrl(doc.heroImage),
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
    image: resolveMediaUrl(doc.image),
    videoFile: resolveMediaUrl(doc.videoFile),
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
    image: resolveMediaUrl(doc.image),
    videoFile: resolveMediaUrl(doc.videoFile),
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
      return fetchSingleCaseStudy(params.slug || query.slug, params.preview || false);
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
