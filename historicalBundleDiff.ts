import { spawnSync } from "node:child_process";

// When looking at browser download size, the main things not in here are:
// 1.  HTTP overhead per request, which decreased moderately when we inlined the 14 small svgs
// 2.  Favicon request, which never existed and so was pure overhead until we added the meta tag.
// 3.  Google fonts, which were absolutely massive.

function groupBy<T>(data: T[], key: (item: T) => string): Record<string, T[]> {
	const ret: Record<string, T[]> = {};
	for (const item of data) {
		(ret[key(item)] ??= []).push(item);
	}
	return ret;
}
function mapValues<T, U>(data: Record<string, T>, project: (value: T) => U) {
	const ret: Record<string, U> = {};
	for (const k in data) {
		ret[k] = project(data[k]);
	}
	return ret;
}

function runGitCommand(...args: string[]) {
	const res = spawnSync("git", args, { encoding: "utf-8"});
	if (res.status) {
		throw new Error();
	}
	return res.stdout.split("\n").filter(s => s.trim());
}

// These were part of the create-react-app boilerplate but we never turned on the service worker.
const toIgnore = ["asset-manifest.json", "service-worker.js"];
const PATHSPEC = "docs";

const commits = runGitCommand("log", "--pretty=oneline", "HEAD", PATHSPEC)
	.map(line => {
		const hash = line.slice(0, 40);
		const message = line.slice(41);
		const tree = runGitCommand("ls-tree", "-rl", hash, PATHSPEC)
			.map(raw => {
				const [mode, type, hash, size, path] = raw.split(/\s+/);
				const ext = path.split(".").at(-1)!;
				return { path, ext, size: Number(size) };
			})
			.filter(({ path }) => !toIgnore.find(s => path.endsWith(s)));
		const byExtension = mapValues(groupBy(tree, file => file.ext), group => group.reduce((acc, val) => acc + val.size, 0));
		byExtension.total = Object.values(byExtension).flat().reduce((a, b) => a + b);
		console.log(message);
		console.log("    " + Object.entries(byExtension).sort((x, y) => y[1] - x[1]).map(entry => entry.join(" ")).join("    "));
	});
