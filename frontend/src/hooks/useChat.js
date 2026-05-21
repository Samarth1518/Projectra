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

    const aiMessage = {
      id: Date.now() + 1,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true
    };

    setMessages(prev => [...prev, userMessage, aiMessage]);
    setIsLoading(true);

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

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === aiMessage.id
                    ? { ...msg, isStreaming: false }
                    : msg
                )
              );
              setIsLoading(false);
              abortControllerRef.current = null;
              return;
            }
            if (data.startsWith("[ERROR]")) {
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === aiMessage.id
                    ? {
                        ...msg,
                        content: "Something went wrong. Please try again.",
                        isStreaming: false
                      }
                    : msg
                )
              );
              setIsLoading(false);
              return;
            }
            // Restore escaped newlines
            const chunk = data.replace(/\\n/g, "\n");
            setMessages(prev =>
              prev.map(msg =>
                msg.id === aiMessage.id
                  ? { ...msg, content: msg.content + chunk }
                  : msg
              )
            );
          }
        }
      }
    } catch (err) {
      if (err.name === "AbortError") {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMessage.id
              ? { ...msg, content: "Request cancelled.", isStreaming: false }
              : msg
          )
        );
      } else {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMessage.id
              ? {
                  ...msg,
                  content: "Connection error. Is the backend running?",
                  isStreaming: false
                }
              : msg
          )
        );
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
