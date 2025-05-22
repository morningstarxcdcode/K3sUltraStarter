export interface FileObject {
  cid: string;
  name: string;
  size: number;
  type: string;
  lastAccessed: string;
  isPinned: boolean;
  dateAdded: string;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  content: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface Gateway {
  name: string;
  url: string;
  isPublic: boolean;
}