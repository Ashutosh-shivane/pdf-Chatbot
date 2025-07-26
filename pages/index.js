import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


export default function Home() {
  const [file, setFile] = useState(null);
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a PDF');
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/ask', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setMessages([{ role: 'bot', text: data.answer }]);
    setPdfUploaded(true);
    setLoading(false);
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput) return;

    const userMessage = { role: 'user', text: chatInput };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: chatInput }),
    });

    const data = await res.json();

    const cleanedText = data.answer.replace(/^\s*\*+\s?/gm, ''); 

    setMessages((prev) => [...prev, { role: 'bot', text: cleanedText }]);
    setChatInput('');
    setLoading(false);
  };

  return (
    <div className="container py-5">
      <div className="card shadow-sm p-4">
        <h1 className="text-center text-primary mb-4">📄 PDF Chatbot</h1>

        {!pdfUploaded && (
          <form onSubmit={handleFileSubmit}>
            <div className="mb-3">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Upload PDF
            </button>
          </form>
        )}

        {pdfUploaded && (
          <>
            <h4 className="mt-4 mb-3">💬 Ask Questions</h4>
            <div className="border rounded p-3 mb-3" style={{ height: '300px', overflowY: 'auto' }}>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`alert ${msg.role === 'user' ? 'alert-primary text-end' : 'alert-success text-start'}`}
                >
                  <strong>{msg.role === 'user' ? 'You' : 'Bot'}:</strong> {msg.text}
                </div>
              ))}
              {loading && <p className="text-muted fst-italic">Bot is thinking...</p>}
            </div>

            <form onSubmit={handleChatSubmit} className="d-flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="form-control"
                placeholder="Ask something..."
              />
              <button type="submit" className="btn btn-success">
                Send
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}