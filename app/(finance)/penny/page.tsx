"use client";

import React from "react";
import { useChat } from "ai/react";
import { BotMessageSquare } from "lucide-react";
import ChatForm from "./_components/form/ChatForm";
import ChatTools from "./_components/tools/ChatTools";

export default function PennyPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();

  const processContent = (content: string) => {
    return content.replace(
      /\*\*(.*?)\*\*/g,
      '<span class="font-semibold">$1</span>',
    );
  };

  return (
    <div className="mx-auto flex h-full w-full flex-col md:w-[48rem]">
      <ChatTools />
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
              className={`w-fit whitespace-pre-wrap rounded-xl px-4 py-2 ${m.role === "user" ? "ml-auto bg-teal-600 bg-opacity-90 text-white" : "bg-gray-200 bg-opacity-80"}`}
              dangerouslySetInnerHTML={{ __html: processContent(m.content) }}
            ></div>
          </div>
        ))}
      </div>
      <ChatForm
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
