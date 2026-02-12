import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProfileForm from '../components/dashboard/ProfileForm';
import ChangePasswordForm from '../components/dashboard/ChangePasswordForm';
import { SkeletonCard } from '../components/shared/SkeletonLoader';
import * as userService from '../services/userService';

export default function MyProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getProfile()
      .then((res) => setProfile(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="Meu Perfil">
      <Helmet><title>Meu Perfil | Arena Pontel Beach</title></Helmet>
      {loading ? (
        <div className="grid lg:grid-cols-2 gap-8"><SkeletonCard /><SkeletonCard /></div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6"><ProfileForm profile={profile} onUpdate={setProfile} /></div>
          <div className="bg-white rounded-xl shadow-md p-6"><ChangePasswordForm /></div>
        </div>
      )}
    </DashboardLayout>
  );
}
