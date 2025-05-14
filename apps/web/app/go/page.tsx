"use client";
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import React from 'react';



export default function GoPage() {
    const router = useRouter();

    React.useEffect(() => {
      router.push("/404");
    
      return () => {

      }
    }, [])
    

  return (
    <div>
    </div>
  );
}