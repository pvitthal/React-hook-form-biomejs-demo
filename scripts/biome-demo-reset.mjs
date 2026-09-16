import { cp, mkdir } from 'node:fs/promises';

const fixtureRoot = new URL('../demo-fixtures/', import.meta.url);
const sourceRoot = new URL('source/', fixtureRoot);
const workingRoot = new URL('working/', fixtureRoot);

await mkdir(workingRoot, { recursive: true });
await cp(sourceRoot, workingRoot, { recursive: true, force: true });

console.log('Restored the Biome demo fixtures to their intentionally failing state.');
