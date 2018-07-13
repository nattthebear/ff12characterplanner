// call with $0 = tbody
{
	/** @type HTMLElement[] */
	const rows = [...$0.children];
	const names = rows.map(r => (r.firstElementChild.textContent || "").trim());
	const boards = {
		"White Mage": [],
		"Uhlan": [],
		"Machinist": [],
		"Red Battlemage": [],
		"Knight": [],
		"Monk": [],
		"Time Battlemage": [],
		"Foebreaker": [],
		"Archer": [],
		"Black Mage": [],
		"Bushi": [],
		"Shikari": []
	};
	for (const r of rows) {
		/** @type HTMLElement[] */
		const row = [...r.children];
		let name = row[0].textContent.trim();
		{
			let i = names.indexOf(name);
			let j = names.lastIndexOf(name);
			if (i !== j) {
				name += " " + (rows.indexOf(r) - i + 1);
			}
		}
		const binfo = row[3];
		if (binfo.children.length * 2 + 1 !== binfo.childNodes.length) {
			throw new Error("Adjust data?");
		}
		/** @type String[] */
		const positions = [...binfo.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim());
		for (const p of positions) {
			const className = p.split(":")[0].trim();
			const pos = p.split(":")[1].trim();
			if (!boards[className]) {
				console.log("Bad data2", name, p);
				continue;
			}
			const board = boards[className];
			if (pos.length !== 2 && pos.length !== 3) {
				console.log("Bad data3", name, p);
				continue;
			}
			const x = pos[0].charCodeAt(0) - "A".charCodeAt(0);
			const y = Number(pos.slice(1));
			if (typeof x !== "number" || Number.isNaN(x) || typeof y !== "number" || Number.isNaN(y)) {
				console.log("Bad data4", name, p);
				continue;				
			}
			if (x < 0 || y < 0 || x > 20 || y > 20 || x !== (x | 0) || y !== (y | 0)) {
				console.log("Bad data5", name, p);
				continue;						
			}
			if (!board[y]) {
				board[y] = [];
			}
			if (board[y][x]) {
				console.log("Bad data6", name, p, board[y][x]);
				continue;
			}
			board[y][x] = name;
		}
	}
	copy(JSON.stringify(boards));
}
/*
Bad data3 Poach Black Mage: Poach debugger eval code:46:5
Bad data2 Traveler Hunter: M12 debugger eval code:41:5
Bad data6 Magick Lore 3 Bushi: M4 +310 HP debugger eval code:63:5
Bad data4 Martyr Bushi: Ill debugger eval code:52:5
Bad data6 Accessories 8 Black Mage: I12 Black Magick 5 debugger eval code:63:5
Bad data2 Accessories 8 |Bushi: M12 debugger eval code:41:5
Bad data6 Accessories 10 Machinist: F12 Charm debugger eval code:63:5
Bad data6 Accessories 14 Knight: F14 Accessories 11 debugger eval code:63:5
Bad data6 Accessories 17 Black Mage: H14 Gambit Slot 9 debugger eval code:63:5
Bad data6 Bows 5 Archer: K16 Light Armor 6 debugger eval code:63:5
Bad data6 Exodus Knight: M8 +350 HP debugger eval code:63:5
Bad data6 Quickening 2 Black Mage: K18 +310 HP
*/
