import React, { useState } from 'react';
import { Resource } from '../types';
import { ExternalLink, Bookmark, FolderOpen, Filter } from 'lucide-react';

interface TeacherPortalProps {
  resources: Resource[];
}

const TeacherPortal: React.FC<TeacherPortalProps> = ({ resources }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  // Filter active resources
  const activeResources = resources.filter(r => r.active);

  // Get unique categories for filter
  const categories = ['Todos', ...new Set(activeResources.map(r => r.category))];

  // Apply filter
  const filteredResources = selectedCategory === 'Todos'
    ? activeResources
    : activeResources.filter(r => r.category === selectedCategory);

  // Group resources by category (after filtering)
  const groupedResources = filteredResources.reduce((acc, resource) => {
    const category = resource.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(resource);
    return acc;
  }, {} as Record<string, Resource[]>);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Professores</h2>
        <p className="mt-2 text-base sm:text-lg text-gray-600">
          Acesso rápido a documentos, planejamentos e ferramentas pedagógicas.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 mb-6 sm:mb-8 bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 text-gray-500 mr-2 shrink-0">
          <Filter size={18} />
          <span className="text-sm font-medium">Filtrar:</span>
        </div>
        <div className="flex gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap
                ${selectedCategory === category
                  ? 'bg-school-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
              `}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {Object.entries(groupedResources).map(([category, items]: [string, Resource[]]) => (
        <section key={category} className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <FolderOpen className="text-school-600" size={24} />
            <h3 className="text-xl font-bold text-gray-800">{category}</h3>
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{items.length}</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((resource) => (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-white rounded-lg border border-gray-200 p-5 hover:border-school-300 hover:ring-2 hover:ring-school-100 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="bg-school-50 p-2 rounded-md text-school-600 mb-3 group-hover:bg-school-600 group-hover:text-white transition-colors">
                    <Bookmark size={20} />
                  </div>
                  <ExternalLink size={16} className="text-gray-300 group-hover:text-school-500" />
                </div>

                <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-school-700">
                  {resource.title}
                </h4>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {resource.description}
                </p>
              </a>
            ))}
          </div>
        </section>
      ))}

      {activeResources.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum recurso disponível ainda.</p>
        </div>
      )}

      {activeResources.length > 0 && filteredResources.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum recurso encontrado nesta categoria.</p>
        </div>
      )}
    </div>
  );
};

export default TeacherPortal;