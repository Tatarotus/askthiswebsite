"use client";

import { useChat } from "ai/react";

const ChatWrapper = ({ sessionId }: { sessionId: string }) => {
  const { messages, handleInputChange, handleSubmit, input } = useChat({
    api: "/api/chat-stream",
    body: { sessionId },
  });
  return (
    <div className="relative min-h-full bg-zinc-900 flex divide-y divide-zinc-700 flex-col justify-between gap-2">
      <div className="flex-1 text-white bg-zinc-800 justify-between flex flex-col">
        {JSON.stringify(messages)}
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-zinc-800 flex text-center mx-auto"
      >
        <input value={input} onChange={handleInputChange} type="text" />
        <button type="submit" className="text-black bg-gray-50 px-4 mx-4">
          send
        </button>
      </form>
    </div>
  );
};

export default ChatWrapper;
