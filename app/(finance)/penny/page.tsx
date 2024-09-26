"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useChat } from "ai/react";
import { CircleArrowUp } from "lucide-react";
import ChatInputForm from "./_components/ChatInputForm";

export default function PennyPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [isEmpty, setIsEmpty] = React.useState<boolean>(true);

  const handleInput = (e: any) => {
    handleInputChange(e);
    setIsEmpty(e.target.value.trim() === "");
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-xl flex-col">
      <div className="flex-1 overflow-hidden pb-56 pt-24">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`mt-4 w-fit whitespace-pre-wrap rounded-lg p-4 ${m.role === "user" ? "ml-auto bg-gray-200" : "bg-teal-500 bg-opacity-50"}`}
          >
            {m.role === "user" ? "" : "Penny: "}
            {m.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="fixed bottom-0 mx-auto w-[36rem] bg-white pb-8 pt-4">
          <div className="flex justify-between gap-2 rounded-lg border border-gray-300 bg-white p-2 shadow-md">
            <ChatInputForm input={input} handleInput={handleInput} />
            <Button
              variant="ghost"
              className={`rounded-xl px-2 py-1 ${
                isEmpty
                  ? ""
                  : "border-teal-600 bg-teal-600 transition-all duration-300"
              } `}
            >
              <CircleArrowUp
                strokeWidth={1}
                className={`${isEmpty ? "" : "stroke-white transition-all duration-300"} `}
              />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
