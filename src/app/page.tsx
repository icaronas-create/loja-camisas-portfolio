import { supabase } from '@/lib/supabase'

export default async function Home() {
  const { data, error } = await supabase.from('categorias').select('*')

  return (
    <pre style={{ padding: '2rem', fontSize: '1rem' }}>
      {JSON.stringify({ data, error }, null, 2)}
    </pre>
  )
}