import React, { isValidElement } from 'react';
import YouTubeEmbed from './YouTubeEmbed';
import CustomVideoPlayer from './CustomVideoPlayer';
import ToggleList from './ToggleList';

/**
 * Render Payload CMS Lexical rich text JSON to React elements.
 */
const IS_BOLD = 1;
const IS_ITALIC = 2;
const IS_STRIKETHROUGH = 4;
const IS_UNDERLINE = 8;
const IS_CODE = 16;
const IS_SUBSCRIPT = 32;
const IS_SUPERSCRIPT = 64;

const CMS_BASE =
  import.meta.env.PUBLIC_PAYLOAD_BASE_URL ||
  'https://hamzah-design-cms.onrender.com';
const R2_ENDPOINT = import.meta.env.PUBLIC_R2_ENDPOINT || '';
const R2_BUCKET = import.meta.env.PUBLIC_R2_BUCKET || '';

function trimSlashes(value = '') {
  return value.replace(/^\/+|\/+$/g, '');
}

function buildR2MediaUrl(pathOrFilename) {
  if (!R2_ENDPOINT || !pathOrFilename) return null;

  const endpoint = R2_ENDPOINT.replace(/\/+$/g, '');
  const cleanedPath = trimSlashes(String(pathOrFilename));
  const normalizedBucket = trimSlashes(R2_BUCKET);

  if (!normalizedBucket) return `${endpoint}/${cleanedPath}`;
  if (endpoint.endsWith(`/${normalizedBucket}`)) return `${endpoint}/${cleanedPath}`;

  return `${endpoint}/${normalizedBucket}/${cleanedPath}`;
}

function extractMediaFilename(url) {
  if (!url) return null;
  const pathname = url.startsWith('http') ? new URL(url).pathname : url;
  const filename = pathname.split('/').filter(Boolean).pop();
  return filename ? decodeURIComponent(filename) : null;
}

function toAbsoluteUrl(url) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  if (R2_ENDPOINT) {
    const filename = extractMediaFilename(url);
    const r2Url = buildR2MediaUrl(filename || url);
    if (r2Url) return r2Url;
  }
  if (url.startsWith('/')) return `${CMS_BASE}${url}`;
  return buildR2MediaUrl(url) || `${CMS_BASE}/${trimSlashes(url)}`;
}

function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== '');
}

function getMediaUrl(media) {
  const fallbackPath =
    media?.filename ||
    media?.key ||
    media?.path ||
    media?.name ||
    extractMediaFilename(media?.url);
  const r2Url = buildR2MediaUrl(fallbackPath);
  if (r2Url) return r2Url;

  return toAbsoluteUrl(
    firstDefined(media?.url, media?.filename, media?.src, media?.file?.url),
  );
}

function extractNodeText(node) {
  if (!node) return '';
  if (node.type === 'text') return node.text || '';
  if (Array.isArray(node.children)) {
    return node.children.map(extractNodeText).join(' ');
  }
  return '';
}

