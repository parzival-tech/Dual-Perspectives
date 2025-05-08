import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { getChatCompletion } from '../services/groqService'; // Adjust path if necessary
import styles from './CaseStudyChatbox.module.css';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

interface CaseStudyChatboxProps {
  caseTitle: string;
  caseDescription: string;
  currentScenarioTitle?: string;
  currentScenarioDescription?: string;
  isVisible: boolean; // To control chatbox visibility
}

const CaseStudyChatbox: React.FC<CaseStudyChatboxProps> = ({
  caseTitle,
  caseDescription,
  currentScenarioTitle,
  currentScenarioDescription,
  isVisible,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [userInput]);

  const handleSendMessage = async () => {
    if (userInput.trim() === '' || isLoading) return;
    console.log("[Chatbox] Attempting to send message...");

    const userMessage: ChatMessage = {
      id: Date.now().toString() + '-user',
      sender: 'user',
      text: userInput,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    const currentMessageText = userInput;
    setUserInput('');
    setIsLoading(true);

    let context = `Case Study Title: "${caseTitle}"\nCase Study Description: "${caseDescription}"\n`;
    if (currentScenarioTitle) {
      context += `Current Scenario: "${currentScenarioTitle}"\n`;
    }
    if (currentScenarioDescription) {
      context += `Scenario Details: "${currentScenarioDescription}"\n`;
    }
    console.log("[Chatbox] Context for AI:", context);

    const promptMessages = [
      {
        role: 'system',
        content: `You are an AI assistant for a case study game. Answer questions based ONLY on the provided case study and scenario context. If a question is outside this scope, politely state that you cannot answer. Be concise and helpful. Current Context:\n${context}`,
      },
      { role: 'user', content: currentMessageText },
    ];
    console.log("[Chatbox] Prompt messages being sent:", JSON.stringify(promptMessages, null, 2));
    console.log("[Chatbox] VITE_GROQ_API_KEY available?", import.meta.env.VITE_GROQ_API_KEY ? 'Yes' : 'No - THIS IS A PROBLEM!');

    try {
      const apiResponse = await getChatCompletion({
        model: 'qwen-qwq-32b',
        messages: promptMessages,
        temperature: 0.5,
        max_completion_tokens: 1024,
        stream: false,
      });
      console.log("[Chatbox] Raw API Response object:", apiResponse);

      if (apiResponse.choices && apiResponse.choices[0] && apiResponse.choices[0].message && apiResponse.choices[0].message.content) {
        let rawText = apiResponse.choices[0].message.content.trim();
        console.log("[Chatbox] Raw AI text BEFORE cleaning:", JSON.stringify(rawText));
        const cleanedText = rawText.replace(/<think>[\s\S]*?<\/think>\s*/gi, '').trim();
        console.log("[Chatbox] AI text AFTER cleaning:", JSON.stringify(cleanedText));

        const aiMessage: ChatMessage = {
          id: Date.now().toString() + '-ai',
          sender: 'ai',
          text: cleanedText, // Use the cleaned text
        };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      } else {
        console.error("[Chatbox] AI response structure incorrect or content missing. Response data:", apiResponse);
        throw new Error('No content in AI response or unexpected structure');
      }
    } catch (error) {
      console.error("[Chatbox] Error during handleSendMessage:", error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + '-error',
        sender: 'ai',
        text: 'Sorry, I encountered an error trying to respond. Please try again.',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent newline on Enter
      handleSendMessage();
    }
    // Allow newline with Shift+Enter (default textarea behavior)
  };

  return (
    <>
      {isVisible && (
        <>
          <div className={styles.chatOverlay}></div>
          <div className={`${styles.chatboxContainer} ${styles.v0}`}>
            <div className={styles.messagesContainer}>
              {messages.map((msg) => (
                <div key={msg.id} className={`${styles.message} ${styles[msg.sender]}`}>
                  {msg.sender === 'ai' ? (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  ) : (
                    <p>{msg.text}</p>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className={styles.inputAreaV0}>
              <textarea
                ref={textareaRef}
                rows={1}
                value={userInput}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Ask about the case..."
                disabled={isLoading}
                className={styles.inputFieldV0}
              />
              <button onClick={handleSendMessage} disabled={isLoading || userInput.trim() === ''} className={styles.sendButtonV0}>
                {isLoading ? (
                  <span className={styles.loadingSpinner}></span>
                ) : (
                  <svg className={styles.sendIcon} viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CaseStudyChatbox; 