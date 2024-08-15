import ChatWrapper from "@/components/ChatWrapper";
import { ragChat } from "@/lib/rag-chat";
import { redis } from "@/lib/redis";
import { cookies } from "next/headers";

interface PageProps {
  params: {
    url: string | string[] | undefined;
  };
}

function reconstructUrl({ url }: { url: string[] }) {
  const decodedComponents = url.map((component) =>
    decodeURIComponent(component)
  );
  return decodedComponents.join("/");
}

const Pages = async ({ params }: PageProps) => {
  const reconstructedUrl = reconstructUrl({ url: params.url as string[] });
  const sessionCookie = cookies().get("sessionId")?.value;
  const sessionId = (reconstructedUrl + "---" + sessionCookie).replace(
    /\//g,
    ""
  );
  const isAlreadyIndex = await redis.sismember("indexedUrls", reconstructedUrl);

  const initialMessages = await ragChat.history.getMessages({
    amount: 10,
    sessionId, 
  });

  if (!isAlreadyIndex) {
    await ragChat.context.add({
      type: "html",
      source: reconstructedUrl,
      config: { chunkOverlap: 50, chunkSize: 500 },
    });
    await redis.sadd("indexedUrls", reconstructedUrl);
  }

  return (
    <>
      <ChatWrapper sessionId={sessionId} initialMessages={initialMessages} />
    </>
  ); 
};

export default Pages;
