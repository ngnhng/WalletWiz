import fs from 'fs';
import path from 'path';

let packageInfo: Record<string, any> = {};

try {
  packageInfo = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'),
  );
} catch {}
const packageVersion = packageInfo?.version;

export { packageVersion, packageInfo };
