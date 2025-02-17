import React from 'react';
import Typography from '../common/typography';

const defaultMessages = ['Fetching data...', 'Loading...', 'Analyzing...'];

interface TypingLoaderProps {
  messages?: string[];
}

const TypingLoader: React.FC<TypingLoaderProps> = ({ messages = defaultMessages }) => {
  const [isTyping, setIsTyping] = React.useState(true);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [currentMessage, setCurrentMessage] = React.useState('');
  const [displayedMessages, setDisplayedMessages] = React.useState<string[]>([]);

  React.useEffect(() => {
    const typingInterval = setInterval(() => {
      if (isTyping) {
        if (currentMessage.length < messages[currentIndex].length) {
          setCurrentMessage((prev) => prev + messages[currentIndex][prev.length]);
        } else {
          setIsTyping(false);
          setTimeout(() => {
            setDisplayedMessages((prev) => [...prev, messages[currentIndex]]);
            setCurrentMessage('');
            setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
            setIsTyping(true);
          }, 1000);
        }
      }
    }, 15);

    return (): void => clearInterval(typingInterval);
  }, [currentMessage, currentIndex, isTyping, messages]);

  return (
    <div>
      {displayedMessages.map((message, index) => (
        <Typography.P key={index} className="font-mono text-sm text-secondary-200">
          {message}
        </Typography.P>
      ))}
      <Typography.P className="font-mono text-sm text-secondary-200">
        {currentMessage}
        <span className="animate-blink ml-1">|</span>
      </Typography.P>
    </div>
  );
};

export default TypingLoader;
