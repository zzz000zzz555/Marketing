const https = require('https');
https.get('https://zzz000zzz555.github.io/Marketing/app.js?v=999', r => {
  let d = '';
  r.on('data', c => d += c);
  r.on('end', () => {
    console.log('has getElementById campaign:', d.includes('getElementById("campaignBubble")'));
    console.log('has removeAttribute hidden:', d.includes('removeAttribute("hidden")'));
    console.log('length:', d.length);
  });
});