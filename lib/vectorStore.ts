import { NeonPostgres } from "@langchain/community/vectorstores/neon";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Client } from "pg";

const embeddings = new OpenAIEmbeddings({
  dimensions: 512,
  model: "text-embedding-3-small",
});

export async function loadVectorStore() {
  return await NeonPostgres.initialize(embeddings, {
    connectionString: process.env.NEXT_PUBLIC_DATABASE_URL as string,
  });
}
