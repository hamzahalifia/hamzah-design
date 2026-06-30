import React, { useState, useEffect, useRef } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';

import {
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  $getRoot,
  UNDO_COMMAND,
  REDO_COMMAND,
  DecoratorNode,
} from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import {
  HeadingNode,
  QuoteNode,
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from '@lexical/rich-text';
import {
  ListNode,
  ListItemNode,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
} from '@lexical/list';
import {
  LinkNode,
  TOGGLE_LINK_COMMAND,
  $isLinkNode,
} from '@lexical/link';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { Icon } from '@iconify/react';

// Custom components to render inside DecoratorNodes
function ImageComponent({ src, alt }) {
  return (
    <div className="my-4 relative group select-none flex justify-center">
      <img
        src={src}
        alt={alt || 'Image'}
        className="max-w-full h-auto rounded-xl border border-zinc-200 dark:border-zinc-800"
      />
      <span className="absolute top-2 right-2 px-2 py-1 rounded bg-black/60 text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-sans">
        Image Link
      </span>
    </div>
  );
}

function AttachmentComponent({ url, filename, size }) {
  return (
    <div className="my-3 max-w-md select-none font-sans">
      <a
        href={url}
        download={filename}
        className="flex items-center gap-3 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
      >
        <div className="w-10 h-10 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-650 dark:text-zinc-400 shrink-0">
          <Icon icon="lucide:paperclip" className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <span className="font-semibold text-xs text-zinc-800 dark:text-zinc-200 block truncate">{filename}</span>
          <span className="text-[10px] text-zinc-550 dark:text-zinc-500 block">{size || 'Attachment File'}</span>
        </div>
        <div className="w-8 h-8 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-400 dark:text-zinc-300 transition-colors shrink-0">
          <Icon icon="lucide:download" className="w-4 h-4" />
        </div>
      </a>
    </div>
  );
}

// Custom ImageNode class for rich text image support
export class ImageNode extends DecoratorNode {
  __src;
  __alt;

  static getType() {
    return 'image';
  }

  static clone(node) {
    return new ImageNode(node.__src, node.__alt, node.__key);
  }

  static importJSON(serializedNode) {
    const { src, alt } = serializedNode;
    return $createImageNode(src, alt);
  }

  exportJSON() {
    return {
      type: 'image',
      src: this.__src,
      alt: this.__alt,
      version: 1,
    };
  }

  constructor(src, alt, key) {
    super(key);
    this.__src = src;
    this.__alt = alt || '';
  }

  createDOM(config) {
    const span = document.createElement('span');
    span.className = 'lexical-image-container inline-block w-full';
    return span;
  }

  updateDOM() {
    return false;
  }

  decorate(editor, config) {
    return <ImageComponent src={this.__src} alt={this.__alt} />;
  }

  exportDOM() {
    const element = document.createElement('img');
    element.setAttribute('src', this.__src);
    element.setAttribute('alt', this.__alt);
    element.setAttribute('class', 'max-w-full h-auto rounded-xl border border-zinc-200 dark:border-zinc-800 my-4');
    return { element };
  }

  static importDOM() {
    return {
      img: (domNode) => {
        if (domNode instanceof HTMLImageElement) {
          return {
            conversion: (domNode) => {
              const src = domNode.getAttribute('src');
              const alt = domNode.getAttribute('alt');
              return { node: $createImageNode(src, alt) };
            },
            priority: 1,
          };
        }
        return null;
      },
    };
  }
}

export function $createImageNode(src, alt) {
  return new ImageNode(src, alt);
}

export function $isImageNode(node) {
  return node instanceof ImageNode;
}

// Custom AttachmentNode class for attachment/download files
export class AttachmentNode extends DecoratorNode {
  __url;
  __filename;
  __size;

  static getType() {
    return 'attachment';
  }

  static clone(node) {
    return new AttachmentNode(node.__url, node.__filename, node.__size, node.__key);
  }

  static importJSON(serializedNode) {
    const { url, filename, size } = serializedNode;
    return $createAttachmentNode(url, filename, size);
  }

  exportJSON() {
    return {
      type: 'attachment',
      url: this.__url,
      filename: this.__filename,
      size: this.__size,
      version: 1,
    };
  }

  constructor(url, filename, size, key) {
    super(key);
    this.__url = url;
    this.__filename = filename;
    this.__size = size || '';
  }

  createDOM(config) {
    const span = document.createElement('span');
    span.className = 'lexical-attachment-container inline-block w-full';
    return span;
  }

  updateDOM() {
    return false;
  }

  decorate(editor, config) {
    return <AttachmentComponent url={this.__url} filename={this.__filename} size={this.__size} />;
  }

  exportDOM() {
    const element = document.createElement('a');
    element.setAttribute('href', this.__url);
    element.setAttribute('download', this.__filename);
    element.setAttribute('class', 'lexical-attachment-link flex items-center gap-3 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-800 max-w-md my-3');
    element.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-weight: 600; font-size: 13px; color: #1f2937;">📎 ${this.__filename}</span>
        <span style="font-size: 10px; color: #6b7280;">(${this.__size || 'Download File'})</span>
      </div>
    `;
    return { element };
  }

  static importDOM() {
    return {
      a: (domNode) => {
        if (domNode.classList.contains('lexical-attachment-link') || domNode.hasAttribute('download')) {
          return {
            conversion: (domNode) => {
              const url = domNode.getAttribute('href');
              const filename = domNode.getAttribute('download') || 'Attachment';
              const text = domNode.textContent || '';
              const match = text.match(/\(([^)]+)\)/);
              const size = match ? match[1] : '';
              return { node: $createAttachmentNode(url, filename, size) };
            },
            priority: 2,
          };
        }
        return null;
      },
    };
  }
}

export function $createAttachmentNode(url, filename, size) {
  return new AttachmentNode(url, filename, size);
}

export function $isAttachmentNode(node) {
  return node instanceof AttachmentNode;
}

// Custom Heading Node to automatically generate and assign slug IDs to H2 headings
export class CustomHeadingNode extends HeadingNode {
  static getType() {
    return 'heading';
  }

  static clone(node) {
    return new CustomHeadingNode(node.__tag, node.__key);
  }

  static importJSON(serializedNode) {
    const node = new CustomHeadingNode(serializedNode.tag);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setDirection(serializedNode.direction);
    return node;
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      type: 'heading',
      version: 1,
    };
  }

  exportDOM(editor) {
    const { element } = super.exportDOM(editor);
    if (element && this.getTag() === 'h2') {
      const text = this.getTextContent();
      const id = text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/&/g, '-and-')         // Replace & with 'and'
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-');        // Replace multiple - with single -
      element.setAttribute('id', id);
    }
    return { element };
  }
}

// Custom Helper to traverse parent nodes without @lexical/utils dependency
function getNearestNodeOfType(node, className) {
  let parent = node;
  while (parent !== null) {
    if (parent instanceof className) {
      return parent;
    }
    parent = parent.getParent();
  }
  return null;
}

// Config theme to style elements inside Lexical
const initialConfig = {
  namespace: 'LexicalCMS',
  theme: {
    paragraph: 'mb-4 leading-relaxed text-sm text-neutral-700 dark:text-neutral-300',
    heading: {
      h2: 'text-lg sm:text-xl font-serif-attio font-semibold text-neutral-900 dark:text-white mt-8 mb-4 tracking-tight',
      h3: 'text-base sm:text-lg font-bold text-neutral-800 dark:text-neutral-200 mt-6 mb-3 tracking-tight',
    },
    quote: 'pl-4 border-l-2 border-neutral-300 dark:border-neutral-700 italic text-neutral-600 dark:text-neutral-400 my-4 bg-neutral-50/50 dark:bg-neutral-900/30 py-1.5 pr-4 rounded-r-lg',
    list: {
      ul: 'list-disc pl-6 mb-4 text-sm text-neutral-700 dark:text-neutral-300 space-y-1',
      ol: 'list-decimal pl-6 mb-4 text-sm text-neutral-700 dark:text-neutral-300 space-y-1',
      listitem: 'pl-1',
    },
    text: {
      bold: 'font-bold',
      italic: 'italic',
      strikethrough: 'line-through',
      underline: 'underline',
    },
    link: 'text-neutral-950 dark:text-white underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-900 font-semibold cursor-pointer',
  },
  onError(error) {
    console.error('Lexical Error:', error);
  },
  nodes: [
    CustomHeadingNode,
    {
      replace: HeadingNode,
      with: (node) => new CustomHeadingNode(node.getTag(), node.getKey()),
    },
    QuoteNode,
    ListNode,
    ListItemNode,
    LinkNode,
    ImageNode,
    AttachmentNode,
  ],
};

// Plugin to set initial value from HTML string
function HtmlInitialValuePlugin({ value }) {
  const [editor] = useLexicalComposerContext();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!value) return;

    editor.update(() => {
      const root = $getRoot();
      if (isFirstRender.current) {
        isFirstRender.current = false;
        
        const parser = new DOMParser();
        const dom = parser.parseFromString(value, 'text/html');
        const nodes = $generateNodesFromDOM(editor, dom.body);
        
        root.clear();
        root.append(...nodes);
      }
    });
  }, [value, editor]);

  return null;
}

// Plugin to emit HTML string onChange
function HtmlOnChangePlugin({ onChange }) {
  const [editor] = useLexicalComposerContext();

  return (
    <OnChangePlugin
      onChange={(editorState) => {
        editorState.read(() => {
          const html = $generateHtmlFromNodes(editor);
          onChange(html);
        });
      }}
    />
  );
}

// Custom Toolbar Plugin for formatting options
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [blockType, setBlockType] = useState('paragraph');
  const [isLink, setIsLink] = useState(false);

  const updateToolbar = () => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));

      const anchorNode = selection.anchor.getNode();
      const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      if (elementDOM !== null) {
        if ($isHeadingNode(element)) {
          setBlockType(element.getTag()); // 'h2' or 'h3'
        } else if ($isListNode(element)) {
          const parentList = getNearestNodeOfType(anchorNode, ListNode);
          const listType = parentList ? parentList.getListType() : element.getListType();
          setBlockType(listType); // 'bullet' or 'number'
        } else {
          setBlockType(element.getType()); // 'paragraph' or 'quote'
        }
      }

      // Link check
      const parent = anchorNode.getParent();
      if ($isLinkNode(parent) || $isLinkNode(anchorNode)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  };

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor]);

  const toggleBold = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  };

  const toggleItalic = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  };

  const toggleUnderline = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
  };

  const toggleStrikethrough = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
  };

  const formatParagraph = () => {
    if (blockType !== 'paragraph') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    }
  };

  const formatHeading = (tag) => {
    if (blockType !== tag) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(tag));
        }
      });
    } else {
      formatParagraph();
    }
  };

  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatOrderedList = () => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    } else {
      formatParagraph();
    }
  };

  const toggleLink = () => {
    if (!isLink) {
      const url = window.prompt('Masukkan URL link:', 'https://');
      if (url) {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
      }
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  };

  const handleUndo = () => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  };

  const handleRedo = () => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  };

  const insertImage = () => {
    const url = window.prompt('Masukkan URL gambar (HTTP link atau path lokal):');
    if (url) {
      const alt = window.prompt('Masukkan deskripsi gambar (optional):') || '';
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const imageNode = $createImageNode(url, alt);
          selection.insertNodes([imageNode]);
        }
      });
    }
  };

  const insertAttachment = () => {
    const url = window.prompt('Masukkan URL file lampiran (HTTP link atau path lokal):');
    if (url) {
      const filename = window.prompt('Masukkan nama file (misal: Project_Overview.pdf):') || 'Attachment';
      const size = window.prompt('Masukkan ukuran file (optional, misal: 1.2 MB):') || '';
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const attachmentNode = $createAttachmentNode(url, filename, size);
          selection.insertNodes([attachmentNode]);
        }
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 rounded-t-xl select-none items-center">
      {/* Undo/Redo */}
      <button
        type="button"
        onClick={handleUndo}
        className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 dark:text-zinc-400 cursor-pointer"
        title="Undo"
      >
        <Icon icon="lucide:undo-2" className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={handleRedo}
        className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 dark:text-zinc-400 cursor-pointer"
        title="Redo"
      >
        <Icon icon="lucide:redo-2" className="w-4 h-4" />
      </button>

      <div className="w-[1px] h-6 bg-neutral-200 dark:bg-neutral-800 mx-1 self-center" />

      {/* Block Formats */}
      <button
        type="button"
        onClick={formatParagraph}
        className={`px-2 py-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs font-semibold cursor-pointer transition-colors ${
          blockType === 'paragraph' ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white' : 'text-neutral-500'
        }`}
        title="Paragraph"
      >
        T
      </button>

      <button
        type="button"
        onClick={() => formatHeading('h2')}
        className={`px-2 py-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs font-bold cursor-pointer transition-colors ${
          blockType === 'h2' ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white' : 'text-neutral-500'
        }`}
        title="Heading 2"
      >
        H2
      </button>

      <button
        type="button"
        onClick={() => formatHeading('h3')}
        className={`px-2 py-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs font-bold cursor-pointer transition-colors ${
          blockType === 'h3' ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white' : 'text-neutral-500'
        }`}
        title="Heading 3"
      >
        H3
      </button>

      <div className="w-[1px] h-6 bg-neutral-200 dark:bg-neutral-800 mx-1 self-center" />

      {/* Inline Formats */}
      <button
        type="button"
        onClick={toggleBold}
        className={`p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer transition-colors ${
          isBold ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white' : 'text-neutral-500'
        }`}
        title="Bold"
      >
        <Icon icon="lucide:bold" className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={toggleItalic}
        className={`p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer transition-colors ${
          isItalic ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white' : 'text-neutral-500'
        }`}
        title="Italic"
      >
        <Icon icon="lucide:italic" className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={toggleUnderline}
        className={`p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer transition-colors ${
          isUnderline ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white' : 'text-neutral-500'
        }`}
        title="Underline"
      >
        <Icon icon="lucide:underline" className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={toggleStrikethrough}
        className={`p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer transition-colors ${
          isStrikethrough ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white' : 'text-neutral-500'
        }`}
        title="Strikethrough"
      >
        <Icon icon="lucide:strikethrough" className="w-4 h-4" />
      </button>

      <div className="w-[1px] h-6 bg-neutral-200 dark:bg-neutral-800 mx-1 self-center" />

      {/* Block structures */}
      <button
        type="button"
        onClick={formatBulletList}
        className={`p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer transition-colors ${
          blockType === 'bullet' ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white' : 'text-neutral-500'
        }`}
        title="Bullet List"
      >
        <Icon icon="lucide:list" className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={formatOrderedList}
        className={`p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer transition-colors ${
          blockType === 'number' ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white' : 'text-neutral-500'
        }`}
        title="Numbered List"
      >
        <Icon icon="lucide:list-ordered" className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={formatQuote}
        className={`p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer transition-colors ${
          blockType === 'quote' ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white' : 'text-neutral-500'
        }`}
        title="Blockquote"
      >
        <Icon icon="lucide:quote" className="w-4 h-4" />
      </button>

      <div className="w-[1px] h-6 bg-neutral-200 dark:bg-neutral-800 mx-1 self-center" />

      {/* Links, Images, Attachments */}
      <button
        type="button"
        onClick={toggleLink}
        className={`p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer transition-colors ${
          isLink ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white' : 'text-neutral-500'
        }`}
        title="Insert Link"
      >
        <Icon icon="lucide:link" className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={insertImage}
        className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
        title="Insert Image"
      >
        <Icon icon="lucide:image-plus" className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={insertAttachment}
        className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
        title="Insert Attachment"
      >
        <Icon icon="lucide:paperclip" className="w-4 h-4" />
      </button>
    </div>
  );
}

// Main Lexical Editor Component
export default function LexicalEditor({ value, onChange }) {
  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="outline-none min-h-[300px] p-4 text-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 select-text font-sans" />
            }
            placeholder={
              <div className="absolute top-4 left-4 text-neutral-400 dark:text-neutral-500 text-sm pointer-events-none select-none font-sans">
                Ketik konten detail showcase disini...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <HtmlInitialValuePlugin value={value} />
          <HtmlOnChangePlugin onChange={onChange} />
        </div>
      </LexicalComposer>
    </div>
  );
}
