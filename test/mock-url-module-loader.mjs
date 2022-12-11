const MOCK_PROTOCOL = "url:";

export function resolve(specifier, context, nextResolve) {
	if (specifier.startsWith(MOCK_PROTOCOL)) {
		return {
			shortCircuit: true,
			url: specifier
		};
	}
	return nextResolve(specifier);
}

export function load(url, context, nextLoad) {
	if (url.startsWith(MOCK_PROTOCOL)) {
		return {
			format: "module",
			shortCircuit: true,
			source: `const url = ${JSON.stringify("MOCKED" + url)};\nexport default url;\n`,
		};
	}
	return nextLoad(url);
}
