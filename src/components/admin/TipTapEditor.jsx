/**
 * TipTapEditor.jsx
 * Full-featured rich text editor using TipTap (ProseMirror).
 *
 * Features:
 *  - Sticky toolbar (never scrolls) / content area scrolls internally
 *  - Text: bold, italic, underline, strike, inline code, highlight
 *  - Headings H2/H3, paragraph, blockquote, horizontal rule
 *  - Lists: bullet + ordered
 *  - Links (with inline link editor)
 *  - Tables (insert, add/remove rows & columns, toggle header)
 *  - Video embeds: YouTube/Vimeo URL or direct .mp4/.webm link
 *  - Link Tree: a styled card block listing multiple labelled links
 *  - Images
 *  - Undo/Redo
 */

import React, { useState, useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { Youtube } from '@tiptap/extension-youtube';
import { Highlight } from '@tiptap/extension-highlight';
import { TextAlign } from '@tiptap/extension-text-align';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Node, mergeAttributes } from '@tiptap/core';
import { Icon } from '@iconify/react';
import './tiptap.css';

// ─────────────────────────────────────────────────────────────────────────────
// Custom: VideoNode — wraps <video> for direct mp4/webm embeds
// ─────────────────────────────────────────────────────────────────────────────
const VideoNode = Node.create({
  name: 'videoEmbed',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      controls: { default: true },
      loop: { default: false },
      caption: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-video-embed]' }];
  },

  renderHTML({ HTMLAttributes }) {
    const { src, caption, ...rest } = HTMLAttributes;
    return [
      'div',
      mergeAttributes({ 'data-video-embed': '' }, { class: 'video-embed-node' }),
      [
        'video',
        mergeAttributes({ src, controls: '', ...rest }),
      ],
      caption ? ['p', { class: 'video-caption' }, caption] : [],
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('div');
      dom.setAttribute('data-video-embed', '');
      dom.className = 'video-embed-node';
      const video = document.createElement('video');
      video.src = node.attrs.src;
      video.controls = true;
      video.loop = node.attrs.loop;
      video.style.width = '100%';
      dom.appendChild(video);
      return { dom };
    };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Custom: LinkTreeNode — inline card block with multiple labelled links
// ─────────────────────────────────────────────────────────────────────────────
const LinkTreeNode = Node.create({
  name: 'linkTree',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      title: { default: 'Links' },
      links: { default: [] },  // [{ label, url }]
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-link-tree]' }];
  },

  renderHTML({ HTMLAttributes }) {
    const { title, links } = HTMLAttributes;
    const safeLinks = Array.isArray(links) ? links : [];
    const container = [
      'div',
      mergeAttributes({ 'data-link-tree': '' }, { class: 'link-tree-node' }),
      [
        'div',
        { class: 'link-tree-title' },
        `🔗 ${title || 'Links'}`,
      ],
      [
        'div',
        { class: 'link-tree-links' },
        ...safeLinks.map(({ label, url }) => [
          'a',
          { href: url, target: '_blank', rel: 'noopener noreferrer', class: 'link-tree-item' },
          ['span', { class: 'link-tree-item-label' }, label || url],
          ['span', { class: 'link-tree-item-url' }, url],
        ]),
      ],
    ];
    return container;
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const dom = document.createElement('div');
      dom.className = 'link-tree-node';
      dom.setAttribute('data-link-tree', '');
      dom.setAttribute('contenteditable', 'false');

      const render = () => {
        const links = Array.isArray(node.attrs.links) ? node.attrs.links : [];
        const title = node.attrs.title || 'Links';
        dom.innerHTML = `
          <div class="link-tree-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
            ${title}
          </div>
          <div class="link-tree-links">
            ${links.length === 0
              ? '<span class="link-tree-empty">No links yet — double-click to edit</span>'
              : links.map(({ label, url }) => `
                <a href="${url}" target="_blank" rel="noopener noreferrer" class="link-tree-item">
                  <span class="link-tree-item-label">${label || url}</span>
                  <span class="link-tree-item-url">${url}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0;opacity:0.4">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </a>
              `).join('')}
          </div>
        `;
      };

      render();
      return { dom, update: (updatedNode) => { return true; } };
    };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Toolbar Button — memoized for performance
// ─────────────────────────────────────────────────────────────────────────────
function ToolbarBtn({ onClick, isActive, disabled, title, icon, children }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick?.(); }}
      className={`tiptap-toolbar-btn ${isActive ? 'is-active' : ''}`}
      disabled={disabled}
      title={title}
      aria-label={title}
    >
      {icon ? <Icon icon={icon} className="w-3.5 h-3.5" /> : children}
    </button>
  );
}

