"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
// This file is automatically generated. Do not edit it directly.
const supabase_js_1 = require("@supabase/supabase-js");
const SUPABASE_URL = "https://uwcgfyxsdpmlaybjlrcr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3Y2dmeXhzZHBtbGF5YmpscmNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NzQyNjQsImV4cCI6MjA1OTA1MDI2NH0.4yuVXcvI3TqTt6aUzohrIMmAl7YwfJAHdFYUKGORt5k";
// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";
exports.supabase = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
    }
});
