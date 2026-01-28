import React, { useState } from 'react';
import { Announcement, Resource, DocumentItem } from '../types';
import { Megaphone, FileText, Link as LinkIcon } from 'lucide-react';
import AnnouncementManager from './admin/AnnouncementManager';
import DocumentManager from './admin/DocumentManager';
import ResourceManager from './admin/ResourceManager';

interface AdminPanelProps {
  // Data
  announcements: Announcement[];
  resources: Resource[];
  documents: DocumentItem[];
  // Actions
  onAddAnnouncement: (a: Announcement) => void;
  onUpdateAnnouncement: (a: Announcement) => void;
  onDeleteAnnouncement: (id: string) => void;
  onAddResource: (r: Resource) => void;
  onUpdateResource: (r: Resource) => void;
  onDeleteResource: (id: string) => void;
  onAddDocument: (d: DocumentItem) => void;
  onUpdateDocument: (d: DocumentItem) => void;
  onDeleteDocument: (id: string) => void;
}

type Tab = 'announcement' | 'resource' | 'document';

const AdminPanel: React.FC<AdminPanelProps> = ({
  announcements, resources, documents,
  onAddAnnouncement, onUpdateAnnouncement, onDeleteAnnouncement,
  onAddResource, onUpdateResource, onDeleteResource,
  onAddDocument, onUpdateDocument, onDeleteDocument
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('announcement');

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 relative">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
        <div className="border-b border-gray-200 bg-gray-50 flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('announcement')}
            className={`flex-1 min-w-[150px] py-4 text-sm font-medium text-center flex items-center justify-center gap-2 ${activeTab === 'announcement' ? 'text-school-700 bg-white border-t-2 border-t-school-500' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Megaphone size={18} />
            Gerenciar Avisos
          </button>
          <button
            onClick={() => setActiveTab('document')}
            className={`flex-1 min-w-[150px] py-4 text-sm font-medium text-center flex items-center justify-center gap-2 ${activeTab === 'document' ? 'text-school-700 bg-white border-t-2 border-t-school-500' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FileText size={18} />
            Gerenciar Arquivos
          </button>
          <button
            onClick={() => setActiveTab('resource')}
            className={`flex-1 min-w-[150px] py-4 text-sm font-medium text-center flex items-center justify-center gap-2 ${activeTab === 'resource' ? 'text-school-700 bg-white border-t-2 border-t-school-500' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <LinkIcon size={18} />
            Recursos Prof.
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {activeTab === 'announcement' && (
            <AnnouncementManager
              announcements={announcements}
              onAdd={onAddAnnouncement}
              onUpdate={onUpdateAnnouncement}
              onDelete={onDeleteAnnouncement}
            />
          )}

          {activeTab === 'document' && (
            <DocumentManager
              documents={documents}
              onAdd={onAddDocument}
              onUpdate={onUpdateDocument}
              onDelete={onDeleteDocument}
            />
          )}

          {activeTab === 'resource' && (
            <ResourceManager
              resources={resources}
              onAdd={onAddResource}
              onUpdate={onUpdateResource}
              onDelete={onDeleteResource}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;