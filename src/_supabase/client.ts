import { createClient } from "@supabase/supabase-js";
const dotenv = require("dotenv");
dotenv.config();

const SUPABASE_DB_URL = process.env.SUPABASE_DB_URL;
const SUPABASE_DB_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_DB_URL, SUPABASE_DB_KEY);

export default supabase;
