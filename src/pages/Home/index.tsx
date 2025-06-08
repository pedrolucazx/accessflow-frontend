import { GET_METRICS } from '@/graphql';
import './styles.css';
import { useQuery } from '@apollo/client';
import type { Metrics } from '@/graphql/types';
import { useToast } from '@/hooks/useToast';
import { Spinner } from '@/components/Spinner';

export function Home() {
  const { addToast } = useToast();

  const { data: metrics, loading: isLoadingMetrics } = useQuery<{
    getMetrics: Metrics;
  }>(GET_METRICS, {
    onError(error) {
      addToast({
        title: 'Erro ao carregar usuários',
        type: 'error',
        description: error.message,
      });
    },
  });

  const totalUsers = metrics?.getMetrics?.totalUsers ?? 0;
  const totalProfiles = metrics?.getMetrics?.totalProfiles ?? 0;
  const activeUsers = metrics?.getMetrics?.activeUsers ?? 0;
  const inactiveUsers = metrics?.getMetrics?.inactiveUsers ?? 0;
  const activePercentage = (activeUsers * 100) / totalUsers;
  const inactivePercentage = (inactiveUsers * 100) / totalUsers;

  return (
    <main className="dashboard" aria-label="Dashboard de métricas">
      <header className="dashboard__header">
        <h1 className="dashboard__title">Dashboard</h1>
      </header>

      <section className="dashboard__cards" aria-label="Métricas principais">
        {isLoadingMetrics ? (
          <Spinner />
        ) : (
          <>
            <article className="dashboard__card" aria-label="Total de usuários">
              <h2 className="dashboard__card-title">Total Usuários</h2>
              <p className="dashboard__card-value">{totalUsers}</p>
            </article>

            <article className="dashboard__card" aria-label="Total de perfis">
              <h2 className="dashboard__card-title">Total Perfis</h2>
              <p className="dashboard__card-value">{totalProfiles}</p>
            </article>

            <article
              className="dashboard__card"
              aria-label="Usuários ativos e inativos"
            >
              <h2 className="dashboard__card-title">
                Ativos vs. Inativos Usuários
              </h2>
              <p className="dashboard__card-value">
                {`${activePercentage}% / ${inactivePercentage}%`}
              </p>
            </article>
          </>
        )}
      </section>
    </main>
  );
}
