import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { motion } from "framer-motion";

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
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      title={listening ? "Stop listening" : "Speak your idea"}
      className={`
        flex items-center justify-center w-10 h-10 rounded-xl border transition-colors
        ${listening
          ? "bg-red-500/20 border-red-400/60 text-red-400 animate-pulse"
          : "bg-white/[0.04] border-white/10 text-text-secondary hover:text-text-primary"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {listening ? <MicOff size={16} /> : <Mic size={16} />}
    </motion.button>
  );
}
