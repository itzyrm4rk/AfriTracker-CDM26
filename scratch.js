const fs = require('fs');

async function test() {
  const res = await fetch("https://wcup2026.org?action=all");
  const data = await res.json();
  const m73 = data.matches.find(m => m.id == 73);
  console.log("Match 73 from API:");
  console.log(m73);
  
  const m87 = data.matches.find(m => m.id == 87);
  console.log("Match 87 from API:");
  console.log(m87);
}

test();
