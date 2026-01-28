import React from 'react';
import { PORTAL_CONFIG } from './config';
import Header from './components/Header';
import NoticeBoard from './components/NoticeBoard';
import TeacherPortal from './components/TeacherPortal';
import AdminPanel from './components/AdminPanel';
import DocumentLibrary from './components/DocumentLibrary';
import PasswordGate from './components/PasswordGate';
import { Announcement, Resource, DocumentItem } from './types';
import {
  fetchData,
  createAnnouncement, updateAnnouncement, deleteAnnouncement,
  createResource, updateResource, deleteResource,
  createDocument, updateDocument, deleteDocument
} from './services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Toaster, toast } from 'sonner';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const App: React.FC = () => {
  const queryClient = useQueryClient();

  // Queries
  const { data, isLoading, isError } = useQuery({
    queryKey: ['portalData'],
    queryFn: fetchData,
  });

  const announcements = data?.announcements || [];
  const resources = data?.resources || [];
  const documents = data?.documents || [];

  // Mutations
  const createAnnMut = useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portalData'] });
      toast.success('Aviso publicado!');
    }
  });

  const updateAnnMut = useMutation({
    mutationFn: updateAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portalData'] });
      toast.success('Aviso atualizado!');
    }
  });

  const deleteAnnMut = useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portalData'] })
  });

  const createResMut = useMutation({
    mutationFn: createResource,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portalData'] })
  });

  const updateResMut = useMutation({
    mutationFn: updateResource,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portalData'] })
  });

  const deleteResMut = useMutation({
    mutationFn: deleteResource,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portalData'] })
  });

  const createDocMut = useMutation({
    mutationFn: createDocument,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portalData'] })
  });

  const updateDocMut = useMutation({
    mutationFn: updateDocument,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portalData'] })
  });

  const deleteDocMut = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portalData'] })
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-school-200 border-t-school-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Carregando Portal...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center border border-red-100">
          <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Erro de Conexão</h2>
          <p className="text-gray-600 mb-6">Não foi possível carregar os dados. Verifique sua internet.</p>
          <button onClick={() => window.location.reload()} className="w-full bg-school-600 text-white py-2.5 rounded-lg font-bold hover:bg-school-700 transition-colors">Tentar Novamente</button>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
          <Routes>
            <Route path="/" element={<NoticeBoard announcements={announcements} />} />
            <Route path="/mural" element={<Navigate to="/" replace />} />

            <Route path="/documentos" element={<DocumentLibrary documents={documents} />} />

            <Route path="/professores" element={
              <PasswordGate
                correctPassword={PORTAL_CONFIG.PROFESSOR_PASSWORD}
                title="Sala dos Professores"
                storageKey="auth_professores"
              >
                <TeacherPortal resources={resources} />
              </PasswordGate>
            } />

            <Route path="/admin" element={
              <PasswordGate
                correctPassword={PORTAL_CONFIG.ADMIN_PASSWORD}
                title="Área Administrativa"
                storageKey="auth_admin"
              >
                <AdminPanel
                  announcements={announcements}
                  resources={resources}
                  documents={documents}
                  onAddAnnouncement={createAnnMut.mutate}
                  onUpdateAnnouncement={updateAnnMut.mutate}
                  onDeleteAnnouncement={deleteAnnMut.mutate}
                  onAddResource={createResMut.mutate}
                  onUpdateResource={updateResMut.mutate}
                  onDeleteResource={deleteResMut.mutate}
                  onAddDocument={createDocMut.mutate}
                  onUpdateDocument={updateDocMut.mutate}
                  onDeleteDocument={deleteDocMut.mutate}
                />
              </PasswordGate>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="bg-white border-t border-gray-200 mt-auto py-8">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Portal MZS. Todos os direitos reservados.</p>
            <p className="mt-1 font-semibold text-gray-400">INEP: 25078135</p>
          </div>
        </footer>
      </div>
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
};

export default App;