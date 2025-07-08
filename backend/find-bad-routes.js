import fs from 'fs';
import path from 'path';

const ROUTES_DIR = path.join(process.cwd(), 'routes');
const BAD_ROUTE_REGEX = /['"`]\s*\/:\s*['"`]/;

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (BAD_ROUTE_REGEX.test(line)) {
      console.log(`⚠️  Posible ruta mal formada en ${filePath}:${idx + 1}`);
      console.log(`    ${line.trim()}`);
    }
  });
}

function scanDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
    } else if (file.endsWith('.js')) {
      scanFile(fullPath);
    }
  });
}

console.log('Buscando rutas mal formadas en archivos de rutas...');
scanDir(ROUTES_DIR);
console.log('Búsqueda finalizada.');