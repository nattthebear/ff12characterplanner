import { License, LicenseByName } from "./Licenses";
import Aries from "../media/Aries.svg";
import Taurus from "../media/Taurus.svg";
import Gemini from "../media/Gemini.svg";
import Cancer from "../media/Cancer.svg";
import Leo from "../media/Leo.svg";
import Virgo from "../media/Virgo.svg";
import Libra from "../media/Libra.svg";
import Scorpio from "../media/Scorpio.svg";
import Sagittarius from "../media/Sagittarius.svg";
import Capricorn from "../media/Capricorn.svg";
import Aquarius from "../media/Aquarius.svg";
import Pisces from "../media/Pisces.svg";

const rawJobs = [{
	"name": "White Mage",
	"image": Aries,
	"text": "Mages who wield healing and support magicks.",
	"rawBoardData": [
		[null, null, null, null, null, "Libra", null, null, null, null, null, "+230 HP"],
		[null, null, null, null, null, "Cúchulainn", null, null, null, null, null, "Shemhazai", null, "Quickening 4"],
		[null, null, "Accessories 22", "Accessories 20", "Accessories 18", "Accessories 16", "Accessories 14", null, "+190 HP", null, "Accessories 13", "Accessories 15", "Accessories 17", "Battle Lore 1", "Ribbon"],
		["+270 HP", "Zeromus", "Mystic Armor 13", "Magick Lore 13", "Stamp", "Inquisitor", "Accessories 12", null, "Quickening 2", null, "Accessories 11", "Spellbreaker", "Accessories 19", "Accessories 21", "Rod of Faith", "Chaos", "+310 HP"],
		[null, null, "Mystic Armor 12", "Serenity", "Ether Lore 2", "Magick Lore 5", "Accessories 10", "Accessories 8", "Accessories 6", "Accessories 7", "Accessories 9", "Magick Lore 6", "Headsman", "Magick Lore 9", "+110 HP", null, "Greatswords 2"],
		[null, null, "Mystic Armor 11", "Mystic Armor 10", "Mystic Armor 9", "Mystic Armor 8", "Mystic Armor 7", "Mystic Armor 6", "Accessories 5", "Charge", "Rods 3", "Channeling 2", "Rods 4", "Channeling 3", "Battle Lore 2"],
		[null, null, "Magick Lore 14", "Swiftness 2", "Magick Lore 10", null, null, "Mystic Armor 5", "Accessories 4", "Ether Lore 1", "Second Board", null, "Battle Lore 4", "Magick Lore 11", "Magick Lore 15", "Ultima"],
		[null, "Zodiark", "White Magick 13", "Magick Lore 12", "+70 HP", null, "Mateus", "Mystic Armor 4", "Accessories 3", "Rods 2", "Belias", null, "Warmage", "Swiftness 1", "Achilles"],
		[null, "Greatswords 1", null, null, "Famfrit", null, null, "Mystic Armor 3", "Accessories 2", "Battle Lore 3", null, null, "Exodus"],
		[null, null, null, "Numerology", "Daggers 5", null, null, "Mystic Armor 2", "Accessories 1", "Rods 1", null, null, "Battle Lore 6"],
		[null, null, null, null, null, null, null, "Mystic Armor 1", "Essentials", "Gambit Slot 1"],
		[null, null, null, null, null, null, null, "Gambit Slot 2", "White Magick 1", "Magick Lore 1"],
		[null, null, null, null, "+150 HP", "Quickening 1", "Gambit Slot 4", "Martyr", "White Magick 2", "Gambit Slot 3", "Magick Lore 2"],
		[null, null, null, null, null, null, "Magick Lore 3", "+30 HP", "White Magick 3", "Channeling 1", "Gambit Slot 5"],
		[null, null, null, "Battle Lore 7", "Adrammelech", "Magick Lore 7", "Gambit Slot 7", "Magick Lore 4", "White Magick 4", "Magick Lore 8", "Green Magick 3", "Gambit Slot 6"],
		[null, null, null, "Souleater", null, "Gambit Slot 10", "Gambit Slot 9", "Green Magick 1", "White Magick 5", "Green Magick 2", "Gambit Slot 8", "Spellbound", "Zalera"],
		[null, null, null, null, null, "White Magick 12", "White Magick 10", "White Magick 8", "White Magick 6", "White Magick 7", "White Magick 9", "White Magick 11"],
		[null, null, null, null, null, null, null, "Hashmal", null, null, "Quickening 3"],
		[null, null, null, null, null, null, null, null, null, null, "Battle Lore 5"]
	]
}, {
	"name": "Uhlan",
	"image": Taurus,
	"text": "Warriors who wield spears to pierce enemy armor.",
	"rawBoardData": [
		[null, null, "Zeromus", null, null, null, null, null, null, "Quickening 4"],
		[null, null, "Heavy Armor 12", "Poach", "Phoenix Lore 2", null, "Black Magick 6", null, "Adrenaline", "Accessories 21", "Ribbon"],
		[null, null, "Heavy Armor 11", "Heavy Armor 10", "Swiftness 1", null, "Black Magick 5", "Quickening 3", "Swiftness 2", "Accessories 19", "Accessories 22", "Zodiark"],
		[null, null, null, "Heavy Armor 9", "Shades of Black", null, null, null, "+350 HP", "Accessories 17"],
		[null, null, null, "Heavy Armor 8", "Headsman", "Shemhazai", null, null, "+310 HP", "Accessories 15", "Ultima", "Expose"],
		[null, null, null, "Heavy Armor 7", "Infuse", null, null, "Exodus", "+270 HP", "Accessories 13"],
		["Battle Lore 13", "Adrammelech", null, "Heavy Armor 6", "Phoenix Lore 1", null, null, null, "+230 HP", "Accessories 11"],
		[null, "Charm", "Heavy Armor 4", "Heavy Armor 5", "+30 HP", "+70 HP", "+110 HP", "+150 HP", "+190 HP", "Focus", "Accessories 12", "Accessories 14"],
		["Quickening 1", "Remedy Lore 1", "Heavy Armor 3", "Accessories 4", "Accessories 5", "Accessories 6", "Accessories 7", "Accessories 8", "Accessories 9", "Accessories 10", "Remedy Lore 2", "Accessories 16", "Chaos", "Black Magick 7"],
		[null, "Battle Lore 4", "Heavy Armor 2", "Accessories 3", null, "Belias", "Second Board", null, null, "Last Stand", "Battle Lore 6", "Accessories 18", null, "Black Magick 8"],
		[null, "Martyr", "Heavy Armor 1", "Accessories 2", null, null, null, null, null, "Battle Lore 1", "Battle Lore 8", "Accessories 20"],
		[null, "Spears 1", "Essentials", "Accessories 1", null, null, null, "Bonecrusher", "Hashmal", "Achilles", "Battle Lore 12", "Magick Lore 1"],
		[null, "Spears 2", "Battle Lore 3", "Gambit Slot 1", null, null, null, null, null, "Battle Lore 10", "Battle Lore 9", "Magick Lore 2", "Famfrit", "Potion Lore 3"],
		[null, "Spears 3", "First Aid", "Gambit Slot 2", "Gambit Slot 3", "Gambit Slot 4", "Quickening 2", "Gambit Slot 8", "Gambit Slot 9", "Gambit Slot 10", "Battle Lore 11", "Magick Lore 4"],
		[null, "Spears 5", "Spears 4", "Inquisitor", "Potion Lore 1", "Gambit Slot 5", "Gambit Slot 6", "Gambit Slot 7", "Battle Lore 2", "Battle Lore 7", "Battle Lore 15", "Magick Lore 3"],
		[null, null, "Dragon Whisker", "Vrsabha", "Zodiac Spear", "Revive", "Zalera", "Potion Lore 2", "Battle Lore 5", "Spellbound", "Souleater"],
		[null, "Magick Lore 7", "Mateus", null, null, null, null, null, null, null, "Cúchulainn", "Wither"],
		[null, null, "Magick Lore 8"]
	]
}, {
	"name": "Machinist",
	"image": Gemini,
	"text": "Warriors who snipe their foes with deadly precision.",
	"rawBoardData": [
		[null, "Green Magick 1", null, "Quickening 2", null, null, null, null, null, null, null, null, null, "+350 HP", "Chaos"],
		[null, "Exodus", "Gambit Slot 10", "Gambit Slot 7", null, "Belias", "Second Board", null, null, null, null, null, null, null, "Battle Lore 4", "Mithuna"],
		[null, null, "Gambit Slot 9", "Gambit Slot 5", "Gambit Slot 4", "Gambit Slot 3", "Gambit Slot 2", null, null, "Adrammelech", null, "Poach", "Magick Lore 1", "Magick Lore 2", "Battle Lore 3", "Battle Lore 2"],
		[null, null, "Gambit Slot 8", "Gambit Slot 6", "Martyr", "Accessories 2", "Accessories 1", "Light Armor 1", "Light Armor 2", "Light Armor 3", "Potion Lore 1", "Light Armor 4", "Light Armor 5", "Guns 5", "Magick Lore 4", "Guns 6"],
		[null, null, null, "Mateus", null, "Accessories 3", "Essentials", "Guns 1", "Guns 2", "Inquisitor", "Guns 3", "Guns 4", "Headsman"],
		[null, null, null, null, null, "Accessories 4", "Gambit Slot 1", null, null, "Quickening 1", null, "Potion Lore 2", "Light Armor 6"],
		[null, null, null, null, null, "Accessories 5", "Measures 1", null, null, null, null, "Achilles", "Light Armor 7", "Quickening 3"],
		[null, null, null, null, "Zalera", "Accessories 6", "Libra", null, null, null, null, "Ether Lore 1", "Light Armor 8"],
		[null, null, null, null, null, "Accessories 7", "Measures 2", null, null, null, null, "Gil Toss", "Last Stand", null, "Time Magick 9", "Time Magick 10"],
		[null, null, null, null, null, "Accessories 8", "Steal", "Hashmal", null, null, null, "Potion Lore 3", "Light Armor 9", "Famfrit", "Time Magick 8"],
		[null, null, null, null, null, "Accessories 9", "Measures 3", null, null, null, null, "Numerology", "Light Armor 10"],
		["Hand-bombs 4", null, null, null, "Phoenix Lore 1", "Accessories 10", "Charm", "Remedy Lore 1", "Traveler", "Remedy Lore 2", "Horology", "Remedy Lore 3", "Light Armor 11", "Swiftness 1", null, null, "Zodiark", "+390 HP"],
		["Zeromus", "+310 HP", "+190 HP", "+150 HP", "+30 HP", "Accessories 11", "Accessories 12", "Accessories 13", "Accessories 14", "Accessories 15", "Accessories 16", "Accessories 17", "Light Armor 12", "Light Armor 13", "Swiftness 2", "Stamp", "Swiftness 3"],
		[null, "+270 HP", "+230 HP", "+110 HP", "+70 HP", "Spellbound", "Measures 4", null, null, "Cúchulainn", null, "Accessories 18", "Accessories 19", "Accessories 20", "Accessories 21", "Accessories 22", "Ribbon"],
		[null, null, null, null, null, "Shemhazai", null, null, null, "Magick Lore 3", null, null, null, "Ultima", null, "Quickening 4"],
		[null, null, null, null, null, "Hand-bombs 3", null, null, null, null, null, null, null, "Magick Lore 8", "Magick Lore 7", "Magick Lore 6"]
	]
}, {
	"name": "Red Battlemage",
	"image": Cancer,
	"text": "Battlemages equally skilled with maces and magicks.",
	"rawBoardData": [
		[null, null, null, "Steal", null, "White Magick 2"],
		[null, null, null, "Hashmal", null, "Quickening 1", null, "Mateus", null, null, "White Magick 7", null, "+230 HP", null, "Heavy Armor 9", "Heavy Armor 10"],
		[null, null, "Accessories 16", "Accessories 11", "Gambit Slot 6", "Gambit Slot 4", "Gambit Slot 3", "Time Magick 2", null, null, "Shemhazai", null, "Quickening 2", null, "Heavy Armor 8"],
		[null, null, "Accessories 14", "Accessories 10", "Gambit Slot 5", "Martyr", "Gambit Slot 2", "White Magick 3", "Black Magick 3", "Green Magick 2", "Black Magick 4", "Black Magick 5", "Black Magick 6", "Time Magick 3", "Exodus"],
		[null, null, "Accessories 22", "Accessories 13", "Second Board", "Belias", "Gambit Slot 1", "Green Magick 1", "White Magick 4", "Arcane Magick 2", "White Magick 5", "Green Magick 3", "White Magick 6", "Arcane Magick 3"],
		["Channeling 3", "Zeromus", "Ribbon", "Accessories 20", null, null, "Arcane Magick 1", "Time Magick 1", null, null, null, "Cúchulainn"],
		[null, null, "Accessories 21", "Accessories 19", null, null, "Essentials", "Mystic Armor 1", null, null, null, "Black Magick 9", "Black Magick 10", null, "Battle Lore 4", "Battle Lore 2"],
		[null, null, "Accessories 18", "Accessories 12", null, null, "Accessories 1", "Maces 1", null, null, null, null, null, null, "Famfrit"],
		[null, null, "Accessories 15", "Accessories 8", "Accessories 6", "Accessories 4", "Accessories 2", "Mystic Armor 2", "Mystic Armor 3", "Mystic Armor 4", "Shields 2", "Gambit Slot 7", "Shields 3", "Gambit Slot 8", "Gambit Slot 9", "Gambit Slot 10"],
		[null, "Zalera", "Accessories 17", "Accessories 9", "Accessories 7", "Accessories 5", "Accessories 3", "Charge", "Shields 1", "Maces 2", "Warmage", "Mystic Armor 5", "Mystic Armor 6", "Mystic Armor 7", "Mystic Armor 8", "Shields 4"],
		[null, null, null, null, "Adrammelech", null, null, null, null, null, "Battle Lore 3", "+110 HP", null, null, "Mystic Armor 9", "Shields 5"],
		[null, null, null, null, null, null, "Greatswords 4", null, null, null, "Maces 3", "Ether Lore 1", null, null, "Mystic Armor 10", "Shields 6", null, "Greatswords 2"],
		[null, null, null, "+435 HP", null, null, "Zodiark", null, null, null, "Inquisitor", "Spellbreaker", null, null, "Mystic Armor 11", "Shields 7", "Ultima", "Greatswords 1"],
		[null, null, null, "Quickening 4", "Ensanguined Shield", "Magick Lore 11", "Magick Lore 10", "Magick Lore 6", "Magick Lore 7", "Magick Lore 2", "Maces 4", "Channeling 1", null, null, "Mystic Armor 12", "Shell Shield"],
		[null, null, null, null, "Zodiac Escutcheon", "Magick Lore 12", "Magick Lore 9", "Magick Lore 5", "Magick Lore 8", "Magick Lore 3", "Magick Lore 1", "+190 HP", "Swiftness 1", "Serenity", "Mystic Armor 13", "Souleater"],
		[null, null, null, null, null, null, null, null, "Quickening 3", null, "Magick Lore 4", "Maces 5", "Channeling 2", "Headsman", "+270 HP", "Spellbound"],
		[null, null, null, null, null, null, null, null, null, null, null, null, null, "Chaos"],
		[null, null, null, null, null, null, null, null, null, null, null, null, null, "Greatswords 3"]
	]
}, {
	"name": "Knight",
	"image": Leo,
	"text": "Stalwart warriors who wield swords and shield.",
	"rawBoardData": [
		[null, null, null, null, null, null, null, null, null, null, "Potion Lore 2"],
		[null, null, "Souleater", "Adrenaline", "Headsman", null, "Quickening 2", null, null, null, "Shemhazai"],
		[null, null, "+270 HP", "Heavy Armor 4", "Shield Block 1", "Heavy Armor 5", "Battle Lore 3", "Heavy Armor 6", "Battle Lore 4", "Heavy Armor 7", "Battle Lore 2", "Heavy Armor 8"],
		["White Magick 7", null, "Gambit Slot 6", "Martyr", "Swords 3", "Shields 3", "Swords 4", "Shields 4", "Swords 5", "Shields 5", "Swords 6", "Battle Lore 1"],
		["White Magick 6", "Mateus", "Gambit Slot 5", "Heavy Armor 3", "Shields 2", null, null, null, null, null, "Shields 6", "Heavy Armor 9", "Quickening 3"],
		[null, null, "Gambit Slot 4", "+230 HP", "Swords 2", "Belias", "Potion Lore 1", null, null, null, "Swords 7", "Battle Lore 5"],
		[null, null, "Gambit Slot 3", "Heavy Armor 2", "Shields 1", "Second Board", null, null, "Battle Lore 9", "Cúchulainn", "Shields 7", "Greatswords 1"],
		[null, null, "Gambit Slot 2", "Inquisitor", "Swords 1", null, null, null, null, null, "Swords 8", "Heavy Armor 10", "Exodus", "+350 HP"],
		["+190 HP", "+110 HP", "+70 HP", "Heavy Armor 1", "Essentials", "Accessories 1", "Accessories 2", null, null, null, "Shield Block 2", "Greatswords 2"],
		["Gambit Slot 7", "Last Stand", "+30 HP", "Gambit Slot 1", "First Aid", "Accessories 3", "Accessories 4", null, null, null, "Swords 9", "Battle Lore 6", null, "Famfrit"],
		["Gambit Slot 8", "+150 HP", null, null, null, "Accessories 5", "Accessories 6", "Quickening 1", null, null, "+310 HP", "Greatswords 3", "Heavy Armor 11", "Greatswords 4", "Heavy Armor 12"],
		["Gambit Slot 9", "Infuse", null, null, null, "Accessories 7", "Accessories 8", null, null, "Zeromus", "Spellbound", "Battle Lore 7", "Shell Shield", "Battle Lore 10", "Excalibur", null, "Battle Lore 11"],
		["Gambit Slot 10", "Focus", null, "Zalera", null, "Accessories 9", "Accessories 10", null, null, null, "Shield Block 3", "Sight Unseeing", "Battle Lore 8", "Battle Lore 12", "Genji Armor", "Ultima", "Telekinesis"],
		["Blood Sword", "Accessories 21", "Accessories 19", "Accessories 17", "Accessories 13", "Accessories 11", "Accessories 12", "Adrammelech", null, null, "Karkata", "Ensanguined Shield", "Swiftness 1", "Zodiac Escutcheon", "Tournesol"],
		["Ribbon", "Accessories 22", "Accessories 20", "Accessories 18", "Accessories 16", "Accessories 14", "Accessories 15", null, null, null, null, "Chaos", "Quickening 4", "Zodiark"],
		[null, "Hashmal", null, null, null, null, null, null, null, null, null, "+390 HP", "Revive", "Excalipur"],
		[null, "White Magick 8", "White Magick 9"]
	]
}, {
	"name": "Monk",
	"image": Virgo,
	"text": "Warriors who temper their bodies into deadly weapons.",
	"rawBoardData": [
		[null, null, null, "Cúchulainn", null, null, null, null, "Belias", "Second Board"],
		[null, null, "Brawler", "Battle Lore 1", null, "Inquisitor", "Martyr", null, "First Aid", "Libra"],
		[null, null, "Battle Lore 5", "Light Armor 4", "Light Armor 3", "Light Armor 2", "Light Armor 1", "Gambit Slot 1", "Gambit Slot 2", "Gambit Slot 3", "Quickening 1"],
		["Traveler", "Zalera", "Battle Lore 2", "Light Armor 5", "Battle Lore 3", "+30 HP", "Essentials", "Accessories 1", "Accessories 2", "Gambit Slot 4"],
		[null, null, "Battle Lore 4", "Light Armor 6", null, "+70 HP", "Poles 1", null, "Accessories 3", "Gambit Slot 5", null, "Adrammelech", null, null, "Phoenix Lore 2"],
		["White Magick 9", "Quickening 2", "Numerology", "Light Armor 7", null, "+110 HP", "Poles 2", null, "Accessories 4", "Potion Lore 1", "Gambit Slot 6", "Focus", "Gambit Slot 7", "Gambit Slot 8", "Quickening 4"],
		[null, null, "Battle Lore 6", "Light Armor 8", null, "+150 HP", "Poles 3", null, "Accessories 5", "Phoenix Lore 1", "Last Stand", "Spellbound", "+310 HP", "Gambit Slot 9", "Zeromus", "Sight Unseeing"],
		["White Magick 4", "Hashmal", "Headsman", "Light Armor 9", null, "+190 HP", "Poles 4", null, "Accessories 6", "Accessories 7", null, null, "+350 HP", "Gambit Slot 10"],
		[null, null, "Battle Lore 7", "Light Armor 10", null, "Potion Lore 2", "Poles 5", null, "Accessories 8", "Accessories 9", null, "Quickening 3", "+390 HP", "Swiftness 1", "Chaos", "White Magick 11"],
		["Potion Lore 3", "Shemhazai", "Battle Lore 8", "Light Armor 11", null, "+230 HP", "Poles 6", null, "Accessories 10", "Accessories 11", "Mateus", null, "+500 HP", "Battle Lore 9", null, "White Magick 12"],
		[null, null, "Battle Lore 10", "Light Armor 12", null, "Revive", "Bonecrusher", null, "Accessories 12", "Accessories 13", null, null, "Accessories 22", "Battle Lore 11"],
		[null, null, "Battle Lore 12", "Light Armor 13", null, "+270 HP", "Whale Whisker", null, "Achilles", "Accessories 14", "Accessories 15", "Accessories 17", "Accessories 19", "Ribbon", "Battle Lore 13", "Ultima", "Swiftness 2"],
		[null, null, "Wither", "+435 HP", null, "Expose", "Kanya", null, "Adrenaline", "Shades of Black", "Accessories 16", "Accessories 18", "Accessories 20", "Accessories 21", "Battle Lore 14", null, "Swiftness 3"],
		[null, null, null, null, null, "Exodus", null, null, null, "Famfrit", null, null, "Battle Lore 15", "Battle Lore 16"],
		[null, null, null, null, null, "Souleater", null, null, null, "White Magick 10", null, "White Magick 13", "Zodiark"]
	]
}, {
	"name": "Time Battlemage",
	"image": Libra,
	"text": "Battlemages who wield crossbows and bend time to their will.",
	"rawBoardData": [
		[null, null, null, null, null, "Channeling 3", null, "+150 HP", null, "White Magick 4"],
		[null, null, null, null, null, "Hashmal", null, "Quickening 2", null, "Adrammelech"],
		[null, null, null, "Gambit Slot 8", "Channeling 1", "Magick Lore 7", "Warmage", "Magick Lore 8", "Charge", "Magick Lore 3", "Magick Lore 4", "Poach", "Spellbreaker"],
		[null, "Battle Lore 12", "Exodus", "Gambit Slot 9", "Headsman", "Heavy Armor 6", "Time Magick 6", "Swiftness 1", "Heavy Armor 5", "Time Magick 5", "Heavy Armor 4", "Ether Lore 2", "Gambit Slot 7"],
		[null, null, null, "Gambit Slot 10", "Magick Lore 6", "Time Magick 7", null, "Zalera", null, null, "Magick Lore 2", "Time Magick 4", "Gambit Slot 6", "Mateus", "+230 HP"],
		[null, null, null, "+190 HP", "Remedy Lore 2", "Heavy Armor 7", null, "Ether Lore 3", null, "Second Board", "Heavy Armor 3", "Time Magick 3", "Gambit Slot 5"],
		[null, null, "Quickening 3", "Horology", "Last Stand", "Heavy Armor 8", null, null, null, "Belias", "Heavy Armor 2", "Time Magick 2", "Gambit Slot 4", "Quickening 1"],
		[null, null, null, "Spellbound", "Magick Lore 5", "Time Magick 8", null, null, null, null, "Magick Lore 1", "Time Magick 1", "Gambit Slot 2"],
		["Battle Lore 9", "Famfrit", null, "Ether Lore 1", "Serenity", "Heavy Armor 9", "Zeromus", "Addle", "Shear", null, "Heavy Armor 1", "Essentials", "Gambit Slot 1"],
		[null, "Magick Lore 9", "Heavy Armor 12", "Stamp", "Time Magick 9", "Heavy Armor 10", null, null, null, null, "Martyr", "Accessories 1", "Accessories 2", "Inquisitor", "Remedy Lore 1"],
		[null, "Swiftness 3", "Time Magick 10", "Heavy Armor 11", "Channeling 2", "Swiftness 2", null, "+270 HP", null, null, "Gambit Slot 3", "Crossbows 1", "Accessories 3", "Accessories 4", "Crossbows 2"],
		[null, null, null, null, null, null, null, "Chaos", null, null, null, null, null, "Accessories 5"],
		[null, null, "Accessories 20", "Accessories 18", "Accessories 16", "Accessories 14", "Accessories 13", "Accessories 12", "Accessories 11", "Accessories 10", "Accessories 9", "Accessories 8", "Accessories 7", "Accessories 6"],
		[null, "Accessories 22", "Accessories 21", "Accessories 19", "Accessories 17", "Accessories 15", "Crossbows 4", "Battle Lore 7", "Battle Lore 6", "Battle Lore 5", "Battle Lore 1", "Battle Lore 2", "Battle Lore 4", "Battle Lore 3", "+110 HP"],
		[null, "Ribbon", "Battle Lore 10", "Battle Lore 8", "Green Magick 3", null, "Ultima", null, null, "Cúchulainn", null, "Green Magick 2", "Crossbows 3", "Green Magick 1", "Numerology", "Shemhazai"],
		[null, null, "Zodiark", null, "Quickening 4", null, "Swords 7"],
		[null, null, "Swords 9", null, null, null, "Swords 8"]
	]
}, {
	"name": "Foebreaker",
	"image": Scorpio,
	"text": "Warriors who use mighty weapons to tear their foes asunder.",
	"rawBoardData": [
		[null, null, null, "Shades of Black", null, "Swiftness 2"],
		[null, null, null, "Cúchulainn", null, "Hashmal", "Quickening 2", null, null, "Quickening 1"],
		[null, null, "Shell Shield", "Last Stand", null, "Shear", "Martyr", null, "Gambit Slot 3", "Gambit Slot 4"],
		[null, "Shemhazai", "Gambit Slot 9", "Gambit Slot 8", "Gambit Slot 7", "Gambit Slot 6", "Gambit Slot 5", "Infuse", "Gambit Slot 1", "Gambit Slot 2"],
		[null, null, "Heavy Armor 6", "Heavy Armor 5", "Heavy Armor 4", "Heavy Armor 3", "Heavy Armor 2", "Heavy Armor 1", "Essentials", "Accessories 1"],
		["+390 HP", "Quickening 3", "Heavy Armor 7", "Axes & Hammers 6", "Axes & Hammers 5", "Axes & Hammers 4", "Axes & Hammers 3", "Axes & Hammers 2", "Axes & Hammers 1", "Accessories 2"],
		[null, null, "Heavy Armor 8", "Axes & Hammers 7", null, "Inquisitor", "Shields 1", null, "+30 HP", "Accessories 3", "Belias", "Horology"],
		[null, null, "Heavy Armor 9", "Vrscika", null, "Shield Block 1", "Shields 2", null, "Battle Lore 3", "Accessories 4", "Second Board", null, null, null, "Swiftness 3"],
		[null, null, "Heavy Armor 10", "Gambit Slot 10", null, "Adrenaline", "Shields 3", null, "+70 HP", "Accessories 5", null, null, null, null, "Ultima"],
		["Magick Lore 1", "Exodus", "Heavy Armor 11", "Sight Unseeing", null, "Shield Block 2", "Shields 4", null, "Battle Lore 4", "Accessories 6", null, null, "Accessories 17", "Accessories 18", "Accessories 19", "Zodiark"],
		["Magick Lore 2", null, "Heavy Armor 12", "Spellbound", null, "Headsman", "Shields 5", null, "+110 HP", "Accessories 7", "Mateus", null, "Accessories 16", "Battle Lore 9", "Accessories 22"],
		["Magick Lore 4", null, "Genji Armor", "Expose", null, "Shield Block 3", "Shields 6", null, "Battle Lore 2", "Accessories 8", null, null, "Accessories 15", "Battle Lore 12", "Accessories 21"],
		["Magick Lore 3", "Zeromus", "Swiftness 1", "Ensanguined Shield", null, "Focus", "Shields 7", null, "+150 HP", "Accessories 9", null, null, "Accessories 14", "Battle Lore 10", "Accessories 20"],
		[null, null, "Addle", "Wither", null, "Hand-bombs 2", "Hand-bombs 1", null, "Battle Lore 1", "Accessories 10", "Accessories 11", "Accessories 12", "Accessories 13", "+310 HP", "+350 HP"],
		[null, null, "Ribbon", "Zodiac Escutcheon", null, "Hand-bombs 4", "Hand-bombs 3", null, "+190 HP", "Battle Lore 5", "+230 HP", "Battle Lore 6", "+270 HP", "Battle Lore 7", "Battle Lore 8", "Chaos"],
		[null, null, null, "Quickening 4", null, null, "Adrammelech", null, null, "Zalera", null, null, null, null, "Famfrit"],
		[null, null, null, "Battle Lore 15", null, null, "Battle Lore 11", null, null, "Traveler", null, null, null, null, "Magick Lore 8"]
	]
}, {
	"name": "Archer",
	"image": Sagittarius,
	"text": "Warriors who rain death on their foes from afar.",
	"rawBoardData": [
		[null, null, null, null, null, null, "Quickening 4", null, null, "Hashmal"],
		[null, null, null, null, null, null, "+230 HP", "Revive", "Gambit Slot 10", "Gambit Slot 9", "Gambit Slot 8"],
		[null, null, "+435 HP", "+390 HP", "Famfrit", "+310 HP", "+270 HP", "Focus", "Traveler", "+110 HP", "Gambit Slot 7", "Gambit Slot 6"],
		[null, null, null, null, null, null, "Ribbon", "+190 HP", "+150 HP", "Charm", "+70 HP", "Gambit Slot 5", "Zalera"],
		[null, null, null, null, null, null, null, null, null, null, "+30 HP", "Gambit Slot 4"],
		[null, null, null, null, null, "Battle Lore 4", "Accessories 19", null, null, "Mateus", "Poach", "Gambit Slot 3", "Quickening 1", "White Magick 4"],
		[null, null, null, null, null, "Accessories 21", "Accessories 13", "Zeromus", null, null, "Libra", "Gambit Slot 2"],
		[null, null, "Quickening 3", null, null, "Accessories 16", "Accessories 9", null, null, null, "First Aid", "Gambit Slot 1", null, null, null, null, "Exodus"],
		["Infuse", "Ultima", "Remedy Lore 3", "Shear", "Accessories 15", "Accessories 11", "Accessories 7", "Accessories 5", "Accessories 3", "Accessories 1", "Essentials", "Bows 1", "Martyr", "Headsman", "Remedy Lore 1", "Phoenix Lore 1", "Spellbound", "Potion Lore 2"],
		["1000 Needles", "Zodiark", "Phoenix Lore 3", "Addle", "Accessories 17", "Accessories 12", "Accessories 8", "Accessories 6", "Accessories 4", "Accessories 2", "Light Armor 1", "Bows 2", "Inquisitor", "Swiftness 1", "Potion Lore 1", "Remedy Lore 2", "Battle Lore 3", "Potion Lore 3"],
		[null, null, null, null, null, "Shades of Black", "Accessories 10", null, null, null, "Light Armor 2", "Steal", null, null, "Cúchulainn"],
		[null, null, null, "Magick Lore 2", "Chaos", "Accessories 18", "Accessories 14", null, null, "Belias", "Light Armor 3", "Bows 3"],
		[null, "Magick Lore 8", "Magick Lore 3", "Magick Lore 4", null, "Accessories 22", "Accessories 20", "Quickening 2", null, "Second Board", "Light Armor 4", "Last Stand"],
		[null, "Magick Lore 7", null, null, null, null, null, null, null, null, "Light Armor 5", "Bows 4", "Adrammelech"],
		[null, null, null, null, null, null, "Light Armor 10", "Light Armor 9", "Light Armor 8", "Light Armor 7", "Light Armor 6", "Gil Toss"],
		[null, null, null, null, null, "Light Armor 12", "Light Armor 11", "Swiftness 3", "Bows 7", "Achilles", "Bows 5", "Magick Lore 1"],
		[null, null, null, null, null, "Light Armor 13", "Dhanusha", "Sagittarius", "Phoenix Lore 2", "Bows 6", "Swiftness 2"],
		[null, null, null, null, null, null, null, null, "Shemhazai"],
		[null, null, null, null, null, null, "Heavy Armor 12", "Heavy Armor 11", "Heavy Armor 10"]
	]
}, {
	"name": "Black Mage",
	"image": Capricorn,
	"text": "Mages who channel elemental forces into deadly magicks.",
	"rawBoardData": [
		[null, null, null, null, null, null, null, null, "+70 HP"],
		[null, null, null, null, "Zodiark", null, "Hand-bombs 3", null, "Quickening 1"],
		[null, null, null, "Mystic Armor 13", "Mystic Armor 12", null, "Mateus", "Magick Lore 4", "Gambit Slot 5", "Adrammelech", "Hand-bombs 2"],
		[null, "+390 HP", "Quickening 4", "Mystic Armor 11", "Staves 5", null, null, "Channeling 1", "Gambit Slot 4"],
		[null, null, null, "Magick Lore 11", "Mystic Armor 10", null, null, "Magick Lore 2", "Gambit Slot 2"],
		[null, null, null, "Magick Lore 10", "Mystic Armor 9", null, null, "Magick Lore 1", "Gambit Slot 1", "Gambit Slot 3", "Gambit Slot 6", "Martyr"],
		[null, null, null, "Magick Lore 9", "Staves 4", "Quickening 3", null, "Mystic Armor 1", "Essentials", "Accessories 1", "Accessories 2", "Accessories 4"],
		[null, null, null, "Magick Lore 5", "Mystic Armor 8", null, "Second Board", "Mystic Armor 2", "Black Magick 1", null, "Accessories 3", "Gambit Slot 7", null, "Poach"],
		[null, null, null, "Black Magick 13", "Mystic Armor 7", null, "Belias", "Staves 1", "Black Magick 2", null, "Ether Lore 1", "Accessories 5", "Zalera", "Steal"],
		[null, null, null, "Black Magick 12", "Staves 3", null, null, "Mystic Armor 3", "Black Magick 3", null, "Accessories 6", "Magick Lore 3", null, null, "Hand-bombs 4"],
		[null, null, null, "Black Magick 11", "Mystic Armor 6", "Mystic Armor 5", "Staves 2", "Mystic Armor 4", "Black Magick 4", null, "Warmage", "Accessories 7", null, null, "Hashmal"],
		[null, null, null, "Black Magick 10", "Black Magick 9", "Black Magick 8", "Black Magick 7", "Black Magick 6", "Black Magick 5", null, "Accessories 8", "Inquisitor", "Magick Lore 8", "Green Magick 1", "Channeling 2", "+270 HP"],
		[null, null, null, null, null, null, null, null, null, null, "Charge", "Accessories 9", "Ether Lore 2", "Spellbreaker", "Magick Lore 7", "Magick Lore 6"],
		["Telekinesis", "Ultima", "Magick Lore 14", "Magick Lore 15", "Ribbon", "Channeling 3", "Accessories 19", "Gambit Slot 9", "Accessories 15", "Remedy Lore 1", "Accessories 10", "+150 HP", null, null, "Remedy Lore 2", "Headsman", "Shemhazai", "Heavy Armor 7"],
		[null, null, "Magick Lore 16", "Magick Lore 13", "Magick Lore 12", "Accessories 21", "Green Magick 2", "Accessories 17", "Charm", "Accessories 12", "Serenity", "Accessories 11", null, null, "Ether Lore 3", "Green Magick 3"],
		[null, null, null, "Chaos", null, "Famfrit", null, null, "Zeromus", null, "Accessories 13", "Gambit Slot 8", "Accessories 16", "Gambit Slot 10", "Accessories 20", "Staff of the Magi"],
		[null, null, null, null, "+230 HP", "+190 HP", null, null, "Heavy Armor 9", null, "Spellbound", "Accessories 14", "Swiftness 1", "Accessories 18", "Swiftness 2", "Accessories 22"],
		[null, null, null, null, "+310 HP", null, null, null, null, null, "Quickening 2", null, "Cúchulainn", null, "Exodus"],
		[null, null, null, null, null, null, null, null, null, null, null, null, null, null, "Heavy Armor 8"]
	]
}, {
	"name": "Bushi",
	"image": Aquarius,
	"text": "Swordmasters who devote themselves body and soul to their lords.",
	"rawBoardData": [
		[null, null, null, null, null, null, null, null, null, null, "Karkata", null, "Masamune", "Kumbha"],
		[null, null, null, null, null, null, null, null, "Souleater", null, "Blood Sword", "Zalera", "Magick Lore 7", "Serenity", null, "Battle Lore 7"],
		[null, null, null, null, null, null, null, null, "Adrammelech", null, null, null, "Magick Lore 8", "Katana 5", "Quickening 3", "+390 HP"],
		[null, null, null, null, null, null, null, "Magick Lore 2", "+230 HP", "Magick Lore 4", "+270 HP", "Spellbreaker", "Magick Lore 3", "+310 HP"],
		[null, null, null, null, null, null, "Second Board", "+190 HP", "Inquisitor", "Katana 2", "Swiftness 2", "Katana 3", "Headsman", "Katana 4", null, null, "Gambit Slot 9", "Gambit Slot 10"],
		[null, null, null, null, null, "Libra", "Belias", "Magick Lore 1", "Swiftness 1", null, "Mateus", null, "Hashmal", null, null, null, "Gambit Slot 8", "Sight Unseeing"],
		[null, null, null, null, null, null, null, "+150 HP", "Katana 1", null, null, null, null, null, null, null, "Gambit Slot 7", "1000 Needles"],
		[null, null, null, "Shield Block 1", null, null, null, "+70 HP", "Essentials", "Accessories 1", "Accessories 2", "Last Stand", "Gambit Slot 1", "Gambit Slot 3", "Gambit Slot 4", "Gambit Slot 5", "Gambit Slot 6", "Gil Toss"],
		[null, null, null, "Shemhazai", null, null, null, "+110 HP", "Mystic Armor 1", null, null, "Accessories 3", "Gambit Slot 2", "Infuse", "Bonecrusher", "Remedy Lore 2", "Shades of Black", "Spellbound"],
		[null, null, "Magick Lore 5", "Magick Lore 6", "Mystic Armor 9", "Mystic Armor 7", "Mystic Armor 5", "Mystic Armor 3", "Mystic Armor 2", null, null, "Accessories 4", "Remedy Lore 1", null, "Quickening 2"],
		[null, null, "Magick Lore 9", "Mystic Armor 11", "Mystic Armor 10", "Mystic Armor 8", "Mystic Armor 6", "Mystic Armor 4", "Martyr", "Quickening 1", null, "Accessories 5", "Accessories 6", null, "+350 HP"],
		["+500 HP", "Exodus", "Magick Lore 10", "Mystic Armor 12", null, null, null, null, null, null, null, "Accessories 7", "Accessories 8", null, "Battle Lore 8"],
		[null, null, "Magick Lore 11", "Mystic Armor 13", "Cúchulainn", "Stamp", "Ultima", null, null, "Famfrit", null, "Accessories 9", "Accessories 10"],
		[null, null, "Magick Lore 12", "Genji Armor", null, null, "Ribbon", "Accessories 21", "Accessories 19", "Accessories 17", "Accessories 14", "Accessories 11", "Accessories 13"],
		[null, null, "Zeromus", null, null, null, "Battle Lore 3", "Accessories 22", "Accessories 20", "Accessories 18", "Accessories 16", "Accessories 15", "Accessories 12"],
		[null, "Magick Lore 13", "Magick Lore 15", null, "+435 HP", "Quickening 4", "Battle Lore 2", "Battle Lore 4"],
		[null, null, null, null, null, null, "Battle Lore 5", "Battle Lore 1", "Chaos", "Brawler"],
		[null, null, null, "Heavy Armor 10", "Heavy Armor 9", "Zodiark", "Swiftness 3", "Battle Lore 6"],
		[null, null, null, "Heavy Armor 11"]
	]
}, {
	"name": "Shikari",
	"image": Pisces,
	"text": "Warriors who fight nimbly across hill and dale.",
	"rawBoardData": [
		[null, null, null, "Shades of Black", null, null, null, null, null, null, null, null, null, "Phoenix Lore 1", "Phoenix Lore 2"],
		[null, null, null, "Adrammelech", null, null, null, null, null, null, null, null, null, "Ultima"],
		[null, null, "Gambit Slot 10", "Gambit Slot 8", "Remedy Lore 2", "Gambit Slot 7", null, null, null, null, null, "Light Armor 10", "Daggers 6", "Light Armor 12", "Shikari Nagasa & Mina", "Chaos"],
		[null, "Quickening 2", "Gambit Slot 9", "Swiftness 1", "Gambit Slot 6", "Gambit Slot 5", "Mateus", "Gil Toss", null, "White Magick 12", "Cúchulainn", "Daggers 5", "Light Armor 11", "Shields 7", "Light Armor 13"],
		[null, "Ninja Swords 2", null, "Second Board", "Gambit Slot 4", "Gambit Slot 3", null, null, null, null, null, "Light Armor 9", "Shields 6"],
		[null, null, null, "Belias", "Gambit Slot 2", "Gambit Slot 1", null, null, null, null, null, "Daggers 4", "Light Armor 8", "Exodus", "Stamp"],
		["Ninja Swords 1", null, null, null, "First Aid", "Daggers 1", "Light Armor 2", "Daggers 2", "Shields 2", "Light Armor 5", "Shields 3", "Light Armor 7", "Shields 5"],
		["Quickening 1", "Adrenaline", "Last Stand", "+30 HP", "Martyr", "Essentials", "Light Armor 1", "Light Armor 3", "Light Armor 4", "Daggers 3", "Light Armor 6", "Shields 4", "Shield Block 2", "Accessories 19", "Accessories 22", "Telekinesis"],
		[null, "Spellbound", "+230 HP", "+110 HP", "Libra", "Accessories 1", null, null, null, null, null, "Shield Block 1", "Focus", "Accessories 18", "Accessories 21", "Ribbon"],
		[null, "+310 HP", "Headsman", "+190 HP", "+70 HP", "Accessories 2", "Accessories 3", "Accessories 6", "Accessories 8", "Accessories 10", "Accessories 12", "Accessories 14", "Accessories 16", "Accessories 17", "Accessories 20", "+390 HP"],
		[null, null, "Hashmal", null, "+150 HP", "Accessories 4", "Accessories 5", "Accessories 7", "Accessories 9", "Accessories 11", "Accessories 13", "Accessories 15", "+350 HP"],
		[null, null, "Bonecrusher", null, "Battle Lore 3", "Inquisitor", null, null, null, null, null, "Potion Lore 1", "Traveler", "Famfrit"],
		[null, null, null, null, "Battle Lore 4", "+270 HP", "Zalera", "+435 HP", null, null, "Zeromus", "Potion Lore 2", "Magick Lore 1"],
		[null, null, "Remedy Lore 3", "Battle Lore 1", "Battle Lore 2", "Remedy Lore 1", null, null, null, null, null, "Swiftness 3", "Magick Lore 2", "Magick Lore 4", "Magick Lore 8", "Zodiark"],
		["Ninja Swords 3", "Quickening 3", "Revive", "Swiftness 2", "Battle Lore 5", "Battle Lore 6", null, null, null, null, null, "1000 Needles", "Potion Lore 3", "Magick Lore 3", "Brawler"],
		[null, null, null, "Shemhazai", null, null, null, null, null, null, null, null, null, "Quickening 4"],
		[null, null, "Guns 6", "Guns 5", null, null, null, null, null, null, null, null, null, "Yagyu Darkblade & Mesa"]
	]
}];

export interface Position {
	value: License;
	adjacent: Position[];
}

export interface Board {
	name: string;
	text: string;
	image: string;
	rows: (Position | undefined)[][];
	lookup: Map<License, Position>;
}

function createBoard(raw: typeof rawJobs[0]): Board {
	const ret: Board = {
		name: raw.name,
		text: raw.text,
		image: raw.image,
		rows: raw.rawBoardData.map(row => row.map(v => v ? { value: LicenseByName(v), adjacent: [] } : undefined)),
		lookup: new Map<License, Position>()
	};
	for (let y = 0; y < ret.rows.length; y++) {
		const row = ret.rows[y];
		for (let x = 0; x < row.length; x++) {
			const cell = row[x];
			if (cell) {
				const tryPush = (a: number, b: number) => ret.rows[a] && ret.rows[a][b] && cell.adjacent.push(ret.rows[a][b]!);
				tryPush(y - 1, x);
				tryPush(y + 1, x);
				tryPush(y, x - 1);
				tryPush(y, x + 1);
				ret.lookup.set(cell.value, cell);
			}
		}
	}
	return ret;
}

export const Boards = rawJobs.map(createBoard);
