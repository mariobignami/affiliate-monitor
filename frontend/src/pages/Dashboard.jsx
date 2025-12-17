import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { offerService } from '../services';
import { Package, TrendingUp, Clock, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: offerService.getStats,
  });

  const statCards = [
    {
      title: 'Total de Ofertas',
      value: stats?.data?.total || 0,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Pendentes',
      value: stats?.data?.pending || 0,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      title: 'Enviadas',
      value: stats?.data?.sent || 0,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      title: 'Falhadas',
      value: stats?.data?.failed || 0,
      icon: TrendingUp,
      color: 'bg-red-500',
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Visão geral do monitoramento de ofertas
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 ${stat.color} rounded-md p-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.title}
                        </dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          {isLoading ? '...' : stat.value}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Welcome Message */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Bem-vindo ao Affiliate Monitor
          </h2>
          <div className="prose prose-sm text-gray-500">
            <p>
              Sistema completo para monitorar automaticamente novas ofertas com links de afiliados.
            </p>
            <ul className="mt-4 space-y-2">
              <li>Configure suas <strong>Fontes</strong> (RSS feeds, scrapers)</li>
              <li>Adicione <strong>Canais</strong> (Telegram, WhatsApp, Discord)</li>
              <li>Crie <strong>Regras</strong> para conectar fontes aos canais</li>
              <li>Monitore suas <strong>Ofertas</strong> em tempo real</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
