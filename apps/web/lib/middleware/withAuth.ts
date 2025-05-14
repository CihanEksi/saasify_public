import { createClient } from '../server/createSupabaseClient';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../types/supabase';

export interface RouteParams {
  id?: string;
  slug?: string[];
}

export interface AuthContext {
  request: NextRequest;
  supabase: SupabaseClient<Database>;
  user: {
    id: string;
    email?: string;
    [key: string]: any;
  };
  params: RouteParams;
}


export function withAuth(
  handler: (ctx: AuthContext) => Promise<Response>
) {
  return async function wrappedHandler(
    request: NextRequest, 
    context?: { params?: any }
  ): Promise<Response> {
    const supabase = await createClient()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!user || error) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract params from context if available
    const params = context?.params || {};

    return handler({ request, supabase, user, params });
  };
}