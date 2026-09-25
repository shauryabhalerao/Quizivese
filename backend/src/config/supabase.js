import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
import { config } from './index.js';

if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = WebSocket;
}

/**
 * Quiziverse Supabase Service Connection
 * Project ID: yikusqtmtfageekunycj
 * URL: https://yikusqtmtfageekunycj.supabase.co
 */
const supabaseUrl = config.supabase.url;
const supabaseKey = config.supabase.key;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

export default supabase;
