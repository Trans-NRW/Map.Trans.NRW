
### Quick Start

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

### Update Yarn Dependencies for Security

1. Check for Vulnerabilities
```bash
yarn audit
```

2. Automatically Fix Vulnerabilities
```bash
yarn audit fix
```

3. Manually Update Packages
To update a specific package:
```bash
yarn up package-name
```
Or update all dependencies:
```bash
yarn up --latest
```

4. Force Full Upgrade
```bash
yarn upgrade --latest
```

5. Regenerate Lockfile
```bash
rm yarn.lock
yarn install
```