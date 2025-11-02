import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Verify the user is authenticated
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { user_id, title, message, type, related_id, related_type } = await req.json();

    // Validate required fields
    if (!user_id || !title || !message || !type) {
      throw new Error('Missing required fields: user_id, title, message, type');
    }

    // Additional authorization check: 
    // For service_request notifications, verify the user is involved in the request
    if (type === 'service_request' && related_id) {
      const { data: serviceRequest, error: requestError } = await supabaseClient
        .from('service_requests')
        .select('client_id, provider_id')
        .eq('id', related_id)
        .single();

      if (requestError || !serviceRequest) {
        throw new Error('Service request not found');
      }

      // Only allow if the authenticated user is the client or provider
      if (serviceRequest.client_id !== user.id && serviceRequest.provider_id !== user.id) {
        throw new Error('Unauthorized to create notification for this service request');
      }
    }

    // Create notification using service role (bypasses RLS)
    const { data: notification, error: notificationError } = await supabaseClient
      .from('notifications')
      .insert({
        user_id,
        title,
        message,
        type,
        related_id,
        related_type,
        status: 'unread',
      })
      .select()
      .single();

    if (notificationError) {
      throw notificationError;
    }

    console.log(`Notification created: ${notification.id} for user ${user_id}`);

    return new Response(
      JSON.stringify({ success: true, notification }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error creating notification:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
