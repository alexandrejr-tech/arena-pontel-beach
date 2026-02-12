import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import DashboardLayout from '../components/layout/DashboardLayout';
import PlanDetails from '../components/dashboard/PlanDetails';
import { SkeletonCard } from '../components/shared/SkeletonLoader';
import * as subscriptionService from '../services/subscriptionService';

export default function MyPlanPage() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = () => {
    setLoading(true);
    subscriptionService.getMySubscription()
      .then((res) => setSubscription(res.data.data))
      .catch(() => setSubscription(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSubscription(); }, []);

  return (
    <DashboardLayout title="Meu Plano">
      <Helmet><title>Meu Plano | Arena Pontel Beach</title></Helmet>
      {loading ? <SkeletonCard /> : <PlanDetails subscription={subscription} onCancel={fetchSubscription} />}
    </DashboardLayout>
  );
}
