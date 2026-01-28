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
  originalIndex: number;
}

export type Category =
  | 'Aprofundamentos'
  | 'Avaliação'
  | 'Documentos'
  | 'Ferramentas'
  | 'Formação'
  | 'Horários'
  | 'Legislação'
  | 'Líderes'
  | 'Médias/Notas'
  | 'Planejamento'
  | 'Práticas Integradoras'
  | 'Outros';

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: Category;
  date: string;
  active: boolean;
  originalIndex: number;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: Category;
  url: string;
  type: 'pdf' | 'image' | 'doc' | 'sheet';
  date: string;
  active: boolean;
  originalIndex: number;
}

export type ViewMode = 'students' | 'teachers' | 'documents' | 'admin';

export interface TabItem {
  id: ViewMode;
  label: string;
  icon: React.ReactNode;
}