// call with $0 = tbody
{
	/** @type HTMLElement[] */
	const rows = [...$0.children];
	const names = rows.map(r => (r.firstElementChild.textContent || "").trim());
	const first = names.indexOf("Accessories 1");
	const last = names.indexOf("Yagyu Darkblade & Mesa");
	let category = "";
	let results = "";
	for (let i = first; i <= last; i++) {
		/** @type HTMLElement[] */
		const row = [...rows[i].children];
		const name = row[0].textContent.trim();
		const lp = Number(row[2].textContent);
		const gives = row[4].textContent.split(",").map(s => s.trim());
		if (name.endsWith(" 1")) {
			category = name.slice(0, -2);
		} else if (name === "Genji Armor") {
			category = name;
		}
		results = results + JSON.stringify([lp, category, name, ...gives]) + "\n";
	}
	copy(results);
}
