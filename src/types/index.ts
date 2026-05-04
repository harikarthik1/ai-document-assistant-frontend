export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Document {
  id: number;
  fileName: string;
  uploadTime: string;
  userId?: number;
  extractedText?: string;
  summary?: string;
}

export interface ChatMessage {
  id: number;
  userId?: number;
  documentId: number;
  question: string;
  answer: string;
  createdAt: string;
}

export interface SummaryResponse {
  summary: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
