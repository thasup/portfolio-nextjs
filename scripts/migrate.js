const fs = require('fs');

const mappings = {
  'src/data/testimonials.ts': {
    'quote': ['quoteEn', 'quoteTh'],
    'authorRole': ['authorRoleEn', 'authorRoleTh'],
    'relationship': ['relationshipEn', 'relationshipTh']
  },
  'src/data/timelineEvents.ts': {
    'title': ['titleEn', 'titleTh'],
    'summary': ['summaryEn', 'summaryTh'],
    'description': ['descriptionEn', 'descriptionTh'],
    'impact': ['impactEn', 'impactTh'],
  },
  'src/data/projects.ts': {
    'title': ['titleEn', 'titleTh'],
    'tagline': ['taglineEn', 'taglineTh'],
    'problemSummary': ['problemSummaryEn', 'problemSummaryTh'],
    'problem': ['problemEn', 'problemTh'],
    'approach': ['approachEn', 'approachTh'],
    'outcomes': ['outcomesEn', 'outcomesTh'],
    'challenges': ['challengesEn', 'challengesTh']
  }
};

for (const [file, map] of Object.entries(mappings)) {
  let content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  const outLines = [];
  
  for (const line of lines) {
    let replaced = false;
    for (const [key, replacement] of Object.entries(map)) {
      const matchKey = `    ${key}: `;
      if (line.startsWith(matchKey)) {
        outLines.push(line.replace(matchKey, `    ${replacement[0]}: `));
        
        let prefix = line.includes('`') ? '`' : "'";
        let suffix = line.includes('`') ? '`,' : "',";
        // for multi-line backticks skip adding empty value if confusing, but let's just use empty string
        outLines.push(`    ${replacement[1]}: '',`);
        replaced = true;
        break;
      }
    }
    
    // For arrays like features
    if (file.includes('projects.ts') && line.startsWith('    features: [')) {
      outLines.push(line.replace('    features: [', '    featuresEn: ['));
      outLines.push('    featuresTh: [],');
      replaced = true;
    }
    
    if (!replaced) outLines.push(line);
  }
  
  fs.writeFileSync(file, outLines.join('\n'));
}

// Add chapterId to timelineEvents
let te = fs.readFileSync('src/data/timelineEvents.ts', 'utf8');
te = te.replace(/    date: /g, "    chapterId: 'chapter-1-pivot',\n    date: ");
fs.writeFileSync('src/data/timelineEvents.ts', te);

console.log('Keys replaced mapped');
