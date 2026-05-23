import { useEffect, useRef, useState } from "react";
import { SpeakerLoudIcon, SpeakerOffIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

function getRecognition() {
  if (typeof window === "undefined") return null;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  return SR ? new SR() : null;
}

export default function VoiceInputButton({ onTranscript, disabled }) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recRef = useRef(null);

  useEffect(() => {
    const rec = getRecognition();
    if (!rec) { setSupported(false); return; }
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onresult = (event) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t;
        else interim += t;
      }
      onTranscript?.((final + " " + interim).trim());
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    return () => {
      try { rec.stop(); } catch {}
    };
  }, [onTranscript]);

  if (!supported) return null;

  const toggle = () => {
    const rec = recRef.current;
    if (!rec) return;
    if (listening) {
      try { rec.stop(); } catch {}
      setListening(false);
    } else {
      try { rec.start(); setListening(true); } catch {}
    }
  };

  return (
    <motion.button
      type="button"
      onClick={toggle}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.04 } : {}}
      whileTap={!disabled ? { scale: 0.96 } : {}}
      aria-label={listening ? "Stop listening" : "Speak your idea"}
      title={listening ? "Stop listening" : "Speak your idea"}
      className={cn(
        "h-11 w-11 rounded-xl border flex items-center justify-center transition-colors",
        listening
          ? "bg-destructive/15 border-destructive/40 text-destructive animate-pulse"
          : "bg-card border-input text-muted-foreground hover:text-foreground hover:bg-accent",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {listening ? <SpeakerOffIcon className="h-4 w-4" /> : <SpeakerLoudIcon className="h-4 w-4" />}
    </motion.button>
  );
}
