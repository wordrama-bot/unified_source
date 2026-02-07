// Helpers
import seeder from './seeder';

// Data
import challenges from './_seed/challenges.json';
//import items from './_seed/items.json';

console.log('Seeding...');
await seeder('_challenges', challenges);
//await seeder('_items', items);
