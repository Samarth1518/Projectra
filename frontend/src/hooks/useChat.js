import { useState, useRef, useCallback } from "react";

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState("normal");
  const abortControllerRef = useRef(null);
  const typewriterRef = useRef(null);

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (typewriterRef.current) {
      clearInterval(typewriterRef.current);
      typewriterRef.current = null;
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

  const typewriterEffect = useCallback((fullText, messageId) => {
    const words = fullText.split(" ");
    let currentIndex = 0;
    let currentText = "";

    typewriterRef.current = setInterval(() => {
      if (currentIndex < words.length) {
        currentText += (currentIndex === 0 ? "" : " ") + words[currentIndex];
        currentIndex++;
        
        setMessages(prev =>
          prev.map(msg =>
            msg.id === messageId
              ? { 
                  ...msg, 
                  content: currentText,
                  isStreaming: currentIndex < words.length
                }
              : msg
          )
        );
      } else {
        clearInterval(typewriterRef.current);
        typewriterRef.current = null;
        setMessages(prev =>
          prev.map(msg =>
            msg.id === messageId
              ? { ...msg, content: fullText, isStreaming: false }
              : msg
          )
        );
        setIsLoading(false);
      }
    }, 30);
  }, []);

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

      const data = await response.json();
      
      if (data.status === "error") {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMessageId
              ? { 
                  ...msg, 
                  content: data.response,
                  isStreaming: false 
                }
              : msg
          )
        );
        setIsLoading(false);
        return;
      }

      typewriterEffect(data.response, aiMessageId);

    } catch (err) {
      if (err.name === "AbortError") {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMessageId
              ? { 
                  ...msg, 
                  content: "Request cancelled.",
                  isStreaming: false 
                }
              : msg
          )
        );
      } else {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMessageId
              ? {
                  ...msg,
                  content: "Connection error. Please try again.",
                  isStreaming: false
                }
              : msg
          )
        );
      }
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [isLoading, mode, cancelRequest, typewriterEffect]);

  return {
    messages,
    isLoading,
    mode,
    setMode: switchMode,
    sendMessage,
    clearChat
  };
}
