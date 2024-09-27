import { signOut } from '@/auth';
import UserDetails from '@/components/UserDetails';
import Link from 'next/link';
export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
       <UserDetails/>
        <Link href="/api/auth/signin">Sign in</Link>
       <form
          action={async () => {
            'use server';
            await signOut(); 
          }}
        >
            <button className="md:block">Sign Out</button>          
        </form>
    </div>
  );
}
