import React, { useState } from 'react';
import { MessageCircle, Send, Loader2 } from 'lucide-react';
import OpenAI from 'openai';
import ReactMarkdown from 'react-markdown';

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY,
  dangerouslyAllowBrowser: true,
});

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    setIsLoading(true);

    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful assistant for children. Provide simple, fun, and educational answers. Use Markdown formatting to make your responses more engaging." },
          ...messages,
          { role: "user", content: input }
        ],
        model: "deepseek-chat",
      });

      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'assistant', content: completion.choices[0].message.content || 'Sorry, I couldn\'t generate a response.' }
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'assistant', content: 'Oops! Something went wrong. Please try again.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 flex flex-col">
      <header className="bg-white shadow-md p-4">
        <h1 className="text-3xl font-bold text-center text-purple-600">KidsChat with DeepSeek</h1>
      </header>
      <main className="flex-grow container mx-auto p-4 flex flex-col">
        <div className="flex-grow bg-white rounded-lg shadow-xl p-4 mb-4 overflow-y-auto">
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-3 rounded-lg ${message.role === 'user' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                {message.role === 'user' ? (
                  message.content
                ) : (
                  <ReactMarkdown className="markdown-content">{message.content}</ReactMarkdown>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-center">
              <Loader2 className="animate-spin h-8 w-8 text-purple-500 mx-auto" />
              <p className="text-purple-500 mt-2">Thinking...</p>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything!"
            className="flex-grow p-3 rounded-l-lg border-2 border-purple-300 focus:outline-none focus:border-purple-500"
          />
          <button type="submit" className="bg-purple-500 text-white p-3 rounded-r-lg hover:bg-purple-600 transition duration-300">
            <Send size={24} />
          </button>
        </form>
      </main>
      <footer className="bg-white shadow-md p-4 text-center text-purple-600">
        <p>Made with ❤️ for curious kids!</p>
      </footer>
    </div>
  );
}

export default App;