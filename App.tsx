import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import NoticeBoard from './components/NoticeBoard';
import TeacherPortal from './components/TeacherPortal';
import AdminPanel from './components/AdminPanel';
import DocumentLibrary from './components/DocumentLibrary';
import { ViewMode, Announcement, Resource, DocumentItem } from './types';
import { INITIAL_ANNOUNCEMENTS, INITIAL_RESOURCES, INITIAL_DOCUMENTS } from './constants';
import { fetchData, createAnnouncement, createResource, createDocument } from './services/api';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('students');
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
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
  const handleUpdateAnnouncement = (updatedAnnouncement: Announcement) => {
    setAnnouncements((prev) => prev.map(item => item.id === updatedAnnouncement.id ? updatedAnnouncement : item));
  };
  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter(item => item.id !== id));
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
  const handleUpdateResource = (updatedResource: Resource) => {
    setResources((prev) => prev.map(item => item.id === updatedResource.id ? updatedResource : item));
  };
  const handleDeleteResource = (id: string) => {
    setResources((prev) => prev.filter(item => item.id !== id));
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
  const handleUpdateDocument = (updatedDocument: DocumentItem) => {
    setDocuments((prev) => prev.map(item => item.id === updatedDocument.id ? updatedDocument : item));
  };
  const handleDeleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter(item => item.id !== id));
  };

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
          <TeacherPortal resources={resources} />
        )}

        {currentView === 'admin' && (
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