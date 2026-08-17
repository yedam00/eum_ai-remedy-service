import { Suspense } from "react";
import Chat from "@/components/chat";

function ChatContent() {
  return <Chat />;
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatContent />
    </Suspense>
  );
}
