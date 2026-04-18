import { useEffect, useState } from "react";

export function useTypewriter(text: string, speed = 80, startDelay = 300, trigger = true) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    setOut("");
    setDone(false);
    let i = 0;
    const start = setTimeout(() => {
      const t = setInterval(() => {
        i++;
        setOut(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(t);
          setDone(true);
        }
      }, speed);
    }, startDelay);
    return () => clearTimeout(start);
  }, [text, speed, startDelay, trigger]);

  return { text: out, done };
}
