import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hrccgivelzkkxtutbgho.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyY2NnaXZlbHpra3h0dXRiZ2hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MzI3NjIsImV4cCI6MjA5MzQwODc2Mn0.fDaVEtyG-LiWEsi1lNmTzdWHPJTlp-q9RJBtgY0mnxc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);