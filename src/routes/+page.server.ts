import fs from 'fs';

export async function load() {
  return {
    content: fs.readFileSync('./files/data.csv', 'utf-8'),
  };
}
