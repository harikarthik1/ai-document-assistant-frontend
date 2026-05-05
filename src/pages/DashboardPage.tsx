import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Calendar, ArrowRight, Trash2 } from 'lucide-react';
import { documentsService } from '../services/documents';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';
import { DocumentCardSkeleton } from '../components/ui/Skeleton';
import { UploadModal } from '../components/documents/UploadModal';
import type { Document } from '../types';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const docs = await documentsService.getAll();
      setDocuments(docs);
    } catch {
      showToast('Failed to load documents', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUploaded = (doc: Document) => {
    setDocuments((prev) => [doc, ...prev]);
  };

  const handleDeleteDocument = async (id: number) => {
    if (!window.confirm('Delete this document? This action cannot be undone.')) {
      return;
    }

    try {
      await documentsService.deleteDocument(id);
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      showToast('Document deleted successfully', 'success');
    } catch {
      showToast('Failed to delete document', 'error');
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const getFileIcon = (name: string) => {
    if (name.endsWith('.pdf')) return 'PDF';
    if (name.endsWith('.docx') || name.endsWith('.doc')) return 'DOC';
    return 'FILE';
  };

  const iconColors: Record<string, string> = {
    PDF: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    DOC: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    FILE: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name ?? 'there'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {documents.length} document{documents.length !== 1 ? 's' : ''} in your library
          </p>
        </div>
        <Button onClick={() => setUploadOpen(true)} size="md">
          <Plus className="h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Documents', value: documents.length, color: 'text-blue-600 dark:text-blue-400' },
          { label: 'PDFs', value: documents.filter(d => d.fileName?.endsWith('.pdf')).length, color: 'text-red-600 dark:text-red-400' },
          { label: 'Word Docs', value: documents.filter(d => d.fileName?.endsWith('.docx') || d.fileName?.endsWith('.doc')).length, color: 'text-green-600 dark:text-green-400' },
        ].map((stat) => (
          <Card key={stat.label} className="p-5">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Documents grid */}
      <div>
        <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-4">Your Documents</h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <DocumentCardSkeleton key={i} />)}
          </div>
        ) : documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-base font-medium text-gray-700 dark:text-gray-300">No documents yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Upload your first document to get started</p>
            </div>
            <Button onClick={() => setUploadOpen(true)}>
              <Plus className="h-4 w-4" />
              Upload Document
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => {
              const fileType = getFileIcon(doc.fileName || doc.name || '');
              return (
                <Card key={doc.id} hoverable onClick={() => navigate(`/documents/${doc.id}`)}>
                  <CardBody className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-xs font-bold ${iconColors[fileType]}`}>
                        {fileType}
                      </div>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteDocument(doc.id);
                        }}
                        className="rounded-full p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                        aria-label={`Delete ${doc.fileName}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-snug">
                        {doc.fileName}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {formatDate(doc.uploadTime)}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 pt-1">
                      Open document
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} onUploaded={handleUploaded} />
    </div>
  );
}
