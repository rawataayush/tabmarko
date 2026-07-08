const fs = require('fs');
const path = require('path');

const base64Png = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
const buffer = Buffer.from(base64Png, 'base64');
const dir = path.join(__dirname, '../icons');

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

['icon-16.png', 'icon-32.png', 'icon-48.png', 'icon-128.png'].forEach(filename => {
    fs.writeFileSync(path.join(dir, filename), buffer);
    console.log(`Created ${filename}`);
});
