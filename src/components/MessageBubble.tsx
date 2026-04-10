import { useState } from 'react';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import { Copy, RefreshCw, Check, Bot, User } from 'lucide-react';
import { cn } from '../lib/utils';

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
}

interface MessageBubbleProps {
  message: Message;
  onRegenerate?: () => void;
  isLast?: boolean;
}

export function MessageBubble({ message, onRegenerate, isLast }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isAi = message.role === 'model';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-4 w-full max-w-4xl mx-auto",
        isAi ? "flex-row" : "flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm",
        isAi 
          ? "bg-white border border-slate-200 text-slate-800" 
          : "bg-slate-800 text-white"
      )}>
        {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      {/* Bubble */}
      <div className={cn(
        "flex flex-col gap-2 max-w-[90%] md:max-w-[85%]",
        isAi ? "items-start" : "items-end"
      )}>
        <div className={cn(
          "px-4 md:px-5 py-3 md:py-4 rounded-2xl",
          isAi 
            ? "glass-panel rounded-tl-sm" 
            : "bg-slate-800 text-white rounded-tr-sm shadow-sm"
        )}>
          {isAi ? (
            <div className="markdown-body text-slate-800 text-sm md:text-[15px] leading-relaxed">
              <Markdown>{message.content}</Markdown>
            </div>
          ) : (
            <p className="text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
          )}
        </div>

        {/* Actions */}
        {isAi && (
          <div className="flex items-center gap-2 px-1">
            <button
              onClick={handleCopy}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md transition-colors flex items-center gap-1.5 text-xs font-medium"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            {isLast && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md transition-colors flex items-center gap-1.5 text-xs font-medium"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Regenerate
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