function normalizeEmbedUrl(url, kind) {
  if (!url) return null;

  if (kind === 'figma') {
    return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`;
  }

  if (kind === 'loom') {
    if (url.includes('/embed/')) return url;
    return url.replace('/share/', '/embed/');
  }

  return url;
}

function renderEmbedCard({ key, title, description, href, icon, meta }) {
  if (!href) return null;

  return (
    <a
      key={key}
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="not-prose my-6 flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-5 no-underline shadow-sm transition-colors hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700 dark:hover:bg-neutral-900"
    >
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
        <span className="text-lg">{icon}</span>
      </div>
      <div className="min-w-0 flex-1">
        {meta ? (
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">
            {meta}
          </div>
        ) : null}
        <div className="truncate text-base font-semibold text-neutral-900 dark:text-white">
          {title || href}
        </div>
        {description ? (
          <p className="mt-1 mb-0 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
            {description}
          </p>
        ) : null}
        <div className="mt-3 truncate text-sm text-blue-600 dark:text-blue-400">
          {href}
        </div>
      </div>
    </a>
  );
}

function renderIframeEmbed({ key, url, caption, title, isCustomIframe }) {
  if (!url) return null;

  return (
    <figure key={key} className="not-prose my-8">
      <div
        className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: isCustomIframe ? '4 / 3' : undefined,
        }}
      >
        <iframe
          src={url}
          title={title}
          loading="lazy"
          allowFullScreen
          className="w-full border-0"
          style={{
            margin: 0,
            border: 'none',
            borderRadius: 0,
            position: isCustomIframe ? 'absolute' : 'relative',
            top: 0,
            left: 0,
            width: '100%',
            height: isCustomIframe ? 'calc(100% + 60px)' : '100%',
            aspectRatio: isCustomIframe ? undefined : '16 / 9',
          }}
        />
      </div>
      {caption ? (
        <figcaption className="mt-2 text-center text-sm text-neutral-500 dark:text-neutral-400">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function renderCallout({ key, fields, children }) {
  const variant = firstDefined(fields?.style, fields?.variant, fields?.tone, 'default');
  const title = firstDefined(fields?.title, fields?.heading, fields?.label);
  const icon = firstDefined(fields?.icon, fields?.emoji);
  const body =
    fields?.content?.root?.children ||
    fields?.content?.children ||
    fields?.body?.root?.children ||
    fields?.body?.children ||
    children;

  const palette = {
    default:
      'border-neutral-200 bg-neutral-50 text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900/70 dark:text-neutral-100',
    info:
      'border-sky-200 bg-sky-50 text-sky-950 dark:border-sky-900/70 dark:bg-sky-950/40 dark:text-sky-100',
    success:
      'border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-100',
    warning:
      'border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-100',
    danger:
      'border-rose-200 bg-rose-50 text-rose-950 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-100',
  };

  return (
    <aside
      key={key}
      className={`not-prose my-8 rounded-2xl border p-5 ${palette[variant] || palette.default}`}
    >
      {(icon || title) ? (
        <div className="mb-3 flex items-center gap-3">
          {icon ? (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/70 text-lg dark:bg-black/20">
              {icon}
            </div>
          ) : null}
          {title ? <div className="text-base font-semibold">{title}</div> : null}
        </div>
      ) : null}
      <div className="case-study-callout-content text-sm leading-relaxed">
        {Array.isArray(body) ? renderChildren(body, `${key}-callout`) : null}
      </div>
    </aside>
  );
}

function renderToggle({ key, node }) {
  const title =
    firstDefined(
      node.fields?.title,
      node.fields?.label,
      node.label,
      extractNodeText(node.title),
    ) || 'Details';
  const contentNodes =
    node.fields?.content?.root?.children ||
    node.fields?.content?.children ||
    node.children ||
    [];

  return (
    <details
      key={key}
      className="not-prose my-5 overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"
    >
      <summary className="cursor-pointer list-none px-5 py-4 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-50 dark:text-neutral-100 dark:hover:bg-neutral-900">
        <div className="flex items-center justify-between gap-4">
          <span>{title}</span>
          <span className="text-neutral-400">+</span>
        </div>
      </summary>
      <div className="border-t border-neutral-200 px-5 py-4 text-sm text-neutral-700 dark:border-neutral-800 dark:text-neutral-300">
        {renderChildren(contentNodes, `${key}-toggle`)}
      </div>
    </details>
  );
}

function renderBlockNode(node, key) {
  const fields = node.fields || {};
  const blockType = fields.blockType;

  if (blockType === 'video') {
    const video = firstDefined(fields.video, fields.videoFile, fields.file);
    const caption = firstDefined(fields.caption, fields.description);
    const videoUrl = getMediaUrl(video);
    if (!videoUrl) return null;

    const videoChapters = (video?.chapters || []).map((chapter) => ({
      title: chapter.title,
      time:
        chapter.start_timecode !== undefined
          ? chapter.start_timecode
          : (chapter.time || 0),
    }));

    return (
      <figure key={key} className="my-8">
        <div className="relative aspect-video overflow-hidden rounded-lg bg-neutral-100 shadow-lg dark:bg-neutral-900">
          <CustomVideoPlayer
            src={videoUrl}
            chapters={videoChapters}
            className="w-full aspect-video"
          />
        </div>
        {caption ? (
          <figcaption className="mt-2 text-center text-sm text-neutral-500 dark:text-neutral-400">
            {caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  if (blockType === 'youtube-embed') {
    const url = firstDefined(fields.url, fields.videoUrl);
    const caption = firstDefined(fields.caption, fields.description);
    const aspectRatio = firstDefined(fields.aspectRatio, fields.aspect_ratio);
    if (!url) return null;
    return (
      <YouTubeEmbed
        key={key}
        url={url}
        caption={caption}
        aspectRatio={aspectRatio}
      />
    );
  }

  if (blockType === 'audio') {
    const audio = firstDefined(fields.audio, fields.file, fields.audioFile);
    const audioUrl = getMediaUrl(audio);
    const caption = firstDefined(fields.caption, fields.description, audio?.alt);
    if (!audioUrl) return null;

    return (
      <figure
        key={key}
        className="not-prose my-8 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
      >
        <audio controls preload="metadata" className="w-full" src={audioUrl}>
          Your browser does not support the audio element.
        </audio>
        {caption ? (
          <figcaption className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
            {caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  if (blockType === 'file') {
    const file = firstDefined(fields.file, fields.asset, fields.document);
    const href = getMediaUrl(file);
    return renderEmbedCard({
      key,
      href,
      title: firstDefined(fields.title, file?.alt, file?.filename, 'Download file'),
      description: firstDefined(fields.description, fields.caption),
      icon: 'FILE',
      meta: file?.mimeType || 'Attachment',
    });
  }

  if (blockType === 'web-bookmark') {
    return renderEmbedCard({
      key,
      href: firstDefined(fields.url, fields.href),
      title: firstDefined(fields.title, fields.siteName),
      description: firstDefined(fields.description, fields.caption),
      icon: 'LINK',
      meta: 'Web bookmark',
    });
  }

  if (blockType === 'figma-prototype') {
    const sourceUrl = firstDefined(fields.url, fields.href, fields.prototypeUrl);
    return renderIframeEmbed({
      key,
      url: normalizeEmbedUrl(sourceUrl, 'figma'),
      caption: firstDefined(fields.caption, fields.description),
      title: firstDefined(fields.title, 'Figma prototype'),
    });
  }

  if (blockType === 'loom-video') {
    const sourceUrl = firstDefined(fields.url, fields.href, fields.videoUrl);
    return renderIframeEmbed({
      key,
      url: normalizeEmbedUrl(sourceUrl, 'loom'),
      caption: firstDefined(fields.caption, fields.description),
      title: firstDefined(fields.title, 'Loom video'),
    });
  }

  if (blockType === 'toggle-list') {
    const { title, content } = fields || {};
    return (
      <ToggleList
        key={key}
        title={title}
        content={content?.root?.children || content?.children}
        renderChildren={renderChildren}
        parentKey={key}
      />
    );
  }

  if (blockType === 'custom-iframe-embed') {
    const sourceUrl = firstDefined(fields.url, fields.href, fields.embedUrl);
    return renderIframeEmbed({
      key,
      url: sourceUrl,
      caption: firstDefined(fields.caption, fields.description),
      title: firstDefined(fields.title, 'Embedded content'),
      isCustomIframe: true,
    });
  }

  if (blockType === 'callout') {
    return renderCallout({ key, fields, children: node.children });
  }

  return null;
}

function resolveTextNode(node, index) {
  if (!node || !node.text) return null;
  let { text, format = 0 } = node;
  let children = text;

  if (format & IS_BOLD) children = <strong key={`b-${index}`}>{children}</strong>;
  if (format & IS_ITALIC) children = <em key={`i-${index}`}>{children}</em>;
  if (format & IS_STRIKETHROUGH) children = <s key={`s-${index}`}>{children}</s>;
  if (format & IS_UNDERLINE) children = <u key={`u-${index}`}>{children}</u>;
  if (format & IS_CODE) children = <code key={`c-${index}`} className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-sm font-mono text-rose-600 dark:text-rose-400 break-words">{children}</code>;
  if (format & IS_SUBSCRIPT) children = <sub key={`sub-${index}`}>{children}</sub>;
  if (format & IS_SUPERSCRIPT) children = <sup key={`sup-${index}`}>{children}</sup>;

  return isValidElement(children) ? children : <React.Fragment key={`t-${index}`}>{children}</React.Fragment>;
}

function renderLexicalNode(node, key) {
  if (!node) return null;

  const { type, format: align } = node;
  const style = align ? { textAlign: align } : {};

  switch (type) {
    case 'root':
      return renderChildren(node.children, key);

    case 'paragraph':
      return <p key={key} className="mb-5 leading-relaxed break-words" style={style}>{renderChildren(node.children, key)}</p>;

    case 'heading': {
      const { tag } = node;
      const Tag = tag || 'h2';
      const sizeMap = {
        h1: 'text-4xl font-bold my-4', h2: 'text-3xl font-bold my-3', h3: 'text-2xl font-bold my-2',
        h4: 'text-xl font-semibold my-2', h5: 'text-lg font-semibold my-1', h6: 'text-base font-semibold my-1',
      };
      return <Tag key={key} className={sizeMap[Tag] || sizeMap.h2} style={style}>{renderChildren(node.children, key)}</Tag>;
    }

    case 'quote':
      return <blockquote key={key} className="border-l-4 border-neutral-300 dark:border-neutral-600 pl-4 italic my-4 text-neutral-600 dark:text-neutral-400" style={style}>{renderChildren(node.children, key)}</blockquote>;

    case 'list': {
      const { listType, tag: listTag } = node;
      const ListTag = listTag === 'ol' || listType === 'number' ? 'ol' : 'ul';
      const listClass = ListTag === 'ol' ? 'list-decimal pl-6 mb-5 space-y-1.5 [&>li]:break-words' : 'list-disc pl-6 mb-5 space-y-1.5 [&>li]:break-words';
      return <ListTag key={key} className={listClass} start={node.start} style={style}>{renderChildren(node.children, key)}</ListTag>;
    }

    case 'listitem': {
      const hasOnlyLists = node.children && node.children.length > 0 && node.children.every(child => 
        child.type === 'list' || (child.type === 'text' && !child.text?.trim())
      );
      const combinedStyle = hasOnlyLists 
        ? { ...style, listStyleType: 'none', paddingLeft: '0', marginTop: '0', marginBottom: '0', display: 'block' }
        : style;
      return (
        <li key={key} className="mb-1.5 leading-relaxed" style={combinedStyle}>
          {renderChildren(node.children, key)}
        </li>
      );
    }

    case 'link': {
      const url = node.fields?.url || node.fields?.href || '';
      const newTab = node.fields?.newTab === true;
      const rel = !url.startsWith('/') ? 'noreferrer noopener' : undefined;
      return <a key={key} href={url} target={newTab ? '_blank' : undefined} rel={rel} className="text-blue-500 hover:underline">{renderChildren(node.children, key)}</a>;
    }

    case 'block': {
      return renderBlockNode(node, key);
    }

    case 'upload': {
      const media = node.value;
      const fullUrl = getMediaUrl(media);
      if (!fullUrl) return null;

      if (media?.mimeType?.startsWith('audio/')) {
        return (
          <figure
            key={key}
            className="not-prose my-8 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
          >
            <audio controls preload="metadata" className="w-full" src={fullUrl}>
              Your browser does not support the audio element.
            </audio>
            {media?.alt ? (
              <figcaption className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
                {media.alt}
              </figcaption>
            ) : null}
          </figure>
        );
      }

      if (media?.mimeType && !media.mimeType.startsWith('image/')) {
        return renderEmbedCard({
          key,
          href: fullUrl,
          title: firstDefined(media?.alt, media?.filename, 'Download file'),
          description: media?.mimeType,
          icon: 'FILE',
          meta: 'Attachment',
        });
      }

      return (
        <figure key={key} className="my-6">
          <img src={fullUrl} alt={media.alt || ''} loading="lazy" className="rounded-lg shadow-lg w-full" />
          {media.alt && <figcaption className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 text-center">{media.alt}</figcaption>}
        </figure>
      );
    }

    case 'autolink': {
        const url = node.fields?.url || '';
        const rel = !url.startsWith('/') ? 'noreferrer noopener' : undefined;
        return <a key={key} href={url} rel={rel} className="text-blue-500 hover:underline">{renderChildren(node.children, key)}</a>;
    }

    case 'horizontalrule':
      return <hr key={key} className="my-8 border-neutral-200 dark:border-neutral-800" />;

    case 'linebreak':
      return <br key={key} />;

    case 'collapsible':
    case 'details':
    case 'toggle':
    case 'toggle-list':
      return renderToggle({ key, node });

    case 'text':
      return resolveTextNode(node, key);

    default:
      return node.children?.length ? <React.Fragment key={key}>{renderChildren(node.children, key)}</React.Fragment> : null;
  }
}

function renderChildren(children, parentKey) {
  if (!Array.isArray(children)) return null;
  return children.map((child, idx) => renderLexicalNode(child, `${parentKey}-${idx}`));
}

export default function LexicalRenderer({ content }) {
  if (!content) return null;
  const root = content.root?.children || content.children || [];
  if (!Array.isArray(root) || root.length === 0) return null;
  return <div className="case-study-content prose prose-neutral dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-300">{root.map((node, idx) => renderLexicalNode(node, `r-${idx}`))}</div>;
}

export function lexicalToPlainText(content) {
  if (!content) return '';
  const root = content.root?.children || content.children || [];
  const extractText = (nodes) => {
    if (!Array.isArray(nodes)) return '';
    return nodes.map(n => (n.type === 'text' ? n.text || '' : n.children ? extractText(n.children) : '')).join(' ');
  };
  return extractText(root).replace(/\s+/g, ' ').trim();
}
