import React, { isValidElement } from 'react';
import YouTubeEmbed from './YouTubeEmbed';
import CustomVideoPlayer from './CustomVideoPlayer';
import ToggleList from './ToggleList';

const IS_BOLD = 1;
const IS_ITALIC = 2;
const IS_STRIKETHROUGH = 4;
const IS_UNDERLINE = 8;
const IS_CODE = 16;
const IS_SUBSCRIPT = 32;
const IS_SUPERSCRIPT = 64;

const CMS_BASE = import.meta.env.PUBLIC_PAYLOAD_BASE_URL || 'https://hamzah-design-cms.onrender.com';
const R2_ENDPOINT = import.meta.env.PUBLIC_R2_ENDPOINT || '';
const R2_BUCKET = import.meta.env.PUBLIC_R2_BUCKET || '';

function trimSlashes(value = '') { return value.replace(/^\/+|\/+$/g, ''); }

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

function firstDefined(...values) { return values.find((value) => value !== undefined && value !== null && value !== ''); }

function getMediaUrl(media) {
  const fallbackPath = media?.filename || media?.key || media?.path || media?.name || extractMediaFilename(media?.url);
  const r2Url = buildR2MediaUrl(fallbackPath);
  if (r2Url) return r2Url;
  return toAbsoluteUrl(firstDefined(media?.url, media?.filename, media?.src, media?.file?.url));
}

function extractNodeText(node) {
  if (!node) return '';
  if (node.type === 'text') return node.text || '';
  if (Array.isArray(node.children)) return node.children.map(extractNodeText).join(' ');
  return '';
}

