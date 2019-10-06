import { Equipment }  from "../Profile";
import { LicenseByName } from "../../data/Licenses";

const l = LicenseByName;

export const Helm: Equipment[] = [
	{ name: "Leather Cap", l: l("Light Armor 1"), },
	{ name: "Headgear", l: l("Light Armor 2"), },
	{ name: "Headguard", l: l("Light Armor 2"), },
	{ name: "Leather Headgear", l: l("Light Armor 3"), },
	{ name: "Horned Hat", l: l("Light Armor 3"), },
	{ name: "Balaclava", l: l("Light Armor 4"), str: 1, },
	{ name: "Soldier's Cap", l: l("Light Armor 4"), },
	{ name: "Green Beret", l: l("Light Armor 5"), spd: 3, },
	{ name: "Red Cap", l: l("Light Armor 5"), vit: 3, },
	{ name: "Headband", l: l("Light Armor 6"), str: 2, },
	{ name: "Pirate Hat", l: l("Light Armor 6"), },
	{ name: "Goggle Mask", l: l("Light Armor 7"), },
	{ name: "Adamant Hat", l: l("Light Armor 7"), },
	{ name: "Officer's Hat", l: l("Light Armor 8"), spd: 3, },
	{ name: "Chakra Band", l: l("Light Armor 8"), str: 2, },
	{ name: "Thief's Cap", l: l("Light Armor 9"), spd: 4, },
	{ name: "Gigas Hat", l: l("Light Armor 9"), mag: 2, },
	{ name: "Chaperon", l: l("Light Armor 10"), },
	{ name: "Crown of Laurels", l: l("Light Armor 11"), },
	{ name: "Renewing Morion", l: l("Light Armor 12"), vit: 4, },
	{ name: "Dueling Mask", l: l("Light Armor 13"), str: 2, },
	{ name: "Leather Helm", l: l("Heavy Armor 1"), str: 2, },
	{ name: "Bronze Helm", l: l("Heavy Armor 1"), str: 2, },
	{ name: "Sallet", l: l("Heavy Armor 2"), str: 3, },
	{ name: "Iron Helm", l: l("Heavy Armor 2"), str: 3, },
	{ name: "Barbut", l: l("Heavy Armor 3"), str: 4, },
	{ name: "Winged Helm", l: l("Heavy Armor 3"), str: 5, spd: 3, },
	{ name: "Golden Helm", l: l("Heavy Armor 4"), str: 5, },
	{ name: "Burgonet", l: l("Heavy Armor 4"), str: 4, },
	{ name: "Close Helmet", l: l("Heavy Armor 5"), str: 5, },
	{ name: "Bone Helm", l: l("Heavy Armor 5"), str: 6, },
	{ name: "Diamond Helm", l: l("Heavy Armor 6"), str: 7, vit: 3, },
	{ name: "Steel Mask", l: l("Heavy Armor 7"), str: 7, spd: 4, },
	{ name: "Platinum Helm", l: l("Heavy Armor 8"), str: 8, },
	{ name: "Giant's Helmet", l: l("Heavy Armor 9"), str: 8, },
	{ name: "Dragon Helm", l: l("Heavy Armor 10"), str: 9, },
	{ name: "Genji Helm", l: l("Genji Armor"), str: 9, mag: 4, },
	{ name: "Magepower Shishak", l: l("Heavy Armor 11"), str: 11, mag: 5, },
	{ name: "Grand Helm", l: l("Heavy Armor 12"), str: 12, vit: 10, },
	{ name: "Cotton Cap", l: l("Mystic Armor 1"), mag: 2, },
	{ name: "Magick Curch", l: l("Mystic Armor 1"), mag: 2, },
	{ name: "Pointy Hat", l: l("Mystic Armor 2"), mag: 2, },
	{ name: "Topkapi Hat", l: l("Mystic Armor 2"), mag: 3, },
	{ name: "Calot Hat", l: l("Mystic Armor 3"), mag: 3, },
	{ name: "Wizard's Hat", l: l("Mystic Armor 3"), mag: 4, },
	{ name: "Lambent Hat", l: l("Mystic Armor 4"), mag: 4, spd: 3, },
	{ name: "Feathered Cap", l: l("Mystic Armor 4"), mag: 5, },
	{ name: "Mage's Hat", l: l("Mystic Armor 5"), mag: 5, },
	{ name: "Lamia's Tiara", l: l("Mystic Armor 5"), mag: 4, vit: 7, },
	{ name: "Sorcerer's Hat", l: l("Mystic Armor 6"), mag: 6, },
	{ name: "Black Cowl", l: l("Mystic Armor 6"), mag: 5, spd: 4, },
	{ name: "Astrakhan Hat", l: l("Mystic Armor 7"), mag: 6, },
	{ name: "Gaia Hat", l: l("Mystic Armor 7"), mag: 7, },
	{ name: "Hypnocrown", l: l("Mystic Armor 8"), str: 2, mag: 7, },
	{ name: "Gold Hairpin", l: l("Mystic Armor 8"), mag: 7, vit: 8, },
	{ name: "Celebrant's Miter", l: l("Mystic Armor 9"), mag: 6, spd: 5, },
	{ name: "Black Mask", l: l("Mystic Armor 10"), mag: 8, },
	{ name: "White Mask", l: l("Mystic Armor 11"), mag: 8, },
	{ name: "Golden Skullcap", l: l("Mystic Armor 12"), mag: 10, spd: 3, },
	{ name: "Circlet", l: l("Mystic Armor 13"), str: 2, mag: 10, },
];

