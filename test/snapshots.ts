import { describe as baseDescribe, it as baseIt, test } from "node:test";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

let activeFile = "";
let activeSuite = "";
let activeTest = "";
let activeIndex = 0;

export function describe(name: string, location: string, suite: (it: (name: string, test: () => void) => void) => void) {
	activeFile = location;
	activeSuite = name;
	function it(name: string, test: () => void) {
		// runs the callback after registration, so set the active test name and reset the index at execution time
		baseIt(name, () => {
			activeTest = name;
			activeIndex = 0;
			test();
		});
	}
	baseDescribe(name, () => suite(it));
}

export function snapshot(value: any) {
	if (!activeFile.startsWith("file:///")) {
		throw new Error("Bad activeFile");
	}
	const testPath = path.dirname(fileURLToPath(activeFile));
	const testFileName = path.basename(fileURLToPath(activeFile));

	const snapFilePath = path.join(testPath, "__snapshots__");
	const snapFileLocation = path.join(snapFilePath, testFileName + ".snap");

	let data: Record<string, Record<string, any[]>>;
	if (fs.existsSync(snapFileLocation)) {
		data = JSON.parse(fs.readFileSync(snapFileLocation, { encoding: "utf-8" }));
	} else {
		data = {};
	}
	const suiteData = data[activeSuite] ??= {};
	const testData = suiteData[activeTest] ??= [];
	testData[activeIndex] = value;

	if (!fs.existsSync(snapFilePath)) {
		fs.mkdirSync(snapFilePath);
	}
	fs.writeFileSync(snapFileLocation, JSON.stringify(data, null, "\t") + "\n", { encoding: "utf-8" });
	activeIndex++;
}
