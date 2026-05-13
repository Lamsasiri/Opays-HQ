import fs from 'fs';
import path from 'path';

const dashboardDir = 'src/app/dashboard';

function checkDirectory(dir: string) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      checkDirectory(fullPath);
    } else if (fullPath.endsWith('page.tsx') || fullPath.endsWith('.tsx')) {
      checkFile(fullPath);
    }
  }
}

function checkFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lucideImportsMatch = content.match(/import\s*{([^}]+)}\s*from\s*['"]lucide-react['"]/);
  if (!lucideImportsMatch) return;

  const imported = lucideImportsMatch[1].split(',').map(s => s.trim()).filter(Boolean);
  
  // Find all used components <Component ... /> or <Component />
  const usedMatches = content.matchAll(/<([A-Z][a-zA-Z0-9]+)/g);
  const used = Array.from(usedMatches).map(m => m[1]);

  // Check if any used component that looks like a Lucide icon is NOT in imported
  // Lucide icons are usually single words or camelCase. 
  // We exclude common React components or project components.
  const knownReactComponents = ['Link', 'Suspense', 'Fragment', 'Image'];
  
  for (const component of used) {
    if (knownReactComponents.includes(component)) continue;
    // If it's used in JSX but not imported from lucide (and we know it's a lucide-like name)
    if (!imported.includes(component)) {
      // Check if it's imported from somewhere else
      const otherImport = new RegExp(`import\\s+.*${component}.*\\s+from`).test(content);
      const destructuredImport = new RegExp(`import\\s*{[^}]*${component}[^}]*}\\s*from`).test(content);
      const localDefinition = new RegExp(`(const|let|function|class)\\s+${component}`).test(content);

      if (!otherImport && !destructuredImport && !localDefinition) {
        console.log(`Potential missing import for [${component}] in ${filePath}`);
      }
    }
  }
}

checkDirectory(dashboardDir);
checkDirectory('src/components');
