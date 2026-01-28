import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import NoticeBoard from './components/NoticeBoard';
import TeacherPortal from './components/TeacherPortal';
import AdminPanel from './components/AdminPanel';
import DocumentLibrary from './components/DocumentLibrary';
import PasswordGate from './components/PasswordGate';
import { ViewMode, Announcement, Resource, DocumentItem } from './types';
import { INITIAL_ANNOUNCEMENTS, INITIAL_RESOURCES, INITIAL_DOCUMENTS } from './constants';
import {
  fetchData,
  createAnnouncement, updateAnnouncement, deleteAnnouncement,
  createResource, updateResource, deleteResource,
  createDocument, updateDocument, deleteDocument
} from './services/api';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('students');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchData();
        // Only update if data is returned, otherwise keep initial/local data or empty
        // The API returns { announcements: [], resources: [], documents: [] } currently.
        // We will assume that if the API works, we should use its data.
        if (data) {
          setAnnouncements(data.announcements || []);
          setResources(data.resources || []);
          setDocuments(data.documents || []);
        }
      } catch (err) {
        console.error('Failed to load data', err);
        setError('Falha ao carregar dados do sistema.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Announcement Handlers
  const handleAddAnnouncement = async (newAnnouncement: Announcement) => {
    try {
      setLoading(true);
      await createAnnouncement(newAnnouncement);
      setAnnouncements((prev) => [newAnnouncement, ...prev]);
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar anúncio. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateAnnouncement = async (updatedAnnouncement: Announcement) => {
    try {
      setLoading(true);
      await updateAnnouncement(updatedAnnouncement);
      setAnnouncements((prev) => prev.map(item => item.id === updatedAnnouncement.id ? updatedAnnouncement : item));
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar anúncio.');
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteAnnouncement = async (id: string) => {
    try {
      setLoading(true);
      await deleteAnnouncement(id);
      setAnnouncements((prev) => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir anúncio.');
    } finally {
      setLoading(false);
    }
  };

  // Resource Handlers
  const handleAddResource = async (newResource: Resource) => {
    try {
      setLoading(true);
      await createResource(newResource);
      setResources((prev) => [...prev, newResource]);
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar recurso. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateResource = async (updatedResource: Resource) => {
    try {
      setLoading(true);
      await updateResource(updatedResource);
      setResources((prev) => prev.map(item => item.id === updatedResource.id ? updatedResource : item));
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar recurso.');
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteResource = async (id: string) => {
    try {
      setLoading(true);
      await deleteResource(id);
      setResources((prev) => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir recurso.');
    } finally {
      setLoading(false);
    }
  };

  // Document Handlers
  const handleAddDocument = async (newDocument: DocumentItem) => {
    try {
      setLoading(true);
      await createDocument(newDocument);
      setDocuments((prev) => [newDocument, ...prev]);
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar documento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateDocument = async (updatedDocument: DocumentItem) => {
    try {
      setLoading(true);
      await updateDocument(updatedDocument);
      setDocuments((prev) => prev.map(item => item.id === updatedDocument.id ? updatedDocument : item));
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar documento.');
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteDocument = async (id: string) => {
    try {
      setLoading(true);
      await deleteDocument(id);
      setDocuments((prev) => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir documento.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && announcements.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-school-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Carregando Portal MZS...</p>
        </div>
      </div>
    );
  }

  if (error && announcements.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-red-100 max-w-md">
          <div className="bg-red-100 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Ops! Algo deu errado</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-school-600 text-white py-2 px-4 rounded-lg hover:bg-school-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header currentView={currentView} onViewChange={setCurrentView} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'students' && (
          <NoticeBoard announcements={announcements} />
        )}

        {currentView === 'documents' && (
          <DocumentLibrary documents={documents} />
        )}

        {currentView === 'teachers' && (
          <PasswordGate
            correctPassword="mzs-prof"
            title="Sala dos Professores"
            storageKey="auth_professores"
          >
            <TeacherPortal resources={resources} />
          </PasswordGate>
        )}

        {currentView === 'admin' && (
          <PasswordGate
            correctPassword="mzs-admin"
            title="Área Administrativa"
            storageKey="auth_admin"
          >
            <AdminPanel
              // Data
              announcements={announcements}
              resources={resources}
              documents={documents}
              // Announcement Actions
              onAddAnnouncement={handleAddAnnouncement}
              onUpdateAnnouncement={handleUpdateAnnouncement}
              onDeleteAnnouncement={handleDeleteAnnouncement}
              // Resource Actions
              onAddResource={handleAddResource}
              onUpdateResource={handleUpdateResource}
              onDeleteResource={handleDeleteResource}
              // Document Actions
              onAddDocument={handleAddDocument}
              onUpdateDocument={handleUpdateDocument}
              onDeleteDocument={handleDeleteDocument}
            />
          </PasswordGate>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Portal MZS. Todos os direitos reservados.</p>
          <p className="mt-1">Desenvolvido para facilitar a comunicação pedagógica.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;