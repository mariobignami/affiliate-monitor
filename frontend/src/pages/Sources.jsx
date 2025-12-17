import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { sourceService } from '../services';
import { Plus, Radio, Trash2 } from 'lucide-react';

const Sources = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'rss',
    url: '',
    active: true,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['sources'],
    queryFn: sourceService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: sourceService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['sources']);
      setShowForm(false);
      setFormData({ name: '', type: 'rss', url: '', active: true });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: sourceService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['sources']);
    },
  });

  const sources = data?.data || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fontes</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gerencie suas fontes de ofertas
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nova Fonte
          </button>
        </div>

        {showForm && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Adicionar Nova Fonte
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo
                </label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                >
                  <option value="rss">RSS Feed</option>
                  <option value="scraper">Web Scraper</option>
                  <option value="api">API</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  URL
                </label>
                <input
                  type="url"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isLoading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                >
                  {createMutation.isLoading ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Carregando fontes...</p>
          </div>
        ) : sources.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Radio className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhuma fonte configurada
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Comece adicionando uma fonte RSS ou scraper
            </p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {sources.map((source) => (
                <li key={source.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {source.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{source.url}</p>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span className="capitalize">{source.type}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            source.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {source.active ? 'Ativo' : 'Inativo'}
                        </span>
                        {source.fetchCount > 0 && (
                          <span>{source.fetchCount} buscas realizadas</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteMutation.mutate(source.id)}
                      className="ml-4 p-2 text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Sources;