export const BodyArmor: Equipment[] = [
	{ name: "Leather Clothing", l: l("Light Armor 1"), },
	{ name: "Chromed Leathers", l: l("Light Armor 2"), },
	{ name: "Leather Breastplate", l: l("Light Armor 2"), },
	{ name: "Bronze Chestplate", l: l("Light Armor 3"), },
	{ name: "Ringmail", l: l("Light Armor 3"), str: 1, },
	{ name: "Windbreaker", l: l("Light Armor 4"), },
	{ name: "Heavy Coat", l: l("Light Armor 4"), },
	{ name: "Survival Vest", l: l("Light Armor 5"), vit: 5, },
	{ name: "Brigandine", l: l("Light Armor 5"), },
	{ name: "Jujitsu Gi", l: l("Light Armor 6"), str: 2, },
	{ name: "Viking Coat", l: l("Light Armor 6"), },
	{ name: "Metal Jerkin", l: l("Light Armor 7"), },
	{ name: "Adamant Vest", l: l("Light Armor 7"), },
	{ name: "Barrel Coat", l: l("Light Armor 8"), },
	{ name: "Power Vest", l: l("Light Armor 8"), str: 2, },
	{ name: "Ninja Gear", l: l("Light Armor 9"), spd: 4, },
	{ name: "Gigas Chestplate", l: l("Light Armor 9"), mag: 2, },
	{ name: "Minerva Bustier", l: l("Light Armor 10"), },
	{ name: "Rubber Suit", l: l("Light Armor 11"), },
	{ name: "Mirage Vest", l: l("Light Armor 12"), vit: 10, spd: 10, },
	{ name: "Brave Suit", l: l("Light Armor 13"), bravery: true, },
	{ name: "Leather Armor", l: l("Heavy Armor 1"), str: 2, },
	{ name: "Bronze Armor", l: l("Heavy Armor 1"), str: 2, },
	{ name: "Scale Armor", l: l("Heavy Armor 2"), str: 3, spd: 3, },
	{ name: "Iron Armor", l: l("Heavy Armor 2"), str: 3, },
	{ name: "Linen Cuirass", l: l("Heavy Armor 3"), str: 4, },
	{ name: "Chainmail", l: l("Heavy Armor 3"), str: 3, },
	{ name: "Golden Armor", l: l("Heavy Armor 4"), str: 4, },
	{ name: "Shielded Armor", l: l("Heavy Armor 4"), str: 5, },
	{ name: "Demon Mail", l: l("Heavy Armor 5"), str: 5, vit: 3, },
	{ name: "Bone Mail", l: l("Heavy Armor 5"), str: 6, },
	{ name: "Diamond Armor", l: l("Heavy Armor 6"), str: 7, vit: 5, },
	{ name: "Mirror Mail", l: l("Heavy Armor 7"), str: 6, },
	{ name: "Platinum Armor", l: l("Heavy Armor 8"), str: 7, },
	{ name: "Carabineer Mail", l: l("Heavy Armor 9"), str: 8, mag: 2, },
	{ name: "Dragon Mail", l: l("Heavy Armor 10"), str: 8, },
	{ name: "Genji Armor", l: l("Genji Armor"), str: 9, mag: 3, },
	{ name: "Maximillian", l: l("Heavy Armor 11"), str: 9, spd: 6, },
	{ name: "Grand Armor", l: l("Heavy Armor 12"), str: 12, },
	{ name: "Cotton Shirt", l: l("Mystic Armor 1"), mag: 1, },
	{ name: "Light Woven Shirt", l: l("Mystic Armor 1"), mag: 2, },
	{ name: "Silken Shirt", l: l("Mystic Armor 2"), mag: 2, },
	{ name: "Kilimweave Shirt", l: l("Mystic Armor 2"), mag: 3, },
	{ name: "Shepherd's Bolero", l: l("Mystic Armor 3"), mag: 3, },
	{ name: "Wizard's Robes", l: l("Mystic Armor 3"), mag: 4, },
	{ name: "Chanter's Djellaba", l: l("Mystic Armor 4"), mag: 4, vit: 5, },
	{ name: "Traveler's Vestment", l: l("Mystic Armor 4"), mag: 5, },
	{ name: "Mage's Habit", l: l("Mystic Armor 5"), mag: 6, },
	{ name: "Enchanter's Habit", l: l("Mystic Armor 5"), mag: 7, vit: 10, },
	{ name: "Sorcerer's Habit", l: l("Mystic Armor 6"), mag: 8, },
	{ name: "Black Garb", l: l("Mystic Armor 6"), mag: 6, spd: 3, },
	{ name: "Carmagnole", l: l("Mystic Armor 7"), mag: 7, },
	{ name: "Maduin Gear", l: l("Mystic Armor 7"), str: 1, mag: 8, },
	{ name: "Jade Gown", l: l("Mystic Armor 8"), mag: 8, },
	{ name: "Gaia Gear", l: l("Mystic Armor 8"), mag: 8, },
	{ name: "Cleric's Robes", l: l("Mystic Armor 9"), mag: 9, },
	{ name: "White Robes", l: l("Mystic Armor 11"), mag: 10, spd: 4, holyBonus: true, },
	{ name: "Black Robes", l: l("Mystic Armor 10"), mag: 12, darkBonus: true, },
	{ name: "Glimmering Robes", l: l("Mystic Armor 12"), mag: 12, vit: 10, },
	{ name: "Lordly Robes", l: l("Mystic Armor 13"), str: 5, mag: 15, },
];

