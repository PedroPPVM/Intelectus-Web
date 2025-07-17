'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('brands');
  }, []);

  return <div>dashboard</div>;
};

export default Dashboard;
