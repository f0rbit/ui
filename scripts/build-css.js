import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = join(__dirname, "../src/styles");
const distDir = join(__dirname, "../dist");

// Ensure dist directory exists
mkdirSync(distDir, { recursive: true });

// CSS files to process (included in combined styles.css)
const cssFiles = ["tokens.css", "reset.css", "utilities.css", "components.css"];

// CSS files to copy but not include in combined bundle
const standaloneCssFiles = ["starlight.css"];

// Copy individual CSS files
for (const file of cssFiles) {
	const content = readFileSync(join(srcDir, file), "utf-8");
	writeFileSync(join(distDir, file), content);
	console.log(`✓ ${file}`);
}

// Create combined styles.css with layer order declaration
const layerOrder = "@layer reset, tokens, components, utilities;\n\n";
const combined = cssFiles
	.map(file => {
		const content = readFileSync(join(srcDir, file), "utf-8");
		return `/* ===== ${file} ===== */\n\n${content}`;
	})
	.join("\n\n");

writeFileSync(join(distDir, "styles.css"), layerOrder + combined);
console.log("✓ styles.css (combined)");

// Copy standalone CSS files (not included in combined bundle)
for (const file of standaloneCssFiles) {
	const content = readFileSync(join(srcDir, file), "utf-8");
	writeFileSync(join(distDir, file), content);
	console.log(`✓ ${file} (standalone)`);
}

console.log("\nCSS build complete!");
