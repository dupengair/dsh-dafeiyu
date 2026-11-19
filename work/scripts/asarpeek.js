const fs = require('fs');
const buf = fs.readFileSync('D:/Software/DSH/resources/app.asar');
const header = JSON.parse(buf.slice(16, 16 + buf.readUInt32LE(12)).toString('utf8'));
function extract(parts, out) {
  let n = header;
  for (const p of parts) n = n.files[p];
  fs.writeFileSync(out, buf.slice(n.offset, n.offset + n.size));
  console.log(out, n.size);
}
extract(['dsh', 'node_modules', '@deepseek-ai', 'dsh-agent-loop', 'lib', 'index.js'], 'tmp/dsh-agent-loop.js');
extract(['dsh', 'node_modules', '@deepseek-ai', 'dsh-agent', 'lib', 'index.js'], 'tmp/dsh-agent.js');
extract(['dsh', 'node_modules', '@deepseek-ai', 'dsh-llm', 'lib', 'types', 'message.js'], 'tmp/dsh-llm-message.js');
