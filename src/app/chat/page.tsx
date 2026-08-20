import { Suspense } from "react";
import Chat from "@/components/chat";

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Chat />
    </Suspense>
  );
}
