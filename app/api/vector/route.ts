import { loadVectorStore } from "@/lib/vectorStore";
import { pull } from "langchain/hub";
import { ChatOpenAI } from "@langchain/openai";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { currentUser } from "@clerk/nextjs/server";
import { clearUserCache, getUserData } from "@/lib/getData";

export async function POST(request: Request) {
  const llm = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 1,
  });
  const encoder = new TextEncoder();
  const vectorStore = await loadVectorStore();
  const { messages = [] } = await request.json();
  const userMessages = messages.filter((i: any) => i.role === "user");
  const input = userMessages[userMessages.length - 1].content;
  const retrievalQAChatPrompt = await pull<ChatPromptTemplate>(
    "langchain-ai/retrieval-qa-chat",
  );
  const retriever = vectorStore.asRetriever({
    k: 3,
    searchType: "similarity",
  });
  const combineDocsChain = await createStuffDocumentsChain({
    llm,
    prompt: retrievalQAChatPrompt,
  });
  const retrievalChain = await createRetrievalChain({
    retriever,
    combineDocsChain,
  });

  const user = await currentUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress ?? "";
  if (!user) {
    // Clear cache if signout
    clearUserCache(userEmail);
    return new Response("Unauthorized", { status: 401 });
  }

  // Fetch data and filter data based on user email address (unique)
  const incomeData = await getUserData(userEmail);
  const customReadable = new ReadableStream({
    async start(controller) {
      const stream = await retrievalChain.stream({
        input,
        chat_history: [
          {
            role: "system",
            content:
              "You are an assistant bot that answers users about their data. Only answer questions relating to this given context or questions relating to finance in general. If the questions from user are not related to this given context or finance, simply say that you cannot answer. Furthermore, when mentioning date, always follow this format: first three letters month, date, then year.",
          },
          { role: "system", content: JSON.stringify(incomeData) },
          ...messages.map((i: any) =>
            i.role === "user"
              ? new HumanMessage(i.content)
              : new AIMessage(i.content),
          ),
        ],
      });
      for await (const chunk of stream) {
        controller.enqueue(encoder.encode(chunk.answer));
      }
      controller.close();
    },
  });
  return new Response(customReadable, {
    headers: {
      Connection: "keep-alive",
      "Content-Encoding": "none",
      "Cache-Control": "no-cache, no-transform",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
