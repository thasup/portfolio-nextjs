const fs = require('fs');

function migrate(file, keys, isArray = false) {
  let content = fs.readFileSync(file, 'utf8');
  for (const key of keys) {
    if (key === 'features') {
      content = content.replace(new RegExp(`    ${key}:`, 'g'), `    featuresTh: [],\n    featuresEn:`);
    } else {
      content = content.replace(new RegExp(`    ${key}:`, 'g'), `    ${key}Th: '',\n    ${key}En:`);
    }
  }
  fs.writeFileSync(file, content);
}

migrate('src/data/testimonials.ts', ['quote', 'authorRole', 'relationship']);
migrate('src/data/timelineEvents.ts', ['title', 'summary', 'description', 'impact']);
migrate('src/data/projects.ts', ['title', 'tagline', 'problemSummary', 'problem', 'approach', 'outcomes', 'challenges', 'features']);

// Add chapterId to timelineEvents
let te = fs.readFileSync('src/data/timelineEvents.ts', 'utf8');
te = te.replace(/    date:/g, "    chapterId: 'chapter-1-pivot',\n    date:");
fs.writeFileSync('src/data/timelineEvents.ts', te);

console.log('Migration complete.');
