import React from 'react';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  tags: string[];
  attachmentUrl?: string;
  attachmentType?: 'image' | 'pdf' | 'link';
  active: boolean;
  featured: boolean;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: 'Planejamento' | 'Metodologia' | 'Legislação' | 'Ferramentas' | 'Outros';
  active: boolean;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'Administrativo' | 'Pedagógico' | 'Formulários' | 'Horários' | 'Outros';
  url: string;
  type: 'pdf' | 'image' | 'doc' | 'sheet';
  date: string;
  active: boolean;
}

export type ViewMode = 'students' | 'teachers' | 'documents' | 'admin';

export interface TabItem {
  id: ViewMode;
  label: string;
  icon: React.ReactNode;
}