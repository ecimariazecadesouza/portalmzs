import React from 'react';
import { Announcement } from '../types';
import { Calendar, Megaphone, User, Paperclip, ExternalLink, FileText, Star } from 'lucide-react';

interface NoticeBoardProps {
  announcements: Announcement[];
}

const NoticeBoard: React.FC<NoticeBoardProps> = ({ announcements }) => {
  // Filter active, then sort: Featured first, then by Date descending
  const displayAnnouncements = announcements
    .filter(a => a.active)
    .sort((a, b) => {
      if (a.featured === b.featured) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return a.featured ? -1 : 1;
    });

  // Helper to detect URLs and render them as links
  const renderContentWithLinks = (text: string) => {
    // Regex to capture URLs (starting with http:// or https://)
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-school-600 hover:text-school-800 hover:underline font-medium break-all"
            onClick={(e) => e.stopPropagation()} // Prevent card click issues
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Mural</h2>
        <p className="mt-3 text-lg text-gray-500">
          Fique por dentro das últimas notícias, eventos e comunicados oficiais da escola.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayAnnouncements.map((item) => (
          <article
            key={item.id}
            className={`
              bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow flex flex-col relative
              ${item.featured ? 'border-amber-200 ring-1 ring-amber-100' : 'border-gray-100'}
            `}
          >
            {item.featured && (
              <div className="absolute top-0 right-0 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10 flex items-center gap-1">
                <Star size={10} fill="currentColor" /> DESTAQUE
              </div>
            )}

            <div className="p-6 flex-1">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  {item.tags.map(tag => (
                    <span key={tag} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${tag === 'Urgente' ? 'bg-red-100 text-red-800' :
                        tag === 'Horário' ? 'bg-purple-100 text-purple-800' :
                          'bg-school-100 text-school-700'}`}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <Calendar size={14} className="mr-1" />
                  {new Date(item.date).toLocaleDateString('pt-BR')}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap mb-4">
                {renderContentWithLinks(item.content)}
              </p>

              {/* Attachment Section */}
              {item.attachmentUrl && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  {item.attachmentType === 'image' ? (
                    <div className="rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={item.attachmentUrl}
                        alt="Anexo"
                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div className="bg-gray-50 px-3 py-2 text-xs text-gray-500 flex items-center justify-between">
                        <span className="flex items-center gap-1"><Paperclip size={12} /> Imagem Anexada</span>
                        <a href={item.attachmentUrl} target="_blank" rel="noopener noreferrer" className="hover:text-school-600">Abrir original</a>
                      </div>
                    </div>
                  ) : (
                    <a
                      href={item.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-school-50 border border-school-100 text-school-700 hover:bg-school-100 transition-colors"
                    >
                      <div className="bg-white p-2 rounded-full shadow-sm">
                        <FileText size={20} className="text-school-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">Visualizar Anexo</p>
                        <p className="text-xs opacity-75 capitalize">{item.attachmentType || 'Documento'}</p>
                      </div>
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className={`
              px-6 py-4 border-t flex items-center justify-between
              ${item.featured ? 'bg-amber-50 border-amber-100' : 'bg-gray-50 border-gray-100'}
            `}>
              <div className="flex items-center text-sm text-gray-500 font-medium">
                <User size={16} className="mr-2 text-gray-400" />
                {item.author}
              </div>
              <Megaphone size={16} className={item.featured ? 'text-amber-400' : 'text-school-300'} />
            </div>
          </article>
        ))}
      </div>

      {displayAnnouncements.length === 0 && (
        <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">Nenhum aviso publicado no momento.</p>
        </div>
      )}
    </div>
  );
};

export default NoticeBoard;