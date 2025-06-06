import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.1';
import twilio from 'npm:twilio@4.19.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { identity, room } = await req.json();

    // Initialize Twilio client
    const twilioClient = twilio(
      Deno.env.get('TWILIO_ACCOUNT_SID'),
      Deno.env.get('TWILIO_AUTH_TOKEN')
    );

    // Create access token
    const token = new twilio.jwt.AccessToken(
      Deno.env.get('TWILIO_ACCOUNT_SID'),
      Deno.env.get('TWILIO_API_KEY'),
      Deno.env.get('TWILIO_API_SECRET')
    );

    // Create a Video grant and add it to the token
    const videoGrant = new twilio.jwt.AccessToken.VideoGrant({
      room: room
    });
    token.addGrant(videoGrant);
    token.identity = identity;

    return new Response(
      JSON.stringify({ token: token.toJwt() }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});