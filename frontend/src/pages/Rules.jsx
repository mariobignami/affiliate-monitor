import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { ruleService, sourceService, channelService } from '../services';
import { Plus, Settings, Trash2 } from 'lucide-react';

const Rules = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sourceId: '',
    channelId: '',
    filters: {},
    active: true,
  });

  const { data: rulesData, isLoading: rulesLoading } = useQuery({
    queryKey: ['rules'],
    queryFn: ruleService.getAll,
  });

  const { data: sourcesData } = useQuery({
    queryKey: ['sources'],
    queryFn: sourceService.getAll,
  });

  const { data: channelsData } = useQuery({
    queryKey: ['channels'],
    queryFn: channelService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: ruleService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['rules']);
      setShowForm(false);
      setFormData({
        name: '',
        sourceId: '',
        channelId: '',
        filters: {},
        active: true,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ruleService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['rules']);
    },
  });

  const rules = rulesData?.data || [];
  const sources = sourcesData?.data || [];
  const channels = channelsData?.data || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      sourceId: parseInt(formData.sourceId),
      channelId: parseInt(formData.channelId),
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Regras</h1>
            <p className="mt-1 text-sm text-gray-500">
              Configure regras para conectar fontes aos canais
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nova Regra
          </button>
        </div>

        {showForm && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Adicionar Nova Regra
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
                  Fonte
                </label>
                <select
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={formData.sourceId}
                  onChange={(e) =>
                    setFormData({ ...formData, sourceId: e.target.value })
                  }
                >
                  <option value="">Selecione uma fonte</option>
                  {sources.map((source) => (
                    <option key={source.id} value={source.id}>
                      {source.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Canal
                </label>
                <select
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={formData.channelId}
                  onChange={(e) =>
                    setFormData({ ...formData, channelId: e.target.value })
                  }
                >
                  <option value="">Selecione um canal</option>
                  {channels.map((channel) => (
                    <option key={channel.id} value={channel.id}>
                      {channel.name}
                    </option>
                  ))}
                </select>
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

        {rulesLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Carregando regras...</p>
          </div>
        ) : rules.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Settings className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhuma regra configurada
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Crie regras para conectar suas fontes aos canais
            </p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {rules.map((rule) => (
                <li key={rule.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {rule.name}
                      </h3>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span>
                          Fonte: <strong>{rule.source?.name}</strong>
                        </span>
                        <span>→</span>
                        <span>
                          Canal: <strong>{rule.channel?.name}</strong>
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            rule.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {rule.active ? 'Ativo' : 'Inativo'}
                        </span>
                        {rule.matchCount > 0 && (
                          <span>{rule.matchCount} ofertas processadas</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteMutation.mutate(rule.id)}
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

export default Rules;
