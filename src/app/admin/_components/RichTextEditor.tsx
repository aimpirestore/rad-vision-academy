"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Code,
  Undo,
  Redo,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-brand-red underline" },
      }),
      Placeholder.configure({ placeholder }),
      Image,
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm prose-slate dark:prose-invert max-w-none min-h-[300px] px-4 py-3 focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  const tools = [
    {
      icon: Bold,
      action: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive("bold"),
      label: "Bold",
    },
    {
      icon: Italic,
      action: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive("italic"),
      label: "Italic",
    },
    {
      icon: Strikethrough,
      action: () => editor.chain().focus().toggleStrike().run(),
      active: editor.isActive("strike"),
      label: "Strike",
    },
    {
      icon: Heading1,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive("heading", { level: 2 }),
      label: "H2",
    },
    {
      icon: Heading2,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      active: editor.isActive("heading", { level: 3 }),
      label: "H3",
    },
    {
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive("bulletList"),
      label: "Bullet list",
    },
    {
      icon: ListOrdered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive("orderedList"),
      label: "Ordered list",
    },
    {
      icon: Quote,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      active: editor.isActive("blockquote"),
      label: "Quote",
    },
    {
      icon: Code,
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      active: editor.isActive("codeBlock"),
      label: "Code",
    },
    {
      icon: LinkIcon,
      action: () => {
        const url = window.prompt("Enter URL");
        if (url) editor.chain().focus().setLink({ href: url }).run();
      },
      active: editor.isActive("link"),
      label: "Link",
    },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-2 py-1.5 dark:border-slate-700 dark:bg-slate-800/50">
        {tools.map((tool) => (
          <button
            key={tool.label}
            type="button"
            onClick={tool.action}
            title={tool.label}
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700",
              tool.active && "bg-brand-red/10 text-brand-red dark:bg-brand-red/20",
            )}
          >
            <tool.icon className="h-4 w-4" />
          </button>
        ))}
        <div className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-700" />
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-200 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-700"
        >
          <Undo className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-200 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-700"
        >
          <Redo className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <EditorContent editor={editor} />
    </div>
  );
}
