import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yikusqtmtfageekunycj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_8poTMoDD-dkEA_jRTje7Xg_O4U1FRTM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
