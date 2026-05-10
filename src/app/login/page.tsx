import { Suspense } from 'react';
import LoginPage from './LoginForm';

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg animate-pulse">Chargement...</div>
      </div>
    }>
      <LoginPage />
    </Suspense>
  );
}
