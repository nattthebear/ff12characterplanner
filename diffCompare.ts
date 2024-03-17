import * as prettier from "prettier";
import { readdir, readFile, writeFile } from "node:fs/promises";

// Assumes the old build is in docs/ and the new build is in diff/
async function readdirRelativeNames(path: string) {
	return (await readdir(path)).map(item => path + "/" + item);
}

const extensionsToParsers: { extension: string, parser: prettier.BuiltInParserName }[] = [
	{ extension: "html", parser: "html" },
	{ extension: "js", parser: "typescript" },
	{ extension: "css", parser: "css" },
];

async function doFile(extension: string, parser: prettier.BuiltInParserName, names: string[], outName: string) {
	names = names.filter(s => s.endsWith("." + extension));
	if (names.length !== 1) {
		throw new Error(`Couldn't find extension ${extension}`);
	}
	const content = await readFile(names[0], "utf-8");
	const pretty = await prettier.format(content, { parser });
	await writeFile(`./diffcompare/${outName}.${extension}`, pretty, "utf-8");
}

(async () => {
	const oldFiles = await readdirRelativeNames("./docs");
	const newFiles = await readdirRelativeNames("./build");

	for (const { extension, parser } of extensionsToParsers) {
		await doFile(extension, parser, oldFiles, "old");
		await doFile(extension, parser, newFiles, "new");
	}
})();
