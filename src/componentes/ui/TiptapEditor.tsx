import React, { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Unlink,
  Quote,
  Heading2,
  Heading3,
} from "lucide-react";

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
}

function normalizeUrl(raw: string) {
  const url = raw.trim();
  if (!url) return "";
  // Aceita links de e-mail, telefone e âncoras sem prefixar https://
  if (/^(https?:\/\/|mailto:|tel:|#)/i.test(url)) return url;
  return `https://${url}`;
}

export default function TiptapEditor({ value, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
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
    const previous = editor.getAttributes("link").href ?? "";
    const input = window.prompt("Insira o link (ex.: site.com.br ou https://site.com.br)", previous);
    if (input === null) return; // cancelou
    const url = normalizeUrl(input);
    if (!url) {
      // campo vazio → remove o link
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url, target: "_blank", rel: "noopener noreferrer" })
      .run();
  };

  const handleUnlink = () => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
  };

  const btn = (active: boolean) =>
    `rounded-sm border px-2.5 py-1.5 text-slate-700 transition-colors disabled:opacity-40 ${
      active
        ? "border-navy-900 bg-navy-900 text-white"
        : "border-border bg-white hover:bg-slate-100"
    }`;

  return (
    <div className="rounded-sm border border-border bg-white">
      <div className="flex flex-wrap gap-1.5 border-b border-border bg-slate-50 p-2">
        <button
          type="button"
          title="Negrito"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={btn(Boolean(editor?.isActive("bold")))}
          disabled={!editor}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Itálico"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={btn(Boolean(editor?.isActive("italic")))}
          disabled={!editor}
        >
          <Italic className="w-4 h-4" />
        </button>

        <span className="mx-1 w-px self-stretch bg-border" />

        <button
          type="button"
          title="Título"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          className={btn(Boolean(editor?.isActive("heading", { level: 2 })))}
          disabled={!editor}
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Subtítulo"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          className={btn(Boolean(editor?.isActive("heading", { level: 3 })))}
          disabled={!editor}
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <span className="mx-1 w-px self-stretch bg-border" />

        <button
          type="button"
          title="Lista com marcadores"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={btn(Boolean(editor?.isActive("bulletList")))}
          disabled={!editor}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Lista numerada"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={btn(Boolean(editor?.isActive("orderedList")))}
          disabled={!editor}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Citação"
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          className={btn(Boolean(editor?.isActive("blockquote")))}
          disabled={!editor}
        >
          <Quote className="w-4 h-4" />
        </button>

        <span className="mx-1 w-px self-stretch bg-border" />

        <button
          type="button"
          title="Inserir / editar link"
          onClick={handleLink}
          className={btn(Boolean(editor?.isActive("link")))}
          disabled={!editor}
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Remover link"
          onClick={handleUnlink}
          className={btn(false)}
          disabled={!editor || !editor.isActive("link")}
        >
          <Unlink className="w-4 h-4" />
        </button>
      </div>
      <div className="min-h-[220px] p-4">
        <EditorContent editor={editor} className="rich-text min-h-[200px] focus:outline-none" />
      </div>
    </div>
  );
}
