import { readFile } from "node:fs/promises";

export default async function loadCharacters(filePath) {
  const json = await readFile(filePath);
  const content = JSON.parse(json);
  return content.categories;
}
