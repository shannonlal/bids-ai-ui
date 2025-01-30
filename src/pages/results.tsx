import { NextPage } from 'next';
import { Layout } from '../components/layout/Layout';
import { ResultsComponent } from '../components/results/ResultsComponent';

const ResultsPage: NextPage = () => {
  // TODO: In a real application, this would come from an auth context or session
  const testEmail = 'vincent@gmail.com';

  return (
    <Layout>
      <ResultsComponent email={testEmail} />
    </Layout>
  );
};

export default ResultsPage;
