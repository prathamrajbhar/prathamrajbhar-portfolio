"use client";

import { ImageIcon, Table2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";

type MdxEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

const tableSnippet = `
| Item | Notes |
| --- | --- |
| Example | Add your details here |
`;

export function MdxEditor({ value, onChange }: MdxEditorProps) {
  function append(snippet: string) {
    onChange(`${value.trimEnd()}\n\n${snippet.trim()}\n`);
  }

  function addImage(url: string) {
    append(`![Describe this image](${url})`);
  }

  return (
    <div className="overflow-hidden rounded-[8px] border border-border bg-bg">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface p-2">
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="ghost" icon={<ImageIcon size={16} />} onClick={() => append("![Alt text](https://example.com/image.jpg)")}>
            Image
          </Button>
          <Button type="button" size="sm" variant="ghost" icon={<Table2 size={16} />} onClick={() => append(tableSnippet)}>
            Table
          </Button>
        </div>
        <ImageUpload onUploaded={addImage} />
      </div>
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[520px] resize-y rounded-none border-0 bg-bg p-4 font-mono text-sm leading-7 focus:ring-0"
        spellCheck={false}
        placeholder={`# Heading

Write MDX or Markdown here.

![Screenshot](https://example.com/image.png)

- Point one
- Point two

| Feature | Status |
| --- | --- |
| Tables | Supported |`}
      />
      <div className="border-t border-border bg-surface px-4 py-3 text-xs text-muted">
        Supports headings, lists, images, links, blockquotes, code fences, tables, and MDX components.
      </div>
    </div>
  );
}
