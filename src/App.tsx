import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ImageUpload } from './components/ImageUpload';
import { AnalysisPanel, AnalysisData } from './components/AnalysisPanel';
import { ChatWindow } from './components/ChatWindow';
import { Message } from './components/MessageBubble';
import { Loader } from './components/Loader';
import { apiService } from './services/api';

export type ViewType = 'dashboard' | 'activity' | 'statistic' | 'performance' | 'tasks' | 'libraries' | 'saved';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [appState, setAppState] = useState<'upload' | 'analyzing' | 'results'>('upload');
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [userName, setUserName] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState('');
  
  // Data state
  const [imageData, setImageData] = useState<{ data: string; mimeType: string } | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('vision_user_name');
    if (savedName) setUserName(savedName);

    const savedMessages = localStorage.getItem('vision_chat_history');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed);
        if (parsed.length > 0) setAppState('results');
      } catch (e) {
        console.error('Failed to parse saved messages', e);
      }
    }

    const savedAnalysis = localStorage.getItem('vision_last_analysis');
    if (savedAnalysis) {
      try {
        setAnalysis(JSON.parse(savedAnalysis));
      } catch (e) {
        console.error('Failed to parse saved analysis', e);
      }
    }

    const savedImage = localStorage.getItem('vision_last_image');
    if (savedImage) {
      try {
        setImageData(JSON.parse(savedImage));
      } catch (e) {
        console.error('Failed to parse saved image', e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('vision_chat_history', JSON.stringify(messages));
    }
    if (analysis) {
      localStorage.setItem('vision_last_analysis', JSON.stringify(analysis));
    }
    if (imageData) {
      localStorage.setItem('vision_last_image', JSON.stringify(imageData));
    }
  }, [messages, analysis, imageData]);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
      localStorage.setItem('vision_user_name', nameInput.trim());
    }
  };

  const handleUpload = async (file: File) => {
    try {
      setAppState('analyzing');
      
      // 1. Upload to backend to get base64
      const img = await apiService.uploadImage(file);
      setImageData(img);

      // 2. Analyze with Gemini
      const result = await apiService.analyzeImage(img.data, img.mimeType);
      setAnalysis(result);
      
      // 3. Set initial chat message
      const initialMsg: Message = {
        id: Date.now().toString(),
        role: 'model',
        content: `Hi ${userName || 'there'}! I've analyzed the image. I was Trained By Aadi. You can see the structured data above. What else would you like to know about it?`
      };
      setMessages([initialMsg]);
      
      setAppState('results');
    } catch (error) {
      console.error(error);
      alert('An error occurred during analysis. Please try again.');
      setAppState('upload');
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!imageData) return;

    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', content };
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      // Format history for Gemini
      const history = updatedMessages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const replyText = await apiService.sendMessage(content, history, imageData.data, imageData.mimeType);
      
      setMessages(prev => [
        ...prev, 
        { id: (Date.now() + 1).toString(), role: 'model', content: replyText }
      ]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev, 
        { id: (Date.now() + 1).toString(), role: 'model', content: 'Sorry, I encountered an error processing your request.' }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRegenerate = async () => {
    if (messages.length < 2) return;
    
    // Remove last AI message
    const newMessages = messages.slice(0, -1);
    const lastUserMsg = newMessages[newMessages.length - 1];
    
    setMessages(newMessages);
    handleSendMessage(lastUserMsg.content);
  };

  const handleNewChat = () => {
    setAppState('upload');
    setImageData(null);
    setAnalysis(null);
    setMessages([]);
    localStorage.removeItem('vision_chat_history');
    localStorage.removeItem('vision_last_analysis');
    localStorage.removeItem('vision_last_image');
    setIsSidebarOpen(false);
    setCurrentView('dashboard');
  };

  const renderView = () => {
    if (currentView !== 'dashboard') {
      return (
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-12 text-center max-w-lg"
          >
            <div className="w-20 h-20 bg-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-white/60">
              <Zap className="w-10 h-10 text-orange-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4 capitalize">{currentView}</h2>
            <p className="text-slate-500 leading-relaxed">
              We're currently building out the <strong>{currentView}</strong> module to provide you with even more powerful insights. Stay tuned!
            </p>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentView('dashboard')}
              className="mt-10 px-8 py-3 bg-slate-800 text-white font-semibold rounded-2xl hover:bg-slate-700 transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              Back to Dashboard
            </motion.button>
          </motion.div>
        </div>
      );
    }

    return (
      <>
        {appState === 'upload' && (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-800 mb-5">
                Analyze any image with AI
              </h1>
              <p className="text-[17px] text-slate-500 max-w-2xl mx-auto leading-relaxed">
                Welcome {userName}! Upload a photo to instantly extract objects, tags, use cases, and chat with our advanced vision model.
              </p>
            </div>
            <div className="w-full max-w-2xl">
              <ImageUpload onUpload={handleUpload} />
            </div>
          </div>
        )}

        {appState === 'analyzing' && (
          <div className="flex-1 flex items-center justify-center">
            <Loader />
          </div>
        )}

        {appState === 'results' && analysis && (
          <div className="flex flex-col gap-10 pb-32">
            <AnalysisPanel data={analysis} />
            
            <div className="w-full h-px bg-white/60 my-2" />
            
            <div className="flex-1">
              <ChatWindow 
                messages={messages}
                isTyping={isTyping}
                onSendMessage={handleSendMessage}
                onRegenerate={handleRegenerate}
              />
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      {/* Name Prompt Modal */}
      {!userName && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-10 max-w-md w-full text-center"
          >
            <div className="w-20 h-20 bg-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-white/60">
              <Zap className="w-10 h-10 text-orange-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome to AI Studio App</h2>
            <p className="text-slate-500 mb-8">What should we call you?</p>
            <form onSubmit={handleSaveName} className="space-y-4">
              <input 
                type="text" 
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Your Name"
                className="w-full px-5 py-3 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 ring-orange-200 transition-all"
                autoFocus
              />
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors shadow-lg"
              >
                Start Exploring
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Main Glass Container */}
      <div className="w-full max-w-6xl h-[92vh] md:h-[90vh] bg-white/40 backdrop-blur-xl rounded-3xl md:rounded-[40px] border border-white/20 shadow-2xl flex overflow-hidden relative">
        
        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          onNewChat={handleNewChat}
          currentView={currentView}
          setView={setCurrentView}
          history={analysis ? [{ id: '1', title: analysis.description.substring(0, 30) + '...', date: 'Just now' }] : []}
        />

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <Navbar onMenuClick={() => setIsSidebarOpen(true)} userName={userName || ''} />
          
          <main className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10">
            <div className="max-w-4xl mx-auto min-h-full flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentView + (appState === 'results' ? 'results' : appState)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex-1 flex flex-col"
                >
                  {renderView()}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

