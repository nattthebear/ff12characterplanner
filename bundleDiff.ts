import { readdir } from "node:fs/promises";
import { statSync } from "node:fs";

async function readSizes(directory: string) {
	const names = await readdir(directory);
	const sized = names.map(name => {
		const size = statSync(directory + "/" + name).size;
		const fixedName = name.replace(/\.[0-9a-f]{8}\./, ".");
		return { name: fixedName, size };
	});
	return sized;
}

(async () => {
	const oldf = await readSizes("./docs");
	const newf = await readSizes("./build");
	const combined = new Map<string, { oldSize: number, newSize: number }>();
	for (const { name, size } of oldf) {
		combined.set(name, { oldSize: size, newSize: 0 });
	}
	for (const { name, size } of newf) {
		const existing = combined.get(name);
		if (!existing) {
			combined.set(name, { oldSize: 0, newSize: size })
		} else {
			existing.newSize = size;
		}
	}
	console.log(`${"Name".padEnd(20)}${"Old".padStart(10)}${"New".padStart(10)}${"Diff".padStart(10)}${"Diff%".padStart(10)}`);
	for (const [name, { oldSize, newSize }] of combined) {
		const diffPercent = ((newSize / oldSize - 1) * 100).toFixed(2) + "%";
		console.log(`${name.padEnd(20)}${oldSize.toString().padStart(10)}${newSize.toString().padStart(10)}${(newSize - oldSize).toString().padStart(10)}${diffPercent.padStart(10)}`)
	}
})();
