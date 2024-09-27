'use client';
 
import { useSession } from 'next-auth/react';
 
const UserDetails = () => {
  const session = useSession();
  
  if(session.status === "loading") return <div>...loading</div>
  return <div>{JSON.stringify(session)}</div>
}

export default UserDetails;