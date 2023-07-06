import { readdir } from "node:fs/promises";
import { statSync, readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

async function readSizes(directory: string) {
	const names = (await readdir(directory)).filter(name => !name.endsWith(".map"));
	const sized = names.map(name => {
		const size = statSync(directory + "/" + name).size;
		const fixedName = name.replace(/\.[0-9a-f]{8}\./, ".");
		const data = readFileSync(directory + "/" + name);
		const zipped = gzipSync(data, { level: 5 }); // level 5 seems reasonably close to the github.io cdn's compression.
		return { name: fixedName, size, compressed: zipped.byteLength };
	});
	return sized;
}

function outputTable<T extends Record<string, string | number>>(data: T[]) {
	const meta = Object.entries(data[0]).map(([k, v]) => {
		const length = Math.max(...data.map(datum => String(datum[k]).length));
		const rightAlign = typeof v === "number" || v.match(/^[0-9]/);
		return {
			display: k,
			length,
			rightAlign,
		};
	})
	function print(items: (string | number)[]) {
		console.log(items.map((item, index) => String(item)[meta[index].rightAlign ? "padStart" : "padEnd"](meta[index].length)).join(" "));
	}
	print(meta.map(column => column.display));
	print(meta.map(column => "=".repeat(column.length)));
	for (const row of data) {
		print(meta.map(column => row[column.display]));
	}
}

(async () => {
	const empty = { size: 0, compressed: 0 };
	const oldf = await readSizes("./docs");
	const newf = await readSizes("./build");
	const combined = new Map<string, { old: { size: number, compressed: number }, nue: { size: number, compressed: number } }>();
	for (const { name, ...sizes } of oldf) {
		combined.set(name, { old: sizes, nue: empty });
	}
	for (const { name, ...sizes } of newf) {
		const existing = combined.get(name);
		if (!existing) {
			combined.set(name, { old: empty, nue: sizes })
		} else {
			existing.nue = sizes;
		}
	}
	const data = [...combined].map(([filename, { old, nue }]) => {
		return {
			Name: filename,

			Old: old.size,
			New: nue.size,
			Diff: nue.size - old.size,
			"Diff%": ((nue.size / old.size - 1) * 100).toFixed(2) + "%",

			"Oldz": old.compressed,
			"Newz": nue.compressed,
			"Diffz": nue.compressed - old.compressed,
			"Diff%z": ((nue.compressed / old.compressed - 1) * 100).toFixed(2) + "%",
		};
	});

	outputTable(data);
})();
