import React from 'react';
import { DocumentItem } from '../types';
import { FileText, Download, FileSpreadsheet, Image as ImageIcon, File } from 'lucide-react';

interface DocumentLibraryProps {
  documents: DocumentItem[];
}

const DocumentLibrary: React.FC<DocumentLibraryProps> = ({ documents }) => {
  // Filter active docs
  const activeDocs = documents.filter(d => d.active);

  // Group documents by category
  const groupedDocs = activeDocs.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, DocumentItem[]>);

  const getIcon = (type: string) => {
    switch (type) {
      case 'sheet': return <FileSpreadsheet size={24} className="text-green-600" />;
      case 'image': return <ImageIcon size={24} className="text-purple-600" />;
      case 'pdf': return <FileText size={24} className="text-red-600" />;
      case 'doc': return <FileText size={24} className="text-blue-600" />;
      default: return <File size={24} className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 border-b border-gray-200 pb-8">
        <h2 className="text-3xl font-bold text-gray-900">Arquivos e Documentos</h2>
        <p className="mt-2 text-lg text-gray-600">
          Acesse formulários, listas de materiais e documentos oficiais da escola.
        </p>
      </div>

      {Object.entries(groupedDocs).map(([category, items]: [string, DocumentItem[]]) => (
        <section key={category} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
             <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
               {category}
               <span className="text-xs font-normal text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full">
                 {items.length} {items.length === 1 ? 'arquivo' : 'arquivos'}
               </span>
             </h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            {items.map((doc) => (
              <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">
                    {getIcon(doc.type)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{doc.title}</h4>
                    <p className="text-xs text-gray-500">
                      Adicionado em {new Date(doc.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                
                <a 
                  href={doc.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-school-600 bg-school-50 rounded-lg hover:bg-school-100 transition-colors"
                >
                  <Download size={16} />
                  <span className="hidden sm:inline">Baixar</span>
                </a>
              </div>
            ))}
          </div>
        </section>
      ))}

      {activeDocs.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Nenhum documento encontrado</h3>
          <p className="text-gray-500">A secretaria ainda não disponibilizou arquivos nesta seção.</p>
        </div>
      )}
    </div>
  );
};

export default DocumentLibrary;