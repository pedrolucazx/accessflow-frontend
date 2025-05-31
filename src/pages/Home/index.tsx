import './styles.css';

export function Home() {
  return (
    <main className="dashboard" aria-label="Dashboard de métricas">
      <header className="dashboard__header">
        <h1 className="dashboard__title">Dashboard</h1>
      </header>

      <section className="dashboard__cards" aria-label="Métricas principais">
        <article className="dashboard__card" aria-label="Total de usuários">
          <h2 className="dashboard__card-title">Total Users</h2>
          <p className="dashboard__card-value">150</p>
        </article>

        <article className="dashboard__card" aria-label="Total de perfis">
          <h2 className="dashboard__card-title">Total Profiles</h2>
          <p className="dashboard__card-value">5</p>
        </article>

        <article
          className="dashboard__card"
          aria-label="Usuários ativos e inativos"
        >
          <h2 className="dashboard__card-title">Active vs. Inactive Users</h2>
          <p className="dashboard__card-value">75% / 25%</p>
        </article>
      </section>
    </main>
  );
}
