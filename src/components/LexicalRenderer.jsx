import React, { isValidElement } from 'react';
import YouTubeEmbed from './YouTubeEmbed';
import CustomVideoPlayer from './CustomVideoPlayer';

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
      if (node.fields?.blockType === 'video') {
        const { video, caption } = node.fields;
        if (!video?.url) return null;
        const videoUrl = video.url.startsWith('http') ? video.url : `${import.meta.env.PUBLIC_PAYLOAD_BASE_URL || import.meta.env.VITE_CMS_BASE_URL || ''}${video.url}`;
        const videoChapters = (video.chapters || []).map(ch => ({
          title: ch.title,
          time: ch.start_timecode !== undefined ? ch.start_timecode : (ch.time || 0)
        }));
        return (
          <figure key={key} className="my-8">
            <div className="relative aspect-video bg-neutral-100 dark:bg-neutral-900 rounded-lg overflow-hidden shadow-lg">
              <CustomVideoPlayer src={videoUrl} chapters={videoChapters} className="w-full aspect-video" />
            </div>
            {caption && <figcaption className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 text-center">{caption}</figcaption>}
          </figure>
        );
      }
      if (node.fields?.blockType === 'youtube-embed') {
        const { url, caption, aspectRatio } = node.fields;
        if (!url) return null;
        return <YouTubeEmbed key={key} url={url} caption={caption} aspectRatio={aspectRatio} />;
      }
      return null;
    }

    case 'upload': {
      const media = node.value;
      if (!media?.url) return null;
      const fullUrl = media.url.startsWith('http') ? media.url : `${import.meta.env.PUBLIC_PAYLOAD_BASE_URL || import.meta.env.VITE_CMS_BASE_URL || ''}${media.url}`;
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
