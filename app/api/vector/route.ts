import { getIncomeData, loadVectorStore } from "@/lib/vectorStore";

import { pull } from "langchain/hub";
import { ChatOpenAI } from "@langchain/openai";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const llm = new ChatOpenAI();
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
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  // Fetch data and filter data based on user email address (unique)
  const incomeData = await getIncomeData();
  const filterData = incomeData.filter((i) => i.created_by === userEmail);
  // const incomeMessages = filterData.map(
  //   (row: any) =>
  //     new AIMessage(
  //       `ID: ${row.id}, Name: ${row.name}, Amount: $${row.amount}, Category: ${row.category}, Payment method: ${row.payment_method}, Date: ${row.date}, Created By: ${row.created_by}`,
  //     ),
  // );

  const customReadable = new ReadableStream({
    async start(controller) {
      const stream = await retrievalChain.stream({
        input,
        chat_history: [
          { role: "system", content: JSON.stringify(filterData) },
          ...messages.map((i: any) =>
            i.role === "user"
              ? new HumanMessage(i.content)
              : new AIMessage(i.content),
          ),
        ],
        additional_context: incomeData,
      });
      for await (const chunk of stream) {
        console.log(chunk.answer);
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
