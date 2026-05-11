import { Suspense } from 'react';
import LoginPage from './LoginForm';
import { Loader2 } from 'lucide-react';

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    }>
      <LoginPage />
    </Suspense>
  );
}
