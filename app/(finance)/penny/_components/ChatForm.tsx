import { Button } from "@/components/ui/button";
import { CircleArrowUp } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";
import ChatInput from "./ChatInput";

type Props = {
  isEmpty: boolean;
  setIsEmpty: Dispatch<SetStateAction<boolean>>;
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: () => void;
  isLoading: boolean;
};

export default function ChatForm({
  isEmpty,
  setIsEmpty,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
}: Props) {
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e);
    setIsEmpty(e.currentTarget.value.trim() === "");
  };

  const handleFormSubmit = React.useCallback(() => {
    handleSubmit();
    setIsEmpty(true);
  }, [handleSubmit, setIsEmpty]);

  React.useEffect(() => {
    if (
      (input === "What are my potential saving right now for this month?" ||
        input === "Give me an overall detail about my budgets for this month" ||
        input ===
          "Review and analyze my income and spending. What can I do to improve my current finance situation for this month?") &&
      !isEmpty
    ) {
      handleFormSubmit();
    }
  }, [input, isEmpty, handleFormSubmit]);

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <div className="fixed bottom-0 mx-auto w-full bg-white px-2 pb-20 sm:px-4 md:w-[48rem] lg:px-0 lg:pb-8">
          <div className="flex items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white p-2 shadow-none sm:p-3 lg:shadow-md">
            <ChatInput input={input} handleInput={handleInput} />
            <Button
              variant="outline"
              className={`rounded-lg px-2 py-1 ${
                isEmpty && !isLoading
                  ? "pointer-events-none"
                  : "border-teal-600 bg-teal-600 transition-all duration-300 hover:border-teal-700 hover:bg-teal-700"
              }`}
              onClick={handleFormSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex size-6 items-center justify-center">
                  <div
                    className="inline-block size-4 animate-spin rounded-full border-2 border-t-transparent text-gray-800 dark:text-white"
                    role="status"
                    aria-label="loading"
                  >
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : (
                <CircleArrowUp
                  strokeWidth={1}
                  className={`${isEmpty ? "" : "size-6 stroke-white transition-all duration-300"} `}
                />
              )}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