/*
(() => {
	const elts = [...document.querySelectorAll("tbody")];

	let helms = "";
	let bodys = "";

	function procList(index, thunk, strStart) {
		const rows = [...elts[index].querySelectorAll("tr")];
		for (let i = 1; i < rows.length;) {
			const cells = [...rows[i].children];
			let name = cells[0].querySelector(".attach").textContent;
			let lic = cells[cells.length - 1].textContent.trim();
			let ss = `\t{ name: "${name}", `;
			ss += `l: l("${lic}"), `;
			function dod(index, type) {
				const value = Number(cells[index].textContent);
				if (!Number.isNaN(value)) {
					ss += `${type}: ${value}, `;
				}
			}
			dod(strStart + 0, "str");
			dod(strStart + 1, "mag");
			dod(strStart + 2, "vit");
			dod(strStart + 3, "spd");
			ss += "},\r\n";
			thunk(ss);

			i += Number(cells[0].getAttribute("rowspan"));
		}
	}

	procList(1, z => helms += z, 4);
	procList(2, z => bodys += z, 5);
	procList(3, z => helms += z, 5);
	procList(4, z => bodys += z, 5);
	procList(5, z => helms += z, 5);
	procList(6, z => bodys += z, 5);

	copy(helms + "\r\n\r\n" + bodys);

})();
*/
