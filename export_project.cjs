const fs = require('fs');
const path = require('path');

// Configuration
const OUTPUT_FILE = 'full_project_code.txt';
const IGNORE_DIRS = ['node_modules', '.git', 'dist', 'build', '.next', '.vscode', 'coverage'];
const IGNORE_FILES = ['.DS_Store', 'package-lock.json', 'yarn.lock', OUTPUT_FILE, 'export_project.js'];
const ALLOWED_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.json', '.html', '.css', '.md', '.txt'];

/**
 * Recursively get all files from a directory
 */
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    const fullPath = path.join(dirPath, file);
    
    if (fs.statSync(fullPath).isDirectory()) {
      if (!IGNORE_DIRS.includes(file)) {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
      }
    } else {
      // Check if file should be ignored
      if (!IGNORE_FILES.includes(file)) {
        // Optional: Filter by extension to avoid binary files (images, etc)
        const ext = path.extname(file).toLowerCase();
        if (ALLOWED_EXTENSIONS.includes(ext) || ALLOWED_EXTENSIONS.length === 0) {
           arrayOfFiles.push(fullPath);
        }
      }
    }
  });

  return arrayOfFiles;
}

/**
 * Main execution function
 */
function exportProject() {
  try {
    const projectRoot = __dirname;
    console.log('Scanning files in:', projectRoot);
    
    const allFiles = getAllFiles(projectRoot);
    let outputContent = '';

    console.log(`Found ${allFiles.length} files. Generating output...`);

    allFiles.forEach(filePath => {
      try {
        const relativePath = path.relative(projectRoot, filePath);
        const fileContent = fs.readFileSync(filePath, 'utf8');

        outputContent += `--- START OF FILE ${relativePath} ---\n\n`;
        outputContent += fileContent;
        outputContent += `\n\n--- END OF FILE ${relativePath} ---\n\n`;
        outputContent += `\n`; // Extra spacing
      } catch (readError) {
        console.warn(`Could not read file: ${filePath}`);
      }
    });

    fs.writeFileSync(OUTPUT_FILE, outputContent);
    console.log('------------------------------------------------');
    console.log(`Success! Project code exported to: ${OUTPUT_FILE}`);
    console.log('------------------------------------------------');

  } catch (err) {
    console.error('Error exporting project:', err);
  }
}

// Run the script
exportProject();
