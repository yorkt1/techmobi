import React, { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import { Bold, Italic, List, ListOrdered, Link as LinkIcon } from "lucide-react";

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TiptapEditor({ value, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({
        openOnClick: false,
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || "");
    }
  }, [editor, value]);

  const handleLink = () => {
    if (!editor) return;
    const url = window.prompt("Insira o link (https://example.com)");
    if (!url) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url, target: "_blank" }).run();
  };

  return (
    <div className="rounded-sm border border-border bg-white">
      <div className="flex flex-wrap gap-2 border-b border-border bg-slate-50 p-2">
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className="rounded-sm border border-border bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          disabled={!editor}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className="rounded-sm border border-border bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          disabled={!editor}
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className="rounded-sm border border-border bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          disabled={!editor}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className="rounded-sm border border-border bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          disabled={!editor}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleLink}
          className="rounded-sm border border-border bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          disabled={!editor}
        >
          <LinkIcon className="w-4 h-4" />
        </button>
      </div>
      <div className="min-h-[220px] p-4">
        <EditorContent editor={editor} className="min-h-[200px] focus:outline-none" />
      </div>
    </div>
  );
}
