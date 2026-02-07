import { supabase as db } from './utils/client';

export default async function seeder(table: string, arr: any[]): Promise<void> {
  console.log(`Seeding [${table}]`);
  let count = 0;
  for (const each of arr) {
    try {
      const { error } = await db.from(table).upsert(each);
      if (error) {
        console.error(error);
        continue;
      }
      count++;
    } catch (error) {
      console.error(error);
    }
  }
  console.log(`Seeded ${count} rows into ${table}`);
}
