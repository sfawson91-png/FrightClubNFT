import { useState, useEffect } from 'react';

export const useTypeAnimation = (text: string, delay: number) => {
  const [typedText, setTypedText] = useState<string>('');
  const [completed, setCompleted] = useState<boolean>(false);

  useEffect(() => {
    let compiledText = '';
    let i = 0;
    
    setTypedText('');
    setCompleted(false);
    
    const frames: string[] = [];  // Explicitly set type here
    for (let i = 0; i < text.length; i++) {
      compiledText += text[i];
      frames.push(compiledText);
    }

    const timer = setInterval(() => {
      if (i < frames.length) {
        setTypedText(frames[i]);
        i++;
      } else {
        clearInterval(timer);
        setCompleted(true);
      }
    }, delay);

    return () => {
      clearInterval(timer);
    };
  }, [text, delay]);

  return { typedText, completed };
};
