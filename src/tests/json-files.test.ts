import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const jsonDir = path.resolve(__dirname, '../../public/data');

describe('validate data files', () => {
  it('all data files contain valid json', () => {
    const files = fs.readdirSync(jsonDir).filter((f) => f.endsWith('.json'));
    const errors: string[] = [];

    for (const file of files) {
      const filePath = path.join(jsonDir, file);
      const content = fs.readFileSync(filePath, 'utf8');

      try {
        JSON.parse(content);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`${file}: ${msg}`);
      }
    }

    if (errors.length > 0) {
      throw new Error(`invalid json file (${errors.length}):\n` + errors.join('\n'));
    }
  });
});