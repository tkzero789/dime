"use client";

import React from "react";
import { useChat } from "ai/react";
import { BotMessageSquare } from "lucide-react";
import ChatForm from "./_components/ChatForm";
import ChatTools from "./_components/ChatTools";
import Markdown from "react-markdown";
import "@/css/app.css";

export default function PennyPage() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setInput,
  } = useChat({
    api: "api/vector",
    streamProtocol: "text",
    onError: (e) => {
      console.log(e);
    },
  });

  const [isEmpty, setIsEmpty] = React.useState<boolean>(true);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const withConditionalClass =
    (Component: any) => (props: React.HTMLAttributes<HTMLElement>) => {
      const heading = ["h1", "h2", "h3"].includes(Component)
        ? "font-bold text-lg mt-4"
        : "";
      const subHeading = ["h4", "h5", "h6"].includes(Component)
        ? "font-bold"
        : "";
      const order = ["ol"].includes(Component)
        ? "list-decimal pl-8 md:pl-10 ol-adjust"
        : "";
      const unordered = ["ul"].includes(Component)
        ? "list-disc pl-8 md:pl-10"
        : "";
      const listItem = ["li"].includes(Component) ? "mb-0" : "";
      const strong = ["strong"].includes(Component) ? "font-semibold" : "";

      return (
        <Component
          className={`mb-2 ${heading} ${subHeading} ${order} ${unordered} ${listItem} ${strong}`}
          {...props}
        />
      );
    };

  const components = {
    p: withConditionalClass("p"),
    ul: withConditionalClass("ul"),
    ol: withConditionalClass("ol"),
    li: withConditionalClass("li"),
    h1: withConditionalClass("h1"),
    h2: withConditionalClass("h2"),
    h3: withConditionalClass("h3"),
    h4: withConditionalClass("h4"),
    h5: withConditionalClass("h5"),
    h6: withConditionalClass("h6"),
    strong: withConditionalClass("strong"),
  };

  const handleUserSubmit = (e: any) => {
    e.preventDefault();
    setIsEmpty(!isEmpty);
  };

  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="mx-auto flex h-full w-full flex-col md:w-[48rem]">
      <ChatTools handleUserSubmit={handleUserSubmit} setInput={setInput} />
      <div className="flex-1 overflow-hidden px-8 pb-56 pt-24">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`mt-4 ${m.role === "assistant" ? "flex gap-2" : ""}`}
          >
            {m.role === "assistant" && (
              <div className="mt-2">
                <BotMessageSquare className="h-6 w-6" />
              </div>
            )}
            <div
              className={`chat-content w-fit rounded-xl px-4 py-2 ${m.role === "user" ? "ml-auto bg-teal-600 bg-opacity-90 text-white" : "bg-gray-200 bg-opacity-80"}`}
            >
              <Markdown components={components}>{m.content}</Markdown>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <ChatForm
        isEmpty={isEmpty}
        setIsEmpty={setIsEmpty}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