function Divider() {
  return <div className="tiptap-toolbar-divider" />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Link Editor Modal
// ─────────────────────────────────────────────────────────────────────────────
function LinkEditor({ editor, onClose }) {
  const [url, setUrl] = useState(editor.getAttributes('link').href || '');

  const apply = () => {
    if (!url.trim()) {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: url.trim(), target: '_blank' }).run();
    }
    onClose();
  };

  return (
    <div className="flex items-center gap-1.5 bg-popover border rounded-xl shadow-lg p-2 z-50" style={{ minWidth: 300 }}>
      <Icon icon="lucide:link" className="w-4 h-4 text-muted-foreground shrink-0" />
      <input
        autoFocus
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com"
        className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
        onKeyDown={(e) => { if (e.key === 'Enter') apply(); if (e.key === 'Escape') onClose(); }}
      />
      <button type="button" onMouseDown={(e) => { e.preventDefault(); apply(); }}
        className="px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-semibold cursor-pointer">
        {url ? 'Apply' : 'Remove'}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Video Insert Modal
// ─────────────────────────────────────────────────────────────────────────────
function VideoModal({ editor, onClose }) {
  const [tab, setTab] = useState('url'); // 'url' | 'direct'
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');

  const isYoutube = /youtube\.com|youtu\.be/.test(url);
  const isVimeo = /vimeo\.com/.test(url);
  const isEmbeddable = isYoutube || isVimeo;

  const insert = () => {
    if (!url.trim()) return;
    if (tab === 'url' && isEmbeddable) {
      // Use TipTap's YouTube extension
      editor.chain().focus().setYoutubeVideo({ src: url.trim() }).run();
    } else {
      // Direct video or generic embed via custom VideoNode
      editor.chain().focus().insertContent({
        type: 'videoEmbed',
        attrs: { src: url.trim(), caption },
      }).run();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-card border rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-2">
            <Icon icon="lucide:video" className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm text-foreground">Insert Video</span>
          </div>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer">
            <Icon icon="lucide:x-circle" className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b text-sm font-medium">
          <button type="button"
            onClick={() => setTab('url')}
            className={`flex-1 py-2.5 cursor-pointer transition-colors ${tab === 'url' ? 'text-foreground border-b-2 border-primary -mb-px' : 'text-muted-foreground hover:text-foreground'}`}>
            YouTube / Vimeo URL
          </button>
          <button type="button"
            onClick={() => setTab('direct')}
            className={`flex-1 py-2.5 cursor-pointer transition-colors ${tab === 'direct' ? 'text-foreground border-b-2 border-primary -mb-px' : 'text-muted-foreground hover:text-foreground'}`}>
            Direct Video Link
          </button>
        </div>

        <div className="p-5 space-y-3">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {tab === 'url' ? 'YouTube or Vimeo URL' : 'Video URL (.mp4, .webm)'}
            </label>
            <input
              autoFocus
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={tab === 'url' ? 'https://youtube.com/watch?v=...' : 'https://cdn.example.com/video.mp4'}
              className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              onKeyDown={(e) => { if (e.key === 'Enter') insert(); }}
            />
          </div>

          {tab === 'direct' && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Caption (optional)</label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Brief description of the video"
                className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          )}

          {tab === 'url' && url && !isEmbeddable && (
            <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <Icon icon="lucide:triangle-alert" className="w-4 h-4" />
              URL doesn't look like YouTube/Vimeo. Switch to "Direct Video Link" tab instead.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 px-5 pb-5">
          <button type="button" onClick={onClose}
            className="px-4 py-2 rounded-xl border text-sm font-medium text-foreground hover:bg-muted cursor-pointer">
            Cancel
          </button>
          <button type="button" onClick={insert}
            disabled={!url.trim()}
            className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold cursor-pointer disabled:opacity-50">
            Insert Video
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Link Tree Modal
// ─────────────────────────────────────────────────────────────────────────────
function LinkTreeModal({ editor, onClose }) {
  const [title, setTitle] = useState('Project Links');
  const [links, setLinks] = useState([{ label: '', url: '' }]);

  const addLink = () => setLinks([...links, { label: '', url: '' }]);
  const removeLink = (i) => setLinks(links.filter((_, idx) => idx !== i));
  const updateLink = (i, field, val) => {
    const next = [...links];
    next[i] = { ...next[i], [field]: val };
    setLinks(next);
  };

  const insert = () => {
    const validLinks = links.filter(l => l.url.trim());
    editor.chain().focus().insertContent({
      type: 'linkTree',
      attrs: { title: title.trim() || 'Links', links: validLinks },
    }).run();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-card border rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
          <div className="flex items-center gap-2">
            <Icon icon="lucide:link-2" className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm text-foreground">Insert Link Tree</span>
          </div>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer">
            <Icon icon="lucide:x-circle" className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Block Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Project Links, Resources, References..."
              className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Links</label>
            {links.map((link, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => updateLink(i, 'label', e.target.value)}
                  placeholder="Label (e.g. Figma Prototype)"
                  className="flex-1 min-w-0 px-3 py-2 rounded-xl border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => updateLink(i, 'url', e.target.value)}
                  placeholder="URL"
                  className="flex-1 min-w-0 px-3 py-2 rounded-xl border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono text-xs"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLink(); } }}
                />
                <button type="button" onClick={() => removeLink(i)}
                  className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer transition-colors">
                  <Icon icon="lucide:trash-2" className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button type="button" onClick={addLink}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground cursor-pointer py-1 px-2 rounded-lg hover:bg-muted transition-colors">
              <Icon icon="lucide:plus-circle" className="w-4 h-4" />
              Add link
            </button>
          </div>

          {/* Preview */}
          {links.some(l => l.url) && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Preview</label>
              <div className="link-tree-node pointer-events-none select-none">
                <div className="link-tree-title">
                  <Icon icon="lucide:link" className="w-3.5 h-3.5" />
                  {title || 'Links'}
                </div>
                <div className="link-tree-links">
                  {links.filter(l => l.url).map((l, i) => (
                    <div key={i} className="link-tree-item">
                      <span className="link-tree-item-label">{l.label || l.url}</span>
                      <span className="link-tree-item-url">{l.url}</span>
                      <Icon icon="lucide:chevron-right" className="w-3 h-3 opacity-40 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t shrink-0">
          <button type="button" onClick={onClose}
            className="px-4 py-2 rounded-xl border text-sm font-medium text-foreground hover:bg-muted cursor-pointer">
            Cancel
          </button>
          <button type="button" onClick={insert}
            disabled={!links.some(l => l.url.trim())}
            className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold cursor-pointer disabled:opacity-50">
            Insert Block
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Table Context Toolbar — shown when cursor is inside a table
// ─────────────────────────────────────────────────────────────────────────────
function TableContextBar({ editor }) {
  if (!editor.isActive('table')) return null;
  return (
    <div className="flex items-center gap-1 px-2 py-1 mx-4 my-1 rounded-lg border bg-muted/60 text-xs text-muted-foreground flex-wrap">
      <span className="font-semibold mr-1 text-foreground">Table:</span>
      <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().addColumnBefore().run(); }}
        className="px-2 py-0.5 rounded hover:bg-muted cursor-pointer text-foreground">+ Col Before</button>
      <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().addColumnAfter().run(); }}
        className="px-2 py-0.5 rounded hover:bg-muted cursor-pointer text-foreground">+ Col After</button>
      <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().deleteColumn().run(); }}
        className="px-2 py-0.5 rounded hover:bg-muted cursor-pointer text-destructive">− Col</button>
      <span className="text-border mx-1">|</span>
      <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().addRowBefore().run(); }}
        className="px-2 py-0.5 rounded hover:bg-muted cursor-pointer text-foreground">+ Row Above</button>
      <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().addRowAfter().run(); }}
        className="px-2 py-0.5 rounded hover:bg-muted cursor-pointer text-foreground">+ Row Below</button>
      <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().deleteRow().run(); }}
        className="px-2 py-0.5 rounded hover:bg-muted cursor-pointer text-destructive">− Row</button>
      <span className="text-border mx-1">|</span>
      <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeaderRow().run(); }}
        className="px-2 py-0.5 rounded hover:bg-muted cursor-pointer text-foreground">Toggle Header</button>
      <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().mergeCells().run(); }}
        className="px-2 py-0.5 rounded hover:bg-muted cursor-pointer text-foreground">Merge</button>
      <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().splitCell().run(); }}
        className="px-2 py-0.5 rounded hover:bg-muted cursor-pointer text-foreground">Split</button>
      <span className="text-border mx-1">|</span>
      <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().deleteTable().run(); }}
        className="px-2 py-0.5 rounded hover:bg-muted cursor-pointer text-destructive font-semibold">Delete Table</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EDITOR COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function TipTapEditor({ value, onChange, placeholder = 'Write your case study content here...' }) {
  const [showLinkEditor, setShowLinkEditor] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showLinkTreeModal, setShowLinkTreeModal] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: { HTMLAttributes: { spellcheck: 'false' } },
      }),
      Underline,
      Highlight.configure({ multicolor: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Image.configure({ allowBase64: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube.configure({
        inline: false,
        ccLanguage: 'en',
        HTMLAttributes: { class: 'youtube-embed' },
      }),
      VideoNode,
      LinkTreeNode,
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        spellcheck: 'true',
        'data-gramm': 'false',  // disable Grammarly extension interference
      },
    },
  });

  // Sync external value changes (e.g. when data loads from API)
  const lastExternalValue = useRef(value);
  if (editor && value !== lastExternalValue.current && value !== editor.getHTML()) {
    lastExternalValue.current = value;
    // Defer to avoid updating during render
    requestAnimationFrame(() => {
      if (editor && !editor.isDestroyed) {
        editor.commands.setContent(value || '', false);
      }
    });
  }

  const insertTable = useCallback(() => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  if (!editor) return null;

  const headingLevel = editor.isActive('heading', { level: 2 }) ? 'h2'
    : editor.isActive('heading', { level: 3 }) ? 'h3'
    : 'p';

  return (
    <div className="tiptap-editor-wrapper">

      {/* ── STICKY TOOLBAR ── */}
      <div className="tiptap-toolbar">

        {/* Text style dropdown */}
        <select
          className="tiptap-toolbar-select"
          value={headingLevel}
          onChange={(e) => {
            const v = e.target.value;
            if (v === 'p') editor.chain().focus().setParagraph().run();
            else if (v === 'h2') editor.chain().focus().setHeading({ level: 2 }).run();
            else if (v === 'h3') editor.chain().focus().setHeading({ level: 3 }).run();
          }}
          title="Text style"
        >
          <option value="p">Paragraph</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>

        <Divider />

        {/* Inline format */}
        <ToolbarBtn icon="lucide:bold" title="Bold (⌘B)"
          isActive={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()} />
        <ToolbarBtn icon="lucide:italic" title="Italic (⌘I)"
          isActive={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()} />
        <ToolbarBtn icon="lucide:underline" title="Underline (⌘U)"
          isActive={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()} />
        <ToolbarBtn icon="lucide:strikethrough" title="Strikethrough"
          isActive={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()} />
        <ToolbarBtn icon="lucide:code" title="Inline code"
          isActive={editor.isActive('code')}
          onClick={() => editor.chain().focus().toggleCode().run()} />
        <ToolbarBtn icon="lucide:highlighter" title="Highlight"
          isActive={editor.isActive('highlight')}
          onClick={() => editor.chain().focus().toggleHighlight().run()} />

        <Divider />

        {/* Text alignment */}
        <ToolbarBtn icon="lucide:align-left" title="Align left"
          isActive={editor.isActive({ textAlign: 'left' })}
          onClick={() => editor.chain().focus().setTextAlign('left').run()} />
        <ToolbarBtn icon="lucide:align-center" title="Align center"
          isActive={editor.isActive({ textAlign: 'center' })}
          onClick={() => editor.chain().focus().setTextAlign('center').run()} />
        <ToolbarBtn icon="lucide:align-right" title="Align right"
          isActive={editor.isActive({ textAlign: 'right' })}
          onClick={() => editor.chain().focus().setTextAlign('right').run()} />

        <Divider />

        {/* Lists */}
        <ToolbarBtn icon="lucide:list" title="Bullet list"
          isActive={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()} />
        <ToolbarBtn icon="lucide:list-ordered" title="Ordered list"
          isActive={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()} />

        <Divider />

        {/* Block elements */}
        <ToolbarBtn icon="lucide:quote" title="Blockquote"
          isActive={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()} />
        <ToolbarBtn icon="lucide:code-xml" title="Code block"
          isActive={editor.isActive('codeBlock')}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()} />
        <ToolbarBtn icon="lucide:minus" title="Horizontal rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()} />

        <Divider />

        {/* Link */}
        <ToolbarBtn icon="lucide:link" title="Insert / edit link"
          isActive={editor.isActive('link')}
          onClick={() => setShowLinkEditor(!showLinkEditor)} />

        {/* Image */}
        <ToolbarBtn icon="lucide:image" title="Insert image"
          onClick={() => {
            const url = window.prompt('Image URL:');
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }} />

        {/* Table */}
        <ToolbarBtn icon="lucide:table" title="Insert table"
          isActive={editor.isActive('table')}
          onClick={insertTable} />

        <Divider />

        {/* Video */}
        <ToolbarBtn icon="lucide:video" title="Insert video"
          onClick={() => setShowVideoModal(true)} />

        {/* Link Tree */}
        <ToolbarBtn icon="lucide:link-2" title="Insert link tree"
          onClick={() => setShowLinkTreeModal(true)} />

        <Divider />

        {/* History */}
        <ToolbarBtn icon="lucide:undo" title="Undo (⌘Z)"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()} />
        <ToolbarBtn icon="lucide:redo" title="Redo (⌘⇧Z)"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()} />
      </div>

      {/* ── TABLE CONTEXT BAR — only shown when cursor is in a table ── */}
      <TableContextBar editor={editor} />

      {/* ── LINK EDITOR (inline — below toolbar) ── */}
      {showLinkEditor && (
        <div className="px-3 py-2 border-b bg-muted/30">
          <LinkEditor editor={editor} onClose={() => setShowLinkEditor(false)} />
        </div>
      )}

      {/* ── CONTENT AREA — scrolls internally ── */}
      <div className="tiptap-content-area">
        <EditorContent editor={editor} />
      </div>

      {/* ── MODALS ── */}
      {showVideoModal && <VideoModal editor={editor} onClose={() => setShowVideoModal(false)} />}
      {showLinkTreeModal && <LinkTreeModal editor={editor} onClose={() => setShowLinkTreeModal(false)} />}
    </div>
  );
}
