import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { offerService } from '../services';
import { ExternalLink, Package } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Offers = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['offers'],
    queryFn: () => offerService.getAll(),
  });

  const offers = data?.data?.offers || [];

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      sent: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      skipped: 'bg-gray-100 text-gray-800',
    };
    return badges[status] || badges.skipped;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ofertas</h1>
            <p className="mt-1 text-sm text-gray-500">
              Visualize todas as ofertas capturadas
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Carregando ofertas...</p>
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhuma oferta encontrada
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Configure fontes e aguarde as ofertas serem capturadas
            </p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {offers.map((offer) => (
                <li key={offer.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start space-x-4">
                    {offer.imageUrl && (
                      <img
                        src={offer.imageUrl}
                        alt={offer.title}
                        className="h-20 w-20 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {offer.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                            {offer.description}
                          </p>
                        </div>
                        <span
                          className={`ml-4 px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                            offer.status
                          )}`}
                        >
                          {offer.status}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center space-x-6 text-sm text-gray-500">
                        {offer.price && (
                          <span className="font-semibold text-green-600">
                            R$ {offer.price}
                          </span>
                        )}
                        {offer.discount && (
                          <span className="text-red-600">
                            {offer.discount}% OFF
                          </span>
                        )}
                        {offer.platform && (
                          <span className="capitalize">{offer.platform}</span>
                        )}
                        <span>
                          {format(new Date(offer.createdAt), "d 'de' MMM, HH:mm", {
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                      <div className="mt-2">
                        <a
                          href={offer.affiliateUrl || offer.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500"
                        >
                          Ver oferta
                          <ExternalLink className="ml-1 h-4 w-4" />
                        </a>
                      </div>
                    </div>
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

export default Offers;
