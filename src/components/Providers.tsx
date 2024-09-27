'use client';
 
import {  SessionProvider } from 'next-auth/react';
 
interface ProviderProps {
  children: React.ReactNode;
}
const Providers = ({children}:ProviderProps):React.ReactNode => {
  return (
    <SessionProvider >
      {children}
    </SessionProvider> 
  )
}
export default Providers