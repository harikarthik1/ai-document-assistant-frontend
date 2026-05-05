import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Send, Trash2, Sparkles, FileText, Bot, User,
  Clock, ChevronDown, AlertCircle
} from 'lucide-react';
import { documentsService } from '../services/documents';
import { useToast } from '../contexts/ToastContext';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { ChatSkeleton } from '../components/ui/Skeleton';
import type { Document, ChatMessage } from '../types';

export function DocumentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [document, setDocument] = useState<Document | null>(null);
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [docLoading, setDocLoading] = useState(true);
  const [chatsLoading, setChatsLoading] = useState(false);
  const [askLoading, setAskLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteDocumentLoading, setDeleteDocumentLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!id) return;
    fetchDocument();
    fetchChats();
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, askLoading]);

  const fetchDocument = async () => {
    setDocLoading(true);
    try {
      const docs = await documentsService.getAll();
      const doc = docs.find((d) => d.id === Number(id));
      if (doc) setDocument(doc);
    } catch {
      showToast('Failed to load document', 'error');
    } finally {
      setDocLoading(false);
    }
  };

  const fetchChats = async () => {
    if (!id) return;
    setChatsLoading(true);
    try {
      const history = await documentsService.getChats(Number(id));
      setChats(history);
    } catch {
      showToast('Failed to load chat history', 'error');
    } finally {
      setChatsLoading(false);
    }
  };

  const handleAsk = async () => {
    const q = question.trim();
    if (!q || !id || askLoading) return;
    setQuestion('');
    setAskLoading(true);

    const optimisticMsg: ChatMessage = {
      id: Date.now(),
      documentId: Number(id),
      question: q,
      answer: '',
      createdAt: new Date().toISOString(),
    };
    setChats((prev) => [...prev, optimisticMsg]);

    try {
      const res = await documentsService.askQuestion(Number(id), q);
      const newChat: ChatMessage = {
        id: Date.now(),
        documentId: Number(id),
        question: q,
        answer: res.answer,
        createdAt: new Date().toISOString(),
      };
      setChats((prev) => [...prev.filter((c) => c.id !== optimisticMsg.id), newChat]);
    } catch {
      setChats((prev) => prev.filter((c) => c.id !== optimisticMsg.id));
      showToast('Failed to get AI response', 'error');
      setQuestion(q);
    } finally {
      setAskLoading(false);
    }
  };

  const handleSummary = async () => {
    if (!id || summaryLoading) return;
    setSummaryLoading(true);
    setShowSummary(true);
    try {
      const res = await documentsService.generateSummary(Number(id));
      setSummary(res.summary);
    } catch {
      showToast('Failed to generate summary', 'error');
      setShowSummary(false);
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleDeleteChats = async () => {
    if (!id) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 4000);
      return;
    }
    setDeleteLoading(true);
    try {
      await documentsService.deleteChats(Number(id));
      setChats([]);
      setSummary(null);
      setShowSummary(false);
      showToast('Chat history cleared', 'success');
    } catch {
      showToast('Failed to delete chats', 'error');
    } finally {
      setDeleteLoading(false);
      setConfirmDelete(false);
    }
  };

  const handleDeleteDocument = async () => {
    if (!id || !document) return;
    if (!window.confirm('Delete this document and all related chat history? This action cannot be undone.')) {
      return;
    }
    setDeleteDocumentLoading(true);
    try {
      await documentsService.deleteDocument(Number(id));
      showToast('Document deleted successfully', 'success');
      navigate('/documents');
    } catch {
      showToast('Failed to delete document', 'error');
    } finally {
      setDeleteDocumentLoading(false);
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back + title */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
      </div>

      {docLoading ? (
        <div className="flex items-center gap-3">
          <Spinner size="sm" />
          <span className="text-sm text-gray-500 dark:text-gray-400">Loading document...</span>
        </div>
      ) : document ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                {document.fileName}
              </h1>
              <p className="text-xs text-gray-400 dark:text-gray-500">{document.fileName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSummary}
              loading={summaryLoading}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Generate Summary
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteDocument}
              loading={deleteDocumentLoading}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Document
            </Button>
            <Button
              variant={confirmDelete ? 'danger' : 'ghost'}
              size="sm"
              onClick={handleDeleteChats}
              loading={deleteLoading}
            >
              <Trash2 className="h-3.5 w-3.5" />
              {confirmDelete ? 'Confirm Delete' : 'Delete Chats'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="h-4 w-4" />
          Document not found
        </div>
      )}

      {/* Summary card */}
      {showSummary && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <button
              onClick={() => setShowSummary(false)}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">AI Summary</span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
          </CardHeader>
          <CardBody>
            {summaryLoading ? (
              <div className="flex items-center gap-3 py-2">
                <Spinner size="sm" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Generating summary...</span>
              </div>
            ) : (
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{summary}</p>
            )}
          </CardBody>
        </Card>
      )}

      {/* Chat area */}
      <Card className="flex flex-col" style={{ height: '60vh', minHeight: '400px' }}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Chat with Document</span>
            <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
              {chats.length} message{chats.length !== 1 ? 's' : ''}
            </span>
          </div>
        </CardHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {chatsLoading ? (
            <>
              <ChatSkeleton />
              <ChatSkeleton />
            </>
          ) : chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3 py-10">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <Bot className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Start the conversation</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Ask any question about this document</p>
              </div>
            </div>
          ) : (
            <>
              {chats.map((msg, i) => (
                <div key={msg.id || i} className="space-y-3">
                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="flex items-end gap-2 max-w-[80%]">
                      <div className="space-y-1">
                        <div className="bg-blue-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm leading-relaxed">
                          {msg.question}
                        </div>
                        <p className="text-right text-xs text-gray-400 dark:text-gray-500 flex items-center justify-end gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          {formatTime(msg.createdAt)}
                        </p>
                      </div>
                      <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mb-4">
                        <User className="h-3.5 w-3.5 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* AI message */}
                  <div className="flex justify-start">
                    <div className="flex items-end gap-2 max-w-[80%]">
                      <div className="h-7 w-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0 mb-4">
                        <Bot className="h-3.5 w-3.5 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div className="space-y-1">
                        {msg.id === '__pending__' ? (
                          <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                            <span className="flex gap-1">
                              {[0, 1, 2].map((i) => (
                                <span
                                  key={i}
                                  className="h-1.5 w-1.5 rounded-full bg-gray-400 dark:bg-gray-400 animate-bounce"
                                  style={{ animationDelay: `${i * 0.15}s` }}
                                />
                              ))}
                            </span>
                          </div>
                        ) : (
                          <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                            {msg.answer}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </>
          )}
        </div>

        {/* Input area */}
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-end gap-2">
            <div className="flex-1 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-750 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
              <textarea
                ref={textareaRef}
                rows={1}
                value={question}
                onChange={(e) => { setQuestion(e.target.value); autoResize(); }}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question about this document..."
                className="w-full bg-transparent px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 resize-none outline-none leading-relaxed"
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
            </div>
            <Button
              onClick={handleAsk}
              disabled={!question.trim() || askLoading}
              loading={askLoading}
              className="shrink-0 h-11 w-11 p-0 rounded-xl"
            >
              {!askLoading && <Send className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 pl-1">Press Enter to send, Shift+Enter for new line</p>
        </div>
      </Card>
    </div>
  );
}
