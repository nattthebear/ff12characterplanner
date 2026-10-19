import { PS2LicenseData } from "./PS2Licenses.ts";
import { Star } from "./Images.ts";

const rawBoardData: (string | undefined)[][] = Array.from({ length: 24 }, () => Array<string | undefined>(24));
for (const [square, name] of PS2LicenseData) {
	const x = square.charCodeAt(0) - 65;
	const y = Number(square.slice(1)) - 1;
	rawBoardData[y][x] = name;
}

export const PS2BoardData = {
	name: "Original PS2",
	image: Star,
	imageAlt: "Original PlayStation 2 license board",
	text: "The original 2006 PS2 board, shared by all six characters. Uses PS2 licenses, LP costs, starting licenses, and shared Quickening squares. One board per character.",
	rawBoardData,
};
