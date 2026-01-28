import React, { useState } from 'react';
import { Announcement, Resource, DocumentItem } from '../types';
import { Plus, Send, Link as LinkIcon, FileText, Upload, Trash2, Pencil, X, Save, Megaphone, CheckCircle, Eye, EyeOff, Star, AlertTriangle } from 'lucide-react';

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

// Toggle Component
const Toggle = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (val: boolean) => void }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-school-600 focus:ring-offset-2 ${checked ? 'bg-school-600' : 'bg-gray-200'}`}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  </div>
);

const AdminPanel: React.FC<AdminPanelProps> = ({
  announcements, resources, documents,
  onAddAnnouncement, onUpdateAnnouncement, onDeleteAnnouncement,
  onAddResource, onUpdateResource, onDeleteResource,
  onAddDocument, onUpdateDocument, onDeleteDocument
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('announcement');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Modal State
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, id: string | null, type: Tab | null }>({
    isOpen: false, id: null, type: null
  });

  // Announcement State
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [announcementAuthor, setAnnouncementAuthor] = useState('Secretaria');
  const [announcementTag, setAnnouncementTag] = useState('Geral');
  const [announcementAttachUrl, setAnnouncementAttachUrl] = useState('');
  const [announcementAttachType, setAnnouncementAttachType] = useState<'image' | 'pdf' | 'link'>('image');
  const [announcementActive, setAnnouncementActive] = useState(true);
  const [announcementFeatured, setAnnouncementFeatured] = useState(false);

  // Resource State
  const [resTitle, setResTitle] = useState('');
  const [resUrl, setResUrl] = useState('');
  const [resDesc, setResDesc] = useState('');
  const [resCat, setResCat] = useState<Resource['category']>('Outros');
  const [resActive, setResActive] = useState(true);

  // Document State
  const [docTitle, setDocTitle] = useState('');
  const [docUrl, setDocUrl] = useState('');
  const [docCat, setDocCat] = useState<DocumentItem['category']>('Outros');
  const [docType, setDocType] = useState<DocumentItem['type']>('pdf');
  const [docActive, setDocActive] = useState(true);

  // Helpers to reset forms
  const resetAnnouncementForm = () => {
    setAnnouncementTitle('');
    setAnnouncementContent('');
    setAnnouncementAuthor('Secretaria');
    setAnnouncementTag('Geral');
    setAnnouncementAttachUrl('');
    setAnnouncementAttachType('image');
    setAnnouncementActive(true);
    setAnnouncementFeatured(false);
    setEditingId(null);
  };

  const resetResourceForm = () => {
    setResTitle('');
    setResUrl('');
    setResDesc('');
    setResCat('Outros');
    setResActive(true);
    setEditingId(null);
  };

  const resetDocumentForm = () => {
    setDocTitle('');
    setDocUrl('');
    setDocCat('Outros');
    setDocType('pdf');
    setDocActive(true);
    setEditingId(null);
  };

  // --- Handlers for Delete Modal ---
  const handleDeleteClick = (id: string, type: Tab) => {
    setDeleteModal({ isOpen: true, id, type });
  };

  const confirmDelete = () => {
    if (deleteModal.id && deleteModal.type) {
      if (deleteModal.type === 'announcement') onDeleteAnnouncement(deleteModal.id);
      if (deleteModal.type === 'resource') onDeleteResource(deleteModal.id);
      if (deleteModal.type === 'document') onDeleteDocument(deleteModal.id);
    }
    setDeleteModal({ isOpen: false, id: null, type: null });
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, id: null, type: null });
  };

  // --- Handlers for Announcement ---
  const handleEditAnnouncement = (item: Announcement) => {
    setEditingId(item.id);
    setAnnouncementTitle(item.title);
    setAnnouncementContent(item.content);
    setAnnouncementAuthor(item.author);
    setAnnouncementTag(item.tags[0] || 'Geral');
    setAnnouncementAttachUrl(item.attachmentUrl || '');
    setAnnouncementAttachType(item.attachmentType || 'image');
    setAnnouncementActive(item.active);
    setAnnouncementFeatured(item.featured);
    // Scroll to top of form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle || !announcementContent) return;

    const payload: Announcement = {
      id: editingId || Date.now().toString(),
      title: announcementTitle,
      content: announcementContent,
      author: announcementAuthor,
      date: editingId ? announcements.find(a => a.id === editingId)?.date || new Date().toISOString() : new Date().toISOString(),
      tags: [announcementTag],
      attachmentUrl: announcementAttachUrl || undefined,
      attachmentType: announcementAttachUrl ? announcementAttachType : undefined,
      active: announcementActive,
      featured: announcementFeatured
    };

    if (editingId) {
      onUpdateAnnouncement(payload);
      alert('Aviso atualizado com sucesso!');
    } else {
      onAddAnnouncement(payload);
      alert('Aviso publicado com sucesso!');
    }
    resetAnnouncementForm();
  };

  // --- Handlers for Resource ---
  const handleEditResource = (item: Resource) => {
    setEditingId(item.id);
    setResTitle(item.title);
    setResUrl(item.url);
    setResDesc(item.description);
    setResCat(item.category);
    setResActive(item.active);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle || !resUrl) return;

    const payload: Resource = {
      id: editingId || Date.now().toString(),
      title: resTitle,
      url: resUrl,
      description: resDesc,
      category: resCat,
      active: resActive
    };

    if (editingId) {
      onUpdateResource(payload);
      alert('Recurso atualizado!');
    } else {
      onAddResource(payload);
      alert('Recurso adicionado!');
    }
    resetResourceForm();
  };

  // --- Handlers for Document ---
  const handleEditDocument = (item: DocumentItem) => {
    setEditingId(item.id);
    setDocTitle(item.title);
    setDocUrl(item.url);
    setDocCat(item.category);
    setDocType(item.type);
    setDocActive(item.active);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle || !docUrl) return;

    const payload: DocumentItem = {
      id: editingId || Date.now().toString(),
      title: docTitle,
      url: docUrl,
      category: docCat,
      type: docType,
      date: editingId ? documents.find(d => d.id === editingId)?.date || new Date().toISOString() : new Date().toISOString(),
      active: docActive
    };

    if (editingId) {
      onUpdateDocument(payload);
      alert('Documento atualizado!');
    } else {
      onAddDocument(payload);
      alert('Documento arquivado!');
    }
    resetDocumentForm();
  }

  const commonInputClasses = "w-full rounded-lg border-gray-300 shadow-sm focus:border-school-500 focus:ring-school-500 border p-2 text-sm bg-white text-gray-900";
  const commonSelectClasses = "w-full rounded-lg border-gray-300 shadow-sm focus:border-school-500 focus:ring-school-500 border p-2 text-sm bg-white text-gray-900";

  // --- Render Functions ---

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 relative">

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Confirmar Exclusão</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita e o item será removido permanentemente do sistema.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
        <div className="border-b border-gray-200 bg-gray-50 flex overflow-x-auto">
          <button
            onClick={() => { setActiveTab('announcement'); resetAnnouncementForm(); }}
            className={`flex-1 min-w-[150px] py-4 text-sm font-medium text-center flex items-center justify-center gap-2 ${activeTab === 'announcement' ? 'text-school-700 bg-white border-t-2 border-t-school-500' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Megaphone size={18} />
            Gerenciar Avisos
          </button>
          <button
            onClick={() => { setActiveTab('document'); resetDocumentForm(); }}
            className={`flex-1 min-w-[150px] py-4 text-sm font-medium text-center flex items-center justify-center gap-2 ${activeTab === 'document' ? 'text-school-700 bg-white border-t-2 border-t-school-500' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FileText size={18} />
            Gerenciar Arquivos
          </button>
          <button
            onClick={() => { setActiveTab('resource'); resetResourceForm(); }}
            className={`flex-1 min-w-[150px] py-4 text-sm font-medium text-center flex items-center justify-center gap-2 ${activeTab === 'resource' ? 'text-school-700 bg-white border-t-2 border-t-school-500' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <LinkIcon size={18} />
            Recursos Prof.
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {activeTab === 'announcement' && (
            <div className="space-y-10">
              {/* Form Section */}
              <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900">
                    {editingId ? 'Editar Aviso' : 'Novo Aviso'}
                  </h3>
                  {editingId && (
                    <button onClick={resetAnnouncementForm} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                      <X size={14} /> Cancelar Edição
                    </button>
                  )}
                </div>

                <form onSubmit={submitAnnouncement} className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                        <input
                          type="text"
                          value={announcementTitle}
                          onChange={(e) => setAnnouncementTitle(e.target.value)}
                          className={commonInputClasses}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
                          <select
                            value={announcementAuthor}
                            onChange={(e) => setAnnouncementAuthor(e.target.value)}
                            className={commonSelectClasses}
                          >
                            <option>Coordenação</option>
                            <option>Docente</option>
                            <option>Gestão</option>
                            <option>Secretaria</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
                          <select
                            value={announcementTag}
                            onChange={(e) => setAnnouncementTag(e.target.value)}
                            className={commonSelectClasses}
                          >
                            <option>Geral</option>
                            <option>Urgente</option>
                            <option>Eventos</option>
                            <option>Acadêmico</option>
                            <option>Horário</option>
                            <option>Esportes</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col justify-center space-y-2">
                      <Toggle
                        label="Aviso em Destaque"
                        checked={announcementFeatured}
                        onChange={setAnnouncementFeatured}
                      />
                      <Toggle
                        label="Aviso Ativo (Publicado)"
                        checked={announcementActive}
                        onChange={setAnnouncementActive}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo</label>
                    <textarea
                      value={announcementContent}
                      onChange={(e) => setAnnouncementContent(e.target.value)}
                      rows={4}
                      className={commonInputClasses}
                      required
                    />
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Anexo (Opcional)</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={announcementAttachUrl}
                        onChange={(e) => setAnnouncementAttachUrl(e.target.value)}
                        className="flex-1 rounded-md border-gray-300 shadow-sm text-sm border p-1.5 bg-white text-gray-900"
                        placeholder="Link do PDF ou Imagem..."
                      />
                      <select
                        value={announcementAttachType}
                        onChange={(e) => setAnnouncementAttachType(e.target.value as any)}
                        className="rounded-md border-gray-300 shadow-sm text-sm border p-1.5 bg-white text-gray-900"
                      >
                        <option value="image">Imagem</option>
                        <option value="pdf">PDF</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className={`w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${editingId ? 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500' : 'bg-school-600 hover:bg-school-700 focus:ring-school-500'}`}
                  >
                    {editingId ? <Save size={18} /> : <Send size={18} />}
                    {editingId ? 'Atualizar Aviso' : 'Publicar Aviso'}
                  </button>
                </form>
              </div>

              {/* List Section */}
              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Avisos Publicados ({announcements.length})</h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Autor</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {announcements.map((item) => (
                        <tr key={item.id} className={`hover:bg-gray-50 ${!item.active ? 'opacity-60 bg-gray-50' : ''}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {item.active ?
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Ativo</span> :
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">Inativo</span>
                              }
                              {item.featured && <Star size={14} className="text-amber-500 fill-amber-500" />}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(item.date).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.author}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => handleEditAnnouncement(item)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                              <Pencil size={18} />
                            </button>
                            <button onClick={() => handleDeleteClick(item.id, 'announcement')} className="text-red-600 hover:text-red-900">
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {announcements.length === 0 && <p className="p-4 text-center text-gray-500">Nenhum aviso cadastrado.</p>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'document' && (
            <div className="space-y-10">
              <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900">
                    {editingId ? 'Editar Documento' : 'Novo Documento'}
                  </h3>
                  {editingId && (
                    <button onClick={resetDocumentForm} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                      <X size={14} /> Cancelar
                    </button>
                  )}
                </div>

                <form onSubmit={submitDocument} className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Arquivo</label>
                    <input
                      type="text"
                      value={docTitle}
                      onChange={(e) => setDocTitle(e.target.value)}
                      className={commonInputClasses}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                      <select
                        value={docCat}
                        onChange={(e) => setDocCat(e.target.value as any)}
                        className={commonSelectClasses}
                      >
                        <option>Administrativo</option>
                        <option>Pedagógico</option>
                        <option>Formulários</option>
                        <option>Horários</option>
                        <option>Outros</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                      <select
                        value={docType}
                        onChange={(e) => setDocType(e.target.value as any)}
                        className={commonSelectClasses}
                      >
                        <option value="pdf">PDF</option>
                        <option value="doc">Word/Doc</option>
                        <option value="sheet">Excel/Planilha</option>
                        <option value="image">Imagem</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL do Arquivo</label>
                    <input
                      type="url"
                      value={docUrl}
                      onChange={(e) => setDocUrl(e.target.value)}
                      className={commonInputClasses}
                      placeholder="https://..."
                      required
                    />
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <Toggle
                      label="Documento Ativo"
                      checked={docActive}
                      onChange={setDocActive}
                    />
                  </div>
                  <button
                    type="submit"
                    className={`w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${editingId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'}`}
                  >
                    {editingId ? <Save size={18} /> : <Upload size={18} />}
                    {editingId ? 'Salvar Alterações' : 'Adicionar à Biblioteca'}
                  </button>
                </form>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Biblioteca de Arquivos ({documents.length})</h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {documents.map((item) => (
                        <tr key={item.id} className={`hover:bg-gray-50 ${!item.active ? 'opacity-60 bg-gray-50' : ''}`}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.active ?
                              <CheckCircle size={16} className="text-green-500" /> :
                              <EyeOff size={16} className="text-gray-400" />
                            }
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 uppercase">{item.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => handleEditDocument(item)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                              <Pencil size={18} />
                            </button>
                            <button onClick={() => handleDeleteClick(item.id, 'document')} className="text-red-600 hover:text-red-900">
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {documents.length === 0 && <p className="p-4 text-center text-gray-500">Nenhum documento.</p>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'resource' && (
            <div className="space-y-10">
              <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900">
                    {editingId ? 'Editar Recurso' : 'Novo Recurso'}
                  </h3>
                  {editingId && (
                    <button onClick={resetResourceForm} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                      <X size={14} /> Cancelar
                    </button>
                  )}
                </div>

                <form onSubmit={submitResource} className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                    <input
                      type="text"
                      value={resTitle}
                      onChange={(e) => setResTitle(e.target.value)}
                      className={commonInputClasses}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                    <select
                      value={resCat}
                      onChange={(e) => setResCat(e.target.value as Resource['category'])}
                      className={commonSelectClasses}
                    >
                      <option>Planejamento</option>
                      <option>Metodologia</option>
                      <option>Legislação</option>
                      <option>Ferramentas</option>
                      <option>Outros</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                    <input
                      type="url"
                      value={resUrl}
                      onChange={(e) => setResUrl(e.target.value)}
                      className={commonInputClasses}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <input
                      type="text"
                      value={resDesc}
                      onChange={(e) => setResDesc(e.target.value)}
                      className={commonInputClasses}
                    />
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <Toggle
                      label="Recurso Ativo"
                      checked={resActive}
                      onChange={setResActive}
                    />
                  </div>
                  <button
                    type="submit"
                    className={`w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${editingId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'}`}
                  >
                    {editingId ? <Save size={18} /> : <Plus size={18} />}
                    {editingId ? 'Salvar Alterações' : 'Adicionar Recurso'}
                  </button>
                </form>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recursos Cadastrados ({resources.length})</h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {resources.map((item) => (
                        <tr key={item.id} className={`hover:bg-gray-50 ${!item.active ? 'opacity-60 bg-gray-50' : ''}`}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.active ?
                              <CheckCircle size={16} className="text-green-500" /> :
                              <EyeOff size={16} className="text-gray-400" />
                            }
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline">
                            <a href={item.url} target="_blank" rel="noopener noreferrer">Acessar</a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => handleEditResource(item)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                              <Pencil size={18} />
                            </button>
                            <button onClick={() => handleDeleteClick(item.id, 'resource')} className="text-red-600 hover:text-red-900">
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {resources.length === 0 && <p className="p-4 text-center text-gray-500">Nenhum recurso cadastrado.</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;