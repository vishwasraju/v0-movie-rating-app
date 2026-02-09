import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load env vars from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
    console.log('Testing connection to Supabase...')
    try {
        // Try to select from a table that might not exist yet, just to check network/auth
        const { data, error } = await supabase.from('movies').select('count', { count: 'exact', head: true })

        if (error) {
            console.log('Connection successful, but received expected error (tables likely missing):', error.message)
        } else {
            console.log('Connection successful! Table "movies" exists.')
        }
    } catch (err) {
        console.error('Unexpected error:', err)
    }
}

testConnection()
