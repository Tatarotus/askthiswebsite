import { RAGChat, upstash } from "@upstash/rag-chat";
import { redis } from "./redis";

export const ragChat = new RAGChat({
  model: upstash("meta-llama/Meta-Llama-3-8B-Instruct"),
  // model: upstash("mistralai/Mistral-7B-Instruct-v0.2"),
  redis: redis,
});
