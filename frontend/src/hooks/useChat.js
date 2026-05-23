import { useState, useRef, useCallback } from "react";

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState("normal");
  const abortControllerRef = useRef(null);

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const clearChat = useCallback(() => {
    cancelRequest();
    setMessages([]);
    setIsLoading(false);
  }, [cancelRequest]);

  const switchMode = useCallback((newMode) => {
    cancelRequest();
    setMode(newMode);
    setMessages([]);
    setIsLoading(false);
  }, [cancelRequest]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isLoading) return;

    cancelRequest();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: text,
      timestamp: new Date()
    };

    const aiMessageId = Date.now() + 1;
    const aiMessage = {
      id: aiMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true
    };

    setMessages(prev => [...prev, userMessage, aiMessage]);
    setIsLoading(true);

    const finishMessage = (patch) => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === aiMessageId ? { ...msg, ...patch, isStreaming: false } : msg
        )
      );
    };

    const appendChunk = (chunk) => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === aiMessageId
            ? { ...msg, content: msg.content + chunk }
            : msg
        )
      );
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || ""}/api/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, mode }),
          signal: controller.signal
        }
      );

      if (!response.ok || !response.body) {
        finishMessage({ content: "Connection error. Please try again." });
        setIsLoading(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let receivedAny = false;
      let errored = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });

        let idx;
        while ((idx = buf.indexOf("\n\n")) !== -1) {
          const frame = buf.slice(0, idx);
          buf = buf.slice(idx + 2);
          if (!frame.startsWith("data:")) continue;

          let payload;
          try {
            payload = JSON.parse(frame.slice(5).trim());
          } catch {
            continue;
          }

          if (payload.error) {
            errored = true;
            if (receivedAny) {
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === aiMessageId
                    ? { ...msg, content: `${msg.content}\n\n_${payload.error}_`, isStreaming: false }
                    : msg
                )
              );
            } else {
              finishMessage({ content: payload.error });
            }
            try { await reader.cancel(); } catch {}
            break;
          }
          if (payload.chunk) {
            receivedAny = true;
            appendChunk(payload.chunk);
          }
          if (payload.done) {
            finishMessage({});
            try { await reader.cancel(); } catch {}
            break;
          }
        }
        if (errored) break;
      }

      if (!receivedAny && !errored) {
        finishMessage({ content: "No response received." });
      } else if (!errored) {
        finishMessage({});
      }
      setIsLoading(false);
      abortControllerRef.current = null;
    } catch (err) {
      if (err.name === "AbortError") {
        finishMessage({ content: "Request cancelled." });
      } else {
        finishMessage({ content: "Connection error. Please try again." });
      }
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [isLoading, mode, cancelRequest]);

  return {
    messages,
    isLoading,
    mode,
    setMode: switchMode,
    sendMessage,
    clearChat
  };
}
