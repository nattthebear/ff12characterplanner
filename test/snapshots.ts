import { describe as baseDescribe, it as baseIt, test } from "node:test";
import * as fs from "node:fs";

let activeFile = "";
let activeSuite = "";
let activeTest = "";
let activeIndex = 0;

export function describe(name: string, location: string, suite: (it: (name: string, test: () => void) => void) => void) {
	activeFile = location;
	activeSuite = name;
	function it(name: string, test: () => void) {
		activeTest = name;
		activeIndex = 0;
		baseIt(name, test);
	}
	baseDescribe(name, () => suite(it));
}

export function snapshot(value: any) {
	if (!activeFile.startsWith("file:///")) {
		throw new Error("Bad activeFile");
	}
	const pathParts = activeFile.slice(8).split("/");
	const fullPath = pathParts.slice(0, -1).join("/");
	const fullName = pathParts.slice(-1);
	const location = fullPath + "/__snapshots__/" + fullName + ".snap";

	let data: Record<string, Record<string, any[]>>;
	if (fs.existsSync(location)) {
		data = JSON.parse(fs.readFileSync(location, { encoding: "utf-8" }));
	} else {
		data = {};
	}
	const suiteData = data[activeSuite] ??= {};
	const testData = suiteData[activeTest] ??= [];
	testData[activeIndex] = value;

	fs.writeFileSync(location, JSON.stringify(data, null, "\t") + "\n", { encoding: "utf-8" });
	activeIndex++;
}
