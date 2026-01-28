import React, { useState } from 'react';
import { Announcement } from '../../types';
import { Megaphone, X, Send, Save, Pencil, Trash2, Star, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface AnnouncementManagerProps {
    announcements: Announcement[];
    onAdd: (a: Announcement) => void;
    onUpdate: (a: Announcement) => void;
    onDelete: (id: string) => void;
}

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

const AnnouncementManager: React.FC<AnnouncementManagerProps> = ({
    announcements, onAdd, onUpdate, onDelete
}) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('Secretaria');
    const [tag, setTag] = useState('Geral');
    const [attachUrl, setAttachUrl] = useState('');
    const [attachType, setAttachType] = useState<'image' | 'pdf' | 'link'>('image');
    const [active, setActive] = useState(true);
    const [featured, setFeatured] = useState(false);

    const resetForm = () => {
        setTitle('');
        setContent('');
        setAuthor('Secretaria');
        setTag('Geral');
        setAttachUrl('');
        setAttachType('image');
        setActive(true);
        setFeatured(false);
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (item: Announcement) => {
        setEditingId(item.id);
        setTitle(item.title);
        setContent(item.content);
        setAuthor(item.author);
        setTag(item.tags[0] || 'Geral');
        setAttachUrl(item.attachmentUrl || '');
        setAttachType(item.attachmentType || 'image');
        setActive(item.active);
        setFeatured(item.featured);
        setShowForm(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) return;

        const payload: Announcement = {
            id: editingId || Date.now().toString(),
            title,
            content,
            author,
            date: editingId ? announcements.find(a => a.id === editingId)?.date || new Date().toISOString() : new Date().toISOString(),
            tags: [tag],
            attachmentUrl: attachUrl || undefined,
            attachmentType: attachUrl ? attachType : undefined,
            active,
            featured,
            originalIndex: editingId ? announcements.find(a => a.id === editingId)?.originalIndex || 0 : Date.now()
        };

        if (editingId) {
            onUpdate(payload);
            toast.success('Aviso atualizado com sucesso!');
        } else {
            onAdd(payload);
            toast.success('Aviso publicado com sucesso!');
        }
        resetForm();
    };

    const commonInputClasses = "w-full rounded-lg border-gray-300 shadow-sm focus:border-school-500 focus:ring-school-500 border p-2 text-sm bg-white text-gray-900";
    const commonSelectClasses = "w-full rounded-lg border-gray-300 shadow-sm focus:border-school-500 focus:ring-school-500 border p-2 text-sm bg-white text-gray-900";

    return (
        <div className="space-y-6">
            {/* FAB for Mobile */}
            <button
                onClick={() => setShowForm(true)}
                className="md:hidden fixed bottom-6 right-6 z-40 bg-school-600 text-white p-4 rounded-full shadow-2xl hover:bg-school-700 transition-transform active:scale-95"
            >
                <Pencil size={24} />
            </button>

            {/* List Section Header */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Megaphone size={20} className="text-school-500" />
                    Avisos Publicados
                    <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{announcements.length}</span>
                </h3>
                <button
                    onClick={() => setShowForm(true)}
                    className="hidden md:flex items-center gap-2 bg-school-50 text-school-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-school-100 transition-colors border border-school-200"
                >
                    Criar Novo Aviso
                </button>
            </div>

            {/* Form Modal/Drawer */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={resetForm} />

                    <div className="relative bg-white w-full max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-in slide-in-from-bottom duration-300">
                        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                {editingId ? <Pencil size={20} className="text-amber-500" /> : <Megaphone size={20} className="text-school-600" />}
                                {editingId ? 'Editar Aviso' : 'Novo Aviso'}
                            </h3>
                            <button onClick={resetForm} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <form id="ann-form" onSubmit={handleSubmit} className="space-y-6 text-left">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Título do Aviso</label>
                                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={commonInputClasses} placeholder="Ex: Resultado da Gincana" required />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 text-left">Autor</label>
                                                <select value={author} onChange={(e) => setAuthor(e.target.value)} className={commonSelectClasses}>
                                                    <option>Coordenação</option>
                                                    <option>Docente</option>
                                                    <option>Gestão</option>
                                                    <option>Secretaria</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 text-left">Categoria</label>
                                                <select value={tag} onChange={(e) => setTag(e.target.value)} className={commonSelectClasses}>
                                                    <option>Geral</option>
                                                    <option>Urgente</option>
                                                    <option>Eventos</option>
                                                    <option>Acadêmico</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300 flex flex-col justify-center space-y-1">
                                        <Toggle label="Aviso em Destaque" checked={featured} onChange={setFeatured} />
                                        <div className="border-t border-gray-200 my-1" />
                                        <Toggle label="Visível no Mural" checked={active} onChange={setActive} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Conteúdo do Aviso</label>
                                    <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} className={commonInputClasses} placeholder="Digite aqui o texto principal do aviso..." required />
                                </div>
                            </form>
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50 sm:rounded-b-2xl">
                            <button type="submit" form="ann-form" className={`w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-lg text-sm font-bold text-white transition-all transform active:scale-[0.98] ${editingId ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-200' : 'bg-school-600 hover:bg-school-700 shadow-school-200'}`}>
                                {editingId ? <Save size={18} /> : <Send size={18} />}
                                {editingId ? 'Salvar Alterações' : 'Publicar Aviso no Mural'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* List Section */}
            <div className="border-t border-gray-200 pt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Avisos Publicados ({announcements.length})</h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 hidden md:table">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {[...announcements].sort((a, b) => {
                                const dateA = new Date(a.date).getTime();
                                const dateB = new Date(b.date).getTime();
                                if (dateA !== dateB) return dateB - dateA;
                                return b.originalIndex - a.originalIndex;
                            }).map((item) => (
                                <tr key={item.id} className={`hover:bg-gray-50 ${!item.active ? 'opacity-60 bg-gray-50' : ''}`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            {item.active ?
                                                <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Ativo</span> :
                                                <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">Inativo</span>
                                            }
                                            {item.featured && <Star size={14} className="text-amber-500 fill-amber-500" />}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.date).toLocaleDateString('pt-BR')}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-900 mr-4"><Pencil size={18} /></button>
                                        <button onClick={() => setDeleteId(item.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="md:hidden divide-y divide-gray-200">
                        {[...announcements].sort((a, b) => {
                            const dateA = new Date(a.date).getTime();
                            const dateB = new Date(b.date).getTime();
                            if (dateA !== dateB) return dateB - dateA;
                            return b.originalIndex - a.originalIndex;
                        }).map((item) => (
                            <div key={item.id} className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                                    <span className="text-[10px] text-gray-400">{new Date(item.date).toLocaleDateString('pt-BR')}</span>
                                </div>
                                <div className="flex justify-end gap-3 mt-2">
                                    <button onClick={() => handleEdit(item)} className="text-indigo-600 text-xs font-bold flex items-center gap-1"><Pencil size={14} /> Editar</button>
                                    <button onClick={() => setDeleteId(item.id)} className="text-red-600 text-xs font-bold flex items-center gap-1"><Trash2 size={14} /> Excluir</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementManager;
