import React, { useState } from 'react';
import { DocumentItem, Category } from '../../types';
import { FileText, X, Upload, Save, Pencil, Trash2, CheckCircle, EyeOff, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentManagerProps {
    documents: DocumentItem[];
    onAdd: (d: DocumentItem) => void;
    onUpdate: (d: DocumentItem) => void;
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

const DocumentManager: React.FC<DocumentManagerProps> = ({
    documents, onAdd, onUpdate, onDelete
}) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [cat, setCat] = useState<Category>('Outros');
    const [type, setType] = useState<DocumentItem['type']>('pdf');
    const [active, setActive] = useState(true);

    const resetForm = () => {
        setTitle('');
        setUrl('');
        setCat('Outros');
        setType('pdf');
        setActive(true);
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (item: DocumentItem) => {
        setEditingId(item.id);
        setTitle(item.title);
        setUrl(item.url);
        setCat(item.category);
        setType(item.type);
        setActive(item.active);
        setShowForm(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !url) return;

        const payload: DocumentItem = {
            id: editingId || Date.now().toString(),
            title,
            url,
            category: cat,
            type,
            date: editingId ? documents.find(d => d.id === editingId)?.date || new Date().toISOString() : new Date().toISOString(),
            active
        };

        if (editingId) {
            onUpdate(payload);
            toast.success('Documento atualizado!');
        } else {
            onAdd(payload);
            toast.success('Documento arquivado!');
        }
        resetForm();
    };

    const categories: Category[] = [
        'Aprofundamentos', 'Avaliação', 'Documentos', 'Ferramentas', 'Formação',
        'Horários', 'Legislação', 'Líderes', 'Médias/Notas', 'Planejamento',
        'Práticas Integradoras', 'Outros'
    ];

    const commonClasses = "w-full rounded-lg border-gray-300 shadow-sm focus:border-school-500 focus:ring-school-500 border p-2 text-sm bg-white text-gray-900";

    return (
        <div className="space-y-6">
            {/* Delete Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmar Exclusão</h3>
                        <p className="text-gray-600 mb-6 text-sm">Tem certeza que deseja remover permanentemente este arquivo? Esta ação não pode ser desfeita.</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Cancelar</button>
                            <button onClick={() => { onDelete(deleteId); setDeleteId(null); }} className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95">Sim, Excluir</button>
                        </div>
                    </div>
                </div>
            )}

            {/* FAB for Mobile */}
            <button
                onClick={() => setShowForm(true)}
                className="md:hidden fixed bottom-6 right-6 z-40 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-transform active:scale-95"
            >
                <Plus size={24} />
            </button>

            {/* List Header */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <FileText size={20} className="text-blue-500" />
                    Biblioteca de Arquivos
                    <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{documents.length}</span>
                </h3>
                <button
                    onClick={() => setShowForm(true)}
                    className="hidden md:flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors border border-blue-200"
                >
                    <Plus size={16} /> Arquivar Documento
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={resetForm} />
                    <div className="relative bg-white w-full max-w-xl rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-in slide-in-from-bottom duration-300">
                        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                {editingId ? <Pencil size={20} className="text-amber-500" /> : <Upload size={20} className="text-blue-600" />}
                                {editingId ? 'Editar Documento' : 'Novo Documento'}
                            </h3>
                            <button onClick={resetForm} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <form id="doc-form" onSubmit={handleSubmit} className="space-y-5 text-left">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nome do Arquivo</label>
                                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={commonClasses} placeholder="Ex: Calendário Acadêmico 2024" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 text-left">Categoria</label>
                                        <select value={cat} onChange={(e) => setCat(e.target.value as Category)} className={commonClasses}>
                                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 text-left">Tipo</label>
                                        <select value={type} onChange={(e) => setType(e.target.value as any)} className={commonClasses}>
                                            <option value="pdf">PDF</option>
                                            <option value="doc">Word</option>
                                            <option value="sheet">Excel</option>
                                            <option value="image">Imagem</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">URL de Acesso</label>
                                    <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} className={commonClasses} placeholder="https://drive.google.com/..." required />
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <Toggle label="Documento Visível para Todos" checked={active} onChange={setActive} />
                                </div>
                            </form>
                        </div>
                        <div className="p-4 border-t border-gray-100 bg-gray-50 sm:rounded-b-2xl">
                            <button type="submit" form="doc-form" className={`w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-lg text-sm font-bold text-white transition-all transform active:scale-[0.98] ${editingId ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}>
                                {editingId ? <Save size={18} /> : <Upload size={18} />}
                                {editingId ? 'Salvar Alterações' : 'Arquivar Documento'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Table Section */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table className="min-w-full divide-y divide-gray-200 hidden md:table">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Categoria</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-left">
                        {[...documents].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((item) => (
                            <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${!item.active ? 'opacity-60 grayscale' : ''}`}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {item.active ? <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Ativo</span> : <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">Oculto</span>}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-bold text-gray-900">{item.title}</div>
                                    <div className="text-[10px] text-gray-400 font-medium tracking-tight uppercase">{item.type}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{item.category}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleEdit(item)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Pencil size={18} /></button>
                                        <button onClick={() => setDeleteId(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Mobile View */}
                <div className="md:hidden divide-y divide-gray-100">
                    {[...documents].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((item) => (
                        <div key={item.id} className={`p-4 ${!item.active ? 'bg-gray-50/50 grayscale' : ''}`}>
                            <div className="flex justify-between items-start mb-2 text-left">
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 leading-tight">{item.title}</h4>
                                    <p className="text-[10px] text-gray-500 font-medium uppercase mt-0.5">{item.category} • {item.type}</p>
                                </div>
                                {!item.active && <EyeOff size={14} className="text-gray-400" />}
                            </div>
                            <div className="flex justify-end gap-4 mt-3 pt-3 border-t border-gray-50">
                                <button onClick={() => handleEdit(item)} className="text-indigo-600 text-xs font-bold flex items-center gap-1.5"><Pencil size={14} /> Editar</button>
                                <button onClick={() => setDeleteId(item.id)} className="text-red-600 text-xs font-bold flex items-center gap-1.5"><Trash2 size={14} /> Excluir</button>
                            </div>
                        </div>
                    ))}
                </div>

                {documents.length === 0 && <div className="p-12 text-center text-gray-400 italic">Nenhum documento arquivado.</div>}
            </div>
        </div>
    );
};

export default DocumentManager;
