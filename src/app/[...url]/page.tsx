import { ragChat } from "@/lib/rag-chat";
import { redis } from "@/lib/redis";

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
  const isAlreadyIndex = await redis.sismember("indexedUrls", reconstructedUrl);

  const sessionId = "mock-session";

  if (!isAlreadyIndex) {
    await ragChat.context.add({
      type: "html",
      source: reconstructedUrl,
      config: { chunkOverlap: 50, chunkSize: 500 },
    });
    await redis.sadd("indexedUrls", reconstructedUrl);
  }

  return <pre>{JSON.stringify(params.url, null, 2)}</pre>;
};

export default Pages;
