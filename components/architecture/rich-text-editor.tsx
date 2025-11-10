'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const controls: { label: string; command: string; aria: string }[] = [
  { label: 'Bold', command: 'bold', aria: 'Toggle bold' },
  { label: 'Italic', command: 'italic', aria: 'Toggle italic' },
  { label: 'Underline', command: 'underline', aria: 'Toggle underline' },
  { label: '• List', command: 'insertUnorderedList', aria: 'Toggle bullet list' },
  { label: '1. List', command: 'insertOrderedList', aria: 'Toggle numbered list' },
];

export type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  id: string;
  describedBy?: string;
  className?: string;
};

export function RichTextEditor({ value, onChange, id, describedBy, className }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleCommand = (command: string) => {
    document.execCommand(command);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className={cn('rounded-lg border border-input bg-background shadow-sm', className)}>
      <div className="flex flex-wrap gap-2 border-b border-border p-2" role="toolbar" aria-label="Formatting options">
        {controls.map((control) => (
          <Button
            key={control.command}
            type="button"
            size="sm"
            variant="secondary"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => handleCommand(control.command)}
            aria-label={control.aria}
          >
            {control.label}
          </Button>
        ))}
      </div>
      <div
        ref={editorRef}
        id={id}
        aria-describedby={describedBy}
        className="min-h-[200px] w-full resize-y rounded-b-lg bg-card px-4 py-3 text-sm outline-none focus:border focus:border-ring"
        contentEditable
        role="textbox"
        aria-multiline="true"
        suppressContentEditableWarning
        onInput={(event) => onChange((event.target as HTMLDivElement).innerHTML)}
      />
    </div>
  );
}
