import { useState, useRef, type DragEvent } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { documentsService } from '../../services/documents';
import { useToast } from '../../contexts/ToastContext';
import type { Document } from '../../types';

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onUploaded: (doc: Document) => void;
}

const ACCEPTED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const ACCEPTED_EXTS = ['.pdf', '.doc', '.docx'];

export function UploadModal({ open, onClose, onUploaded }: UploadModalProps) {
  const { showToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isValidFile = (f: File) =>
    ACCEPTED_TYPES.includes(f.type) || ACCEPTED_EXTS.some((ext) => f.name.toLowerCase().endsWith(ext));

  const handleFile = (f: File) => {
    if (!isValidFile(f)) {
      showToast('Only PDF and Word documents are supported', 'error');
      return;
    }
    setFile(f);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const doc = await documentsService.upload(file);
      showToast('Document uploaded successfully!', 'success');
      onUploaded(doc);
      handleClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Upload failed';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setDragging(false);
    onClose();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Modal open={open} onClose={handleClose} title="Upload Document">
      <div className="space-y-4">
        {!file ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all
              ${dragging
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-750'}`}
          >
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Upload className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Drop file here or <span className="text-blue-600 dark:text-blue-400">browse</span>
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">PDF, DOC, DOCX up to 50 MB</p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{file.name}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{formatSize(file.size)}</p>
            </div>
            <button
              onClick={() => setFile(null)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="flex gap-3 pt-1">
          <Button variant="secondary" onClick={handleClose} className="flex-1" disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} loading={loading} disabled={!file} className="flex-1">
            Upload
          </Button>
        </div>
      </div>
    </Modal>
  );
}
