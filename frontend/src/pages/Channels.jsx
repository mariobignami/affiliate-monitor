import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { channelService } from '../services';
import { Plus, MessageSquare, Trash2 } from 'lucide-react';

const Channels = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'telegram',
    config: { botToken: '', chatId: '' },
    active: true,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['channels'],
    queryFn: channelService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: channelService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['channels']);
      setShowForm(false);
      setFormData({
        name: '',
        type: 'telegram',
        config: { botToken: '', chatId: '' },
        active: true,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: channelService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['channels']);
    },
  });

  const channels = data?.data || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Canais</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gerencie seus canais de envio
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Novo Canal
          </button>
        </div>

        {showForm && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Adicionar Novo Canal
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
                  <option value="telegram">Telegram</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="discord">Discord</option>
                </select>
              </div>
              {formData.type === 'telegram' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Bot Token
                    </label>
                    <input
                      type="text"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      value={formData.config.botToken}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          config: { ...formData.config, botToken: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Chat ID
                    </label>
                    <input
                      type="text"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      value={formData.config.chatId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          config: { ...formData.config, chatId: e.target.value },
                        })
                      }
                    />
                  </div>
                </>
              )}
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
            <p className="text-gray-500">Carregando canais...</p>
          </div>
        ) : channels.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhum canal configurado
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Comece adicionando um canal Telegram, WhatsApp ou Discord
            </p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {channels.map((channel) => (
                <li key={channel.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {channel.name}
                      </h3>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span className="capitalize">{channel.type}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            channel.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {channel.active ? 'Ativo' : 'Inativo'}
                        </span>
                        {channel.messageCount > 0 && (
                          <span>{channel.messageCount} mensagens enviadas</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteMutation.mutate(channel.id)}
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

export default Channels;