function renderEmbedCard({ key, title, description, href, icon, meta }) {
  if (!href) return null;
  return (
    <a key={key} href={href} target="_blank" rel="noreferrer noopener" className="not-prose my-6 flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-5 no-underline shadow-sm transition-colors hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"><span className="text-lg">{icon}</span></div>
      <div className="min-w-0 flex-1">
        {meta ? <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">{meta}</div> : null}
        <div className="truncate text-base font-semibold text-neutral-900 dark:text-white">{title || href}</div>
        {description ? <p className="mt-1 mb-0 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{description}</p> : null}
        <div className="mt-3 truncate text-sm text-blue-600 dark:text-blue-400">{href}</div>
      </div>
    </a>
  );
}

function renderIframeEmbed({ key, url, caption, title, isCustomIframe }) {
  if (!url) return null;
  return (
    <figure key={key} className="not-prose my-8">
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950" style={{ position: 'relative', width: '100%', aspectRatio: isCustomIframe ? '4 / 3' : undefined }}>
        <iframe src={url} title={title} loading="lazy" allowFullScreen className="w-full border-0" style={{ margin: 0, border: 'none', borderRadius: 0, position: isCustomIframe ? 'absolute' : 'relative', top: 0, left: 0, width: '100%', height: isCustomIframe ? 'calc(100% + 60px)' : '100%', aspectRatio: isCustomIframe ? undefined : '16 / 9' }} />
      </div>
      {caption ? <figcaption className="mt-2 text-center text-sm text-neutral-500 dark:text-neutral-400">{caption}</figcaption> : null}
    </figure>
  );
}

function renderTableBlock({ key, fields }) {
  const rows = Array.isArray(fields?.rows) ? fields.rows : [];
  const normalizedRows = rows.map((row) => (Array.isArray(row?.columns) ? row.columns : [])).filter((columns) => columns.length > 0);
  if (normalizedRows.length === 0) return null;
  const [headerRow, ...bodyRows] = normalizedRows;
  return (
    <figure key={key} className="not-prose my-8">
      {fields.title ? <figcaption className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">{fields.title}</figcaption> : null}
      <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950 h-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm h-auto">
          <thead className="bg-neutral-50 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500 dark:bg-neutral-900/70 dark:text-neutral-400">
            <tr>{headerRow.map((col, i) => <th key={`h-${i}`} className="border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">{col.cell}</th>)}</tr>
          </thead>
          {bodyRows.length > 0 ? <tbody className="divide-y divide-neutral-200 text-neutral-700 dark:divide-neutral-800 dark:text-neutral-300">{bodyRows.map((row, i) => <tr key={`r-${i}`} className="transition-colors hover:bg-neutral-50/70 dark:hover:bg-neutral-900/60">{row.map((col, j) => <td key={`c-${i}-${j}`} className="px-4 py-3 align-top">{col.cell}</td>)}</tr>)}</tbody> : null}
        </table>
      </div>
    </figure>
  );
}

function renderChildren(children, parentKey, context) {
  if (!Array.isArray(children)) return null;
  return children.map((child, idx) => renderLexicalNode(child, `${parentKey}-${idx}`, context));
}

function renderLexicalNode(node, key, context) {
  if (!node) return null;
  const headingContext = context || { h2: 0, h3: 0, currentSection: null };
  const { type, format: align } = node;
  const style = align ? { textAlign: align } : {};

  switch (type) {
    case 'root': return renderChildren(node.children, key, headingContext);
    case 'paragraph': return <p key={key} className="mb-5 leading-relaxed break-words" style={style}>{renderChildren(node.children, key, headingContext)}</p>;
    case 'heading': {
      const { tag } = node;
      const Tag = tag || 'h2';
      let id = undefined;
      if (Tag === 'h2') {
        headingContext.h2 += 1;
        headingContext.h3 = 0;
        id = `section-${headingContext.h2}`;
        headingContext.currentSection = id;
      } else if (Tag === 'h3') {
        headingContext.h3 += 1;
        id = `${headingContext.currentSection}-${headingContext.h3}`;
      }
      return <Tag key={key} id={id} className={`font-bold my-4 ${Tag==='h2'?'text-3xl':'text-2xl'}`} style={style}>{renderChildren(node.children, key, headingContext)}</Tag>;
    }
    case 'quote': return <blockquote key={key} className="border-l-4 border-neutral-300 dark:border-neutral-600 pl-4 italic my-4 text-neutral-600 dark:text-neutral-400" style={style}>{renderChildren(node.children, key, headingContext)}</blockquote>;
    case 'list': {
      const ListTag = node.tag === 'ol' ? 'ol' : 'ul';
      return <ListTag key={key} className={`${ListTag==='ol'?'list-decimal':'list-disc'} pl-6 mb-5 space-y-1.5`}>{renderChildren(node.children, key, headingContext)}</ListTag>;
    }
    case 'listitem': return <li key={key} className="mb-1.5 leading-relaxed">{renderChildren(node.children, key, headingContext)}</li>;
    case 'link': {
      const url = node.fields?.url || node.fields?.href || '';
      return <a key={key} href={url} target={node.fields?.newTab ? '_blank' : undefined} className="text-blue-500 hover:underline">{renderChildren(node.children, key, headingContext)}</a>;
    }
    case 'upload': return renderUploadNode(node, key, headingContext);
    case 'block': {
      const blockType = node.fields?.blockType;
      if (blockType === 'table') return renderTableBlock({ key, fields: node.fields });
      if (blockType === 'video') return (
        <figure key={key} className="not-prose my-8">
            <CustomVideoPlayer 
                src={toAbsoluteUrl(node.fields.video?.url)} 
                caption={node.fields.caption}
                chapters={node.fields.video?.chapters}
            />
        </figure>
      );
      if (blockType === 'toggle-list') return (
        <ToggleList 
            key={key} 
            title={node.fields.title} 
            content={node.fields.content?.root?.children || node.fields.content?.children || []}
            renderChildren={(children, parentKey) => renderChildren(children, parentKey, headingContext)}
            parentKey={key}
        />
      );
      if (blockType === 'youtube-embed') return (
        <YouTubeEmbed 
            key={key} 
            url={node.fields.url} 
            caption={node.fields.caption} 
        />
      );
      if (blockType === 'custom-iframe-embed') return renderIframeEmbed({ 
        key, 
        url: node.fields.url, 
        caption: node.fields.caption, 
        title: node.fields.title, 
        isCustomIframe: true 
      });
      return null;
    }
    case 'horizontalrule': return <hr key={key} className="my-8 border-neutral-200 dark:border-neutral-800" />;
    case 'text': return resolveTextNode(node, key);
    default: return node.children?.length ? <React.Fragment key={key}>{renderChildren(node.children, key, headingContext)}</React.Fragment> : null;
  }
}

function renderUploadNode(node, key, context) {
  const { value } = node;
  if (!value || !value.url) return null;
  
  const url = getMediaUrl(value);
  const isGif = url && /\.(gif)($|\?)/i.test(url);
  const onImageClick = context?.onImageClick;

  const handleClick = () => {
    if (!isGif && onImageClick) {
      onImageClick({ src: url, alt: value.alt || 'Image' });
    }
  };

  return (
    <figure key={key} className="not-prose my-8">
      <img 
        src={url} 
        alt={value.alt || 'Image'} 
        className={`w-full rounded-2xl border border-neutral-200 shadow-sm dark:border-neutral-800 ${
          !isGif && onImageClick ? 'cursor-zoom-in hover:opacity-95 transition-all duration-300 hover:shadow-md' : ''
        }`}
        loading="lazy" 
        onClick={!isGif && onImageClick ? handleClick : undefined}
      />
      {value.alt ? <figcaption className="mt-3 text-center text-sm text-neutral-500 dark:text-neutral-400">{value.alt}</figcaption> : null}
    </figure>
  );
}

function resolveTextNode(node, index) {
  if (!node || !node.text) return null;
  let children = node.text;
  if (node.format & IS_BOLD) children = <strong key={`b-${index}`}>{children}</strong>;
  if (node.format & IS_ITALIC) children = <em key={`i-${index}`}>{children}</em>;
  return <React.Fragment key={`t-${index}`}>{children}</React.Fragment>;
}

export function extractTableOfContents(content) {
  const root = content?.root?.children || content?.children || [];
  const items = [];
  let h2Count = 0;
  
  const process = (nodes) => {
    nodes.forEach(node => {
      if (node.type === 'heading' && (node.tag === 'h2' || node.tag === 'h3')) {
        const title = extractNodeText(node).trim();
        if (node.tag === 'h2') {
          h2Count++;
          items.push({ id: `section-${h2Count}`, title, children: [] });
        } else if (items.length > 0) {
          items[items.length - 1].children.push({ id: `section-${h2Count}-${items[items.length - 1].children.length + 1}`, title });
        }
      }
      if (node.children) process(node.children);
    });
  };
  process(root);
  return items;
}

export default function LexicalRenderer({ content, onImageClick }) {
  if (!content) return null;

  const headingContext = { h2: 0, h3: 0, currentSection: null, onImageClick };

  return (
    <div className="case-study-content prose prose-neutral dark:prose-invert max-w-none">
      {renderChildren(content.root?.children || content.children || [], 'r', headingContext)}
    </div>
  );
}

export function lexicalToPlainText(content) {
  const root = content?.root?.children || content?.children || [];
  const extractText = (nodes) => {
    if (!Array.isArray(nodes)) return '';
    return nodes.map(n => (n.type === 'text' ? n.text || '' : n.children ? extractText(n.children) : '')).join(' ');
  };
  return extractText(root).replace(/\s+/g, ' ').trim();
}
