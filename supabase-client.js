// Supabase client (demo). La anon key es pública y segura para frontend.
const SUPABASE_URL = "https://gvybnmvdommtjsrzvhep.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2eWJubXZkb21tdGpzcnp2aGVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUyMDI1MjgsImV4cCI6MjExMDc3ODUyOH0.TxYsSEOQ_izZpbu-PAz3U9L8QgDejrna6VDajfyxMZg";

let supabaseClient = null;
function initSupabase() {
  if (window.supabase && window.supabase.createClient) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    window.supabaseClient = supabaseClient;
  }
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSupabase);
} else {
  initSupabase();
}