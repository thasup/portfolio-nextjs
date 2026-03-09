import fs from 'fs';
import path from 'path';

const AIRTABLE_PROXY_URL = process.env.AIRTABLE_PROXY_URL || 'https://airtable-proxy-xwqg.onrender.com/appdWXTxlsN1xq1lE/';

async function fetchAirtable() {
  try {
    console.log('Fetching Airtable data from proxy...');
    const tablesResponse = await fetch(AIRTABLE_PROXY_URL);
    
    if (!tablesResponse.ok) {
      throw new Error(`Failed to map Airtable Proxy tables. Status: ${tablesResponse.status}`);
    }

    // Usually we would map responses from table names here, e.g. "Values" and "Reflections"
    // For now, let's write mock values representing static structure to unblock the compiler setup.
    const valuesContent = `export const values = [
  {
    titleEn: "Continuous Delivery",
    titleTh: "การส่งมอบอย่างต่อเนื่อง",
    descriptionEn: "Shipping often, shipping safely.",
    descriptionTh: "ส่งมอบบ่อยๆ และสร้างความมั่นใจในทุกการอัพเดท"
  }
];\n`;
    
    const reflectionsContent = `export const reflections = [];\n`;

    fs.writeFileSync(path.join(process.cwd(), 'src', 'data', 'generated', 'values.ts'), valuesContent);
    fs.writeFileSync(path.join(process.cwd(), 'src', 'data', 'generated', 'reflections.ts'), reflectionsContent);
    
    console.log('Airtable prebuild script completed successfully.');
  } catch (error) {
    console.warn('=============================================');
    console.warn('WARNING: Failed to fetch Airtable data.');
    console.warn('Falling back to static default definitions.');
    console.warn(error instanceof Error ? error.message : error);
    console.warn('=============================================');

    const fallbackValues = `export const values = [
  {
    titleEn: "Empirical Feedback",
    titleTh: "การอ้างอิงจากข้อมูลจริง",
    descriptionEn: "Products should be built alongside users, not simply for them.",
    descriptionTh: "ผลิตภัณฑ์ที่ดีควรสร้างเคียงข้างผู้ใช้งาน"
  }
];\n`;
    
    const fallbackReflections = `export const reflections = [];\n`;

    fs.writeFileSync(path.join(process.cwd(), 'src', 'data', 'generated', 'values.ts'), fallbackValues);
    fs.writeFileSync(path.join(process.cwd(), 'src', 'data', 'generated', 'reflections.ts'), fallbackReflections);
    
    process.exit(0);
  }
}

fetchAirtable();
