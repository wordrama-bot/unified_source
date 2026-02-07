import { createClient } from '@supabase/supabase-js';

export const db = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_TOKEN
);

export function buildFilter(client: any, table: string, initialSelect: string, filters: any[]) {
  let result = client.from(table).select(initialSelect)
  filters.forEach(filter => {
    const { field, operator, value } = filter
    if (typeof result[operator] === 'function') {
      result = result[operator](field, value)
    } else {
      throw new Error(`Operator ${operator} does not exist on the client object`)
    }
  })

  return result
}