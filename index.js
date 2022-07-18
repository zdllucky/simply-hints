import fs from 'fs';
import path from "path";
import {execSync} from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const retract = async (subPath) => {
	const from = process.env.SRC_PATH ?? subPath;
	const files = await fs.promises.readdir( from);

	for (const file of files) {
		const fromPath = path.join( from, file );
		const stat = await fs.promises.stat( fromPath );

		if (stat.isFile() && fromPath.endsWith('.html') && !fromPath.endsWith('.min.html')) {
			execSync(`npx minify ${fromPath} > ${fromPath.replace(/\.html$/g, '')}.min.html`);
			console.log(`Minified: ${fromPath}`);
		}
		else if (stat.isDirectory()) {
			await retract(fromPath);
		}
	}
}

await retract(path.resolve(__dirname, 'src'))