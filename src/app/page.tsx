import { redirect } from 'next/navigation';

export default function Home() {
  // Par défaut, on redirige vers la page de login
  redirect('/login');
}
