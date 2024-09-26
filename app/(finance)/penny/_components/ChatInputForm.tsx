import React from "react";

type Props = {
  input: string;
  handleInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export default function ChatInputForm({ input, handleInput }: Props) {
  const ref = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      const textarea = ref.current;
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 5 * 24)}px`;
    }
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        e.preventDefault();
        const textarea = e.target as HTMLTextAreaElement;
        const start = textarea.selectionStart ?? 0;
        const end = textarea.selectionEnd ?? 0;
        const value = textarea.value;
        textarea.value =
          value.substring(0, start) + "\n" + value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 1;
        handleInput(e as any);
      } else {
        e.preventDefault();
        const form = e.currentTarget.form;
        if (form) {
          form.dispatchEvent(
            new Event("submit", { cancelable: true, bubbles: true }),
          );
        }
      }
    }
  };

  return (
    <textarea
      ref={ref}
      className="w-full flex-1 resize-none outline-none"
      value={input}
      placeholder="Hi, how can I help you?"
      onChange={handleInput}
      onKeyDown={handleKeyDown}
      rows={2}
      style={{ maxHeight: "120px" }}
    />
  );
}
