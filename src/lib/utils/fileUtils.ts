import fs from 'fs';
import path from 'path';

export async function saveLocalImage(file: File, type: 'logo' | 'image'): Promise<string> {
  const buffer = await file.arrayBuffer();
  const fileName = `${Date.now()}-${file.name}`;
  const relativePath = `/src/assets/images/projects/${type}s/${fileName}`;
  const fullPath = path.join(process.cwd(), relativePath);
  
  // Ensure directory exists
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Write file
  fs.writeFileSync(fullPath, Buffer.from(buffer));
  
  return relativePath;
}