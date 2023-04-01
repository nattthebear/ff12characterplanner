import { Star, Aries, Pisces, Capricorn, Gemini, Scorpio, Cancer, Libra, Sagittarius, Leo, Aquarius, Taurus, Virgo, Ophiuchus } from "./Images";

export interface License {
	fullName: string;
	/** cost in LP */
	cost: number;
	/** description of license (sometimes just a list of spells) */
	text: string;
	/** true if license is a mist license and might not be available depending on other choices */
	limited: boolean;
	grants?: {
		group: string;
		what: number | string[];
	};
	/** background image */
	image?: string;
	sortOrder: number;
}

let sortOrder = 0;

const allLicenses = Array<License>();
allLicenses.push({
	fullName: "Essentials",
	cost: 1,
	text: "Attack\nItem",
	limited: false,
	sortOrder: sortOrder++
});
allLicenses.push({
	fullName: "Second Board",
	cost: 30,
	text: "Second Board",
	limited: false,
	sortOrder: sortOrder++
});

{
	let full = "";
	let i = 1;
	const r = (f: string) => {
		full = f;
		i = 1;
	};
	const am = (lp: number, ...spells: string[]) => {
		allLicenses.push({
			fullName: full + " " + i,
			cost: lp,
			text: spells.join("\n"),
			limited: false,
			grants: {
				group: full,
				what: spells
			},
			sortOrder: sortOrder++
		});
		i++;
	};
	r("White Magick");
	am(15, "Cure", "Blindna");
	am(20, "Vox", "Poisona");
	am(25, "Protect", "Shell");
	am(30, "Cura", "Raise");
	am(40, "Dispel", "Stona");
	am(50, "Curaga", "Regen");
	am(60, "Cleanse", "Esuna");
	am(70, "Confuse", "Faith");
	am(80, "Bravery", "Curaja");
	am(90, "Dispelga", "Arise");
	am(100, "Holy", "Esunaga");
	am(110, "Protectga", "Shellga");
	am(155, "Renew");
	r("Black Magick");
	am(15, "Fire", "Thunder");
	am(20, "Blizzard", "Blind");
	am(25, "Aqua", "Silence");
	am(30, "Aero", "Sleep");
	am(40, "Fira", "Poison");
	am(50, "Thundara", "Blizzara");
	am(60, "Bio", "Blindga");
	am(70, "Aeroga", "Silencega");
	am(90, "Firaga", "Thundaga");
	am(90, "Blizzaga", "Sleepga");
	am(100, "Shock", "Toxify");
	am(120, "Scourge", "Flare");
	am(165, "Scathe");
	r("Time Magick");
	am(20, "Slow", "Immobilize");
	am(30, "Reflect", "Disable");
	am(40, "Vanish", "Balance");
	am(50, "Gravity", "Haste");
	am(60, "Stop", "Bleed");
	am(70, "Break", "Doom");
	am(80, "Float", "Berserk");
	am(90, "Vanishga", "Warp");
	am(100, "Reflectga", "Slowga");
	am(125, "Graviga", "Hastega");
	r("Green Magick");
	am(40, "Decoy", "Oil");
	am(50, "Drain", "Reverse");
	am(90, "Bubble", "Syphon");
	r("Arcane Magick");
	am(40, "Dark", "Darkra");
	am(50, "Death", "Darkga");
	am(110, "Ardor");
}
{
	const t = (lp: number, name: string, desc: string) => {
		allLicenses.push({
			fullName: name,
			cost: lp,
			text: desc,
			limited: false,
			grants: {
				group: "Technicks",
				what: [name]
			},
			sortOrder: sortOrder++
		});
	};
	t(35, "1000 Needles", "Deal 1,000 damage to one foe.");
	t(40, "Achilles", "Render one foe vulnerable to an additional element.");
	t(30, "Bonecrusher", "Consume HP to reduce the HP of one foe to 0.");
	t(50, "Wither", "Lower one foe's strength.");
	t(50, "Expose", "Lower one foe's defense.");
	t(50, "Shear", "Lower one foe's magick resist.");
	t(50, "Addle", "Lower one foe's magick power.");
	t(30, "Charge", "Restore user's MP. If the technick fails, MP is reduced to 0.");
	t(30, "Charm", "Cause one foe to confuse friend with foe.");
	t(35, "Souleater", "Consume HP to deal damage to one foe.");
	t(20, "First Aid", "Restore HP to one HP Critical ally.");
	t(30, "Gil Toss", "Throw gil, damaging all foes in range.");
	t(50, "Horology", "Deal damage based on a factor of time to all foes in range.");
	t(25, "Libra", "Reveal more detailed target information.");
	t(30, "Infuse", "Fully consume user's MP, changing one ally's HP to 10 times that amount.");
	t(40, "Numerology", "Deal damage that increases with successive hits.");
	t(30, "Poach", "Capture HP Critical foes to obtain loot.");
	t(70, "Shades of Black", "Cast a random black magick on one foe.");
	t(40, "Revive", "Fully consume user's HP, reviving and fully restoring HP of one KO'd ally.");
	t(40, "Sight Unseeing", "Unleash an attack only available when blind.");
	t(40, "Stamp", "Inflict one foe with any status effects on the user.");
	t(20, "Steal", "Steal from one foe.");
	t(50, "Traveler", "Deal damage based on total steps taken to all foes in range.");
	t(80, "Telekinesis", "Deal ranged damage with melee weapons.");
}
{
	const s = (name: string, desc: string, ...lps: number[]) => {
		let i = 1;
		for (const lp of lps) {
			allLicenses.push({
				fullName: name + " " + i,
				cost: lp,
				text: desc,
				limited: false,
				grants: {
					group: name,
					what: 1
				},
				sortOrder: sortOrder++
			});
			i++;
		}
	};
	s("Battle Lore", "Increase physical attack damage.",
		30, 30, 30, 30, 50, 50, 50, 50, 70, 70, 70, 70, 100, 100, 100, 100);
	s("Magick Lore", "Increase Magick potency.",
		30, 30, 30, 30, 50, 50, 50, 50, 70, 70, 70, 70, 100, 100, 100, 100);
	s("Gambit Slot", "Adds an additional gambit slot",
		15, 20, 25, 30, 35, 40, 45, 50, 70, 100);
}
{
	const h = (hp: number, lp: number) => {
		allLicenses.push({
			fullName: `+${hp} HP`,
			cost: lp,
			text: `Increase max HP by ${hp}.`,
			limited: false,
			grants: {
				group: "HP",
				what: hp
			},
			sortOrder: sortOrder++
		});
	};
	h(30, 20);
	h(70, 30);
	h(110, 40);
	h(150, 50);
	h(190, 60);
	h(230, 70);
	h(270, 80);
	h(310, 90);
	h(350, 100);
	h(390, 115);
	h(435, 130);
	h(500, 220);
}
{
	let i = 1;
	for (const lp of [50, 75, 100, 125]) {
		allLicenses.push({
			fullName: "Quickening " + i,
			cost: lp,
			text: "Unleash a devastating attack.",
			limited: true,
			grants: {
				group: "Quickening",
				what: 1
			},
			image: Star,
			sortOrder: sortOrder++
		});
		i++;
	}
}
{
	const e = (lp: number, fullName: string, title: string, image: string) => {
		allLicenses.push({
			fullName,
			cost: lp,
			text: `Summon ${fullName} ${title}`,
			limited: true,
			grants: {
				group: "Esper",
				what: [fullName]
			},
			image,
			sortOrder: sortOrder++
		});
	};
	e(20, "Belias", "the Gigas", Aries);
	e(30, "Mateus", "the Corrupt", Pisces);
	e(35, "Adrammelech", "the Wroth", Capricorn);
	e(30, "Zalera", "the Death Seraph", Gemini);
	e(50, "Cúchulainn", "the Impure", Scorpio);
	e(65, "Zeromus", "The Condemner", Cancer);
	e(65, "Exodus", "the Judge-Sal", Libra);
	e(50, "Shemhazai", "the Whisperer", Sagittarius);
	e(50, "Hashmal", "Bringer of Order", Leo);
	e(100, "Famfrit", "the Darkening Cloud", Aquarius);
	e(100, "Chaos", "Walker of the Wheel", Taurus);
	e(115, "Ultima", "High Seraph", Virgo);
	e(200, "Zodiark", "Keeper of Precepts", Ophiuchus);
}
{
	const p = (lp: number, fullName: string, desc: string) => {
		allLicenses.push({
			fullName,
			cost: lp,
			text: desc,
			limited: false,
			grants: {
				group: "Passive",
				what: [fullName]
			},
			sortOrder: sortOrder++
		});
	};
	p(70, "Focus", "Increases strength when HP is full.");
	p(70, "Serenity", "Increases magick when HP is full.");
	p(65, "Adrenaline", "Increases strength when HP Critical.");
	p(65, "Spellbreaker", "Increases magick power when HP Critical.");
	p(70, "Last Stand", "Increases defense when HP Critical.");
	p(90, "Brawler", "Increases attack power when fighting empty-handed.");
	p(25, "Shield Block 1", "Increases chance to block with a shield.");
	p(45, "Shield Block 2", "Increases chance to block with a shield.");
	p(75, "Shield Block 3", "Increases chance to block with a shield.");
	p(30, "Inquisitor", "Gain MP after dealing damage.");
	p(30, "Warmage", "Gain MP after dealing magick damage.");
	p(30, "Headsman", "Gain MP after defeating a foe.");
	p(30, "Martyr", "Gain MP after taking damage.");
	p(30, "Swiftness 1", "Reduces action time by 10%.");
	p(50, "Swiftness 2", "Reduces action time by 10%.");
	p(80, "Swiftness 3", "Reduces action time by 10%.");
	p(30, "Channeling 1", "Reduces MP cost of Spells");
	p(50, "Channeling 2", "Reduces MP cost of Spells");
	p(80, "Channeling 3", "Reduces MP cost of Spells");
	p(30, "Spellbound", "Increases duration of status effects.");
	p(20, "Potion Lore 1", "Potions restore more HP.");
	p(35, "Potion Lore 2", "Potions restore more HP.");
	p(70, "Potion Lore 3", "Potions restore more HP.");
	p(20, "Ether Lore 1", "Ethers restore more MP.");
	p(35, "Ether Lore 2", "Ethers restore more MP.");
	p(70, "Ether Lore 3", "Ethers restore more MP.");
	p(20, "Remedy Lore 1", "Sleep, Sap, Immobilize, and Disable");
	p(30, "Remedy Lore 2", "Petrify, Confuse, and Oil");
	p(70, "Remedy Lore 3", "Stop, Doom, and Disease.");
	p(30, "Phoenix Lore 1", "Phoenix Down restores more HP.");
	p(50, "Phoenix Lore 2", "Phoenix Down restores more HP.");
	p(90, "Phoenix Lore 3", "Phoenix Down restores more HP.");
}
{
	const eq = (lp: number, category: string, fullName: string, ...grants: string[]) => {
		allLicenses.push({
			fullName,
			cost: lp,
			text: grants.join("\n"),
			limited: false,
			grants: {
				group: category,
				what: grants
			},
			sortOrder: sortOrder++
		});
	};
	eq(5, "Accessories", "Accessories 1", "Orrachea Armlet");
	eq(20, "Accessories", "Accessories 2", "Bangle", "Firefly");
	eq(25, "Accessories", "Accessories 3", "Diamond Armlet", "Argyle Armlet");
	eq(35, "Accessories", "Accessories 4", "Battle Harness", "Steel Gorget");
	eq(35, "Accessories", "Accessories 5", "Tourmaline Ring", "Embroidered Tippet");
	eq(35, "Accessories", "Accessories 6", "Golden Amulet", "Leather Gorget");
	eq(40, "Accessories", "Accessories 7", "Rose Corsage", "Turtleshell Choker");
	eq(45, "Accessories", "Accessories 8", "Thief's Cuffs", "Gauntlets");
	eq(30, "Accessories", "Accessories 9", "Amber Armlet", "Black Belt");
	eq(40, "Accessories", "Accessories 10", "Jade Collar", "Nishijin Belt");
	eq(45, "Accessories", "Accessories 11", "Pheasant Netsuke", "Blazer Gloves");
	eq(60, "Accessories", "Accessories 12", "Gillie Boots", "Steel Poleyns");
	eq(60, "Accessories", "Accessories 13", "Berserker Bracers", "Magick Gloves");
	eq(70, "Accessories", "Accessories 14", "Sage's Ring", "Agate Ring");
	eq(70, "Accessories", "Accessories 15", "Ruby Ring", "Bowline Sash");
	eq(70, "Accessories", "Accessories 16", "Cameo Belt", "Cat-ear Hood");
	eq(80, "Accessories", "Accessories 17", "Bubble Belt", "Fuzzy Miter");
	eq(80, "Accessories", "Accessories 18", "Sash", "Power Armlet");
	eq(100, "Accessories", "Accessories 19", "Indigo Pendant", "Winged Boots");
	eq(115, "Accessories", "Accessories 20", "Opal Ring", "Hermes Sandals");
	eq(130, "Accessories", "Accessories 21", "Quasimodo Boots", "Nihopalaoa");
	eq(160, "Accessories", "Accessories 22", "Germinas Boots", "Ring of Renewal");
	eq(215, "Accessories", "Ribbon", "Ribbon");
	eq(15, "Shields", "Shields 1", "Leather Shield", "Buckler");
	eq(20, "Shields", "Shields 2", "Bronze Shield", "Round Shield");
	eq(25, "Shields", "Shields 3", "Golden Shield", "Ice Shield", "Flame Shield");
	eq(30, "Shields", "Shields 4", "Diamond Shield", "Platinum Shield", "Dragon Shield");
	eq(35, "Shields", "Shields 5", "Crystal Shield", "Kaiser Shield");
	eq(40, "Shields", "Shields 6", "Aegis Shield", "Demon Shield");
	eq(65, "Shields", "Shields 7", "Venetian Shield");
	eq(90, "Shields", "Shell Shield", "Shell Shield");
	eq(100, "Shields", "Ensanguined Shield", "Ensanguined Shield");
	eq(235, "Shields", "Zodiac Escutcheon", "Zodiac Escutcheon");
	eq(10, "Light Armor", "Light Armor 1", "Leather Cap", "Leather Clothing");
	eq(15, "Light Armor", "Light Armor 2", "Headgear", "Headguard", "Chromed Leathers", "Leather Breastplate");
	eq(20, "Light Armor", "Light Armor 3", "Leather Headgear", "Horned Hat", "Bronze Chestplate", "Ringmail");
	eq(25, "Light Armor", "Light Armor 4", "Balaclava", "Soldier's Cap", "Windbreaker", "Heavy Coat");
	eq(30, "Light Armor", "Light Armor 5", "Green Beret", "Red Cap", "Survival Vest", "Brigandine");
	eq(40, "Light Armor", "Light Armor 6", "Headband", "Pirate Hat", "Jujitsu Gi", "Viking Coat");
	eq(50, "Light Armor", "Light Armor 7", "Goggle Mask", "Adamant Hat", "Metal Jerkin", "Adamant Vest");
	eq(60, "Light Armor", "Light Armor 8", "Officer's Hat", "Chakra Band", "Barrel Coat", "Power Vest");
	eq(70, "Light Armor", "Light Armor 9", "Thief's Cap", "Gigas Hat", "Ninja Gear", "Gigas Chestplate");
	eq(75, "Light Armor", "Light Armor 10", "Chaperon", "Minerva Bustier");
	eq(80, "Light Armor", "Light Armor 11", "Crown of Laurels", "Rubber Suit");
	eq(90, "Light Armor", "Light Armor 12", "Renewing Morion", "Mirage Vest");
	eq(110, "Light Armor", "Light Armor 13", "Dueling Mask", "Brave Suit");
	eq(25, "Heavy Armor", "Heavy Armor 1", "Leather Helm", "Bronze Helm", "Leather Armor", "Bronze Armor");
	eq(30, "Heavy Armor", "Heavy Armor 2", "Sallet", "Iron Helm", "Scale Armor", "Iron Armor");
	eq(35, "Heavy Armor", "Heavy Armor 3", "Barbut", "Winged Helm", "Linen Cuirass", "Chainmail");
	eq(40, "Heavy Armor", "Heavy Armor 4", "Golden Helm", "Burgonet", "Golden Armor", "Shielded Armor");
	eq(50, "Heavy Armor", "Heavy Armor 5", "Close Helmet", "Bone Helm", "Demon Mail", "Bone Mail");
	eq(55, "Heavy Armor", "Heavy Armor 6", "Diamond Helm", "Diamond Armor");
	eq(60, "Heavy Armor", "Heavy Armor 7", "Steel Mask", "Mirror Mail");
	eq(65, "Heavy Armor", "Heavy Armor 8", "Platinum Helm", "Platinum Armor");
	eq(70, "Heavy Armor", "Heavy Armor 9", "Giant's Helmet", "Carabineer Mail");
	eq(80, "Heavy Armor", "Heavy Armor 10", "Dragon Helm", "Dragon Mail");
	eq(90, "Heavy Armor", "Heavy Armor 11", "Magepower Shishak", "Maximillian");
	eq(110, "Heavy Armor", "Heavy Armor 12", "Grand Helm", "Grand Armor");
	eq(10, "Mystic Armor", "Mystic Armor 1", "Cotton Cap", "Magick Curch", "Cotton Shirt", "Light Woven Shirt");
	eq(15, "Mystic Armor", "Mystic Armor 2", "Pointy Hat", "Topkapi Hat", "Silken Shirt", "Kilimweave Shirt");
	eq(20, "Mystic Armor", "Mystic Armor 3", "Calot Hat", "Wizard's Hat", "Shepherd's Bolero", "Wizard's Robes");
	eq(25, "Mystic Armor", "Mystic Armor 4", "Lambent Hat", "Feathered Cap", "Chanter's Djellaba", "Traveler's Vestment");
	eq(30, "Mystic Armor", "Mystic Armor 5", "Mage's Hat", "Lamia's Tiara", "Mage's Habit", "Enchanter's Habit");
	eq(40, "Mystic Armor", "Mystic Armor 6", "Sorcerer's Hat", "Black Cowl", "Sorcerer's Habit", "Black Garb");
	eq(50, "Mystic Armor", "Mystic Armor 7", "Astrakhan Hat", "Gaia Hat", "Carmagnole", "Maduin Gear");
	eq(60, "Mystic Armor", "Mystic Armor 8", "Hypnocrown", "Gold Hairpin", "Jade Gown", "Gaia Gear");
	eq(70, "Mystic Armor", "Mystic Armor 9", "Celebrant's Miter", "Cleric's Robes");
	eq(75, "Mystic Armor", "Mystic Armor 10", "Black Mask", "Black Robes");
	eq(80, "Mystic Armor", "Mystic Armor 11", "White Mask", "White Robes");
	eq(90, "Mystic Armor", "Mystic Armor 12", "Golden Skullcap", "Glimmering Robes");
	eq(110, "Mystic Armor", "Mystic Armor 13", "Circlet", "Lordly Robes");
	eq(190, "Genji Armor", "Genji Armor", "Genji Shield", "Genji Helm", "Genji Armor", "Genji Gloves");
	eq(15, "Swords", "Swords 1", "Broadsword");
	eq(25, "Swords", "Swords 2", "Longsword", "Iron Sword");
	eq(35, "Swords", "Swords 3", "Zwill Blade", "Ancient Sword");
	eq(50, "Swords", "Swords 4", "Lohengrin", "Flametongue");
	eq(55, "Swords", "Swords 5", "Demonsbane", "Icebrand");
	eq(60, "Swords", "Swords 6", "Platinum Sword", "Bastard Sword");
	eq(70, "Swords", "Swords 7", "Diamond Sword", "Runeblade");
	eq(80, "Swords", "Swords 8", "Deathbringer", "Stoneblade");
	eq(90, "Swords", "Swords 9", "Durandal", "Simha");
	eq(50, "Swords", "Blood Sword", "Blood Sword");
	eq(80, "Swords", "Karkata", "Karkata");
	eq(20, "Bows", "Bows 1", "Shortbow");
	eq(30, "Bows", "Bows 2", "Silver Bow", "Aevis Killer");
	eq(35, "Bows", "Bows 3", "Longbow", "Killer Bow");
	eq(45, "Bows", "Bows 4", "Elfin Bow", "Loxley Bow");
	eq(60, "Bows", "Bows 5", "Giant Stonebow", "Burning Bow");
	eq(70, "Bows", "Bows 6", "Traitor's Bow", "Yoichi Bow");
	eq(90, "Bows", "Bows 7", "Perseus Bow", "Artemis Bow");
	eq(130, "Bows", "Sagittarius", "Sagittarius");
	eq(200, "Bows", "Dhanusha", "Dhanusha");
	eq(20, "Spears", "Spears 1", "Javelin", "Spear");
	eq(25, "Spears", "Spears 2", "Partisan", "Heavy Lance");
	eq(35, "Spears", "Spears 3", "Storm Spear", "Obelisk");
	eq(60, "Spears", "Spears 4", "Halberd", "Trident");
	eq(40, "Spears", "Spears 5", "Holy Lance", "Gungnir");
	eq(70, "Spears", "Dragon Whisker", "Dragon Whisker");
	eq(100, "Spears", "Vrsabha", "Vrsabha");
	eq(240, "Spears", "Zodiac Spear", "Zodiac Spear");
	eq(20, "Axes & Hammers", "Axes & Hammers 1", "Handaxe");
	eq(25, "Axes & Hammers", "Axes & Hammers 2", "Iron Hammer", "Broadaxe");
	eq(35, "Axes & Hammers", "Axes & Hammers 3", "War Hammer", "Slasher");
	eq(50, "Axes & Hammers", "Axes & Hammers 4", "Sledgehammer", "Hammerhead");
	eq(60, "Axes & Hammers", "Axes & Hammers 5", "Francisca", "Morning Star");
	eq(65, "Axes & Hammers", "Axes & Hammers 6", "Greataxe", "Golden Axe");
	eq(85, "Axes & Hammers", "Axes & Hammers 7", "Scorpion Tail");
	eq(175, "Axes & Hammers", "Vrscika", "Vrscika");
	eq(35, "Katana", "Katana 1", "Kotetsu", "Osafune");
	eq(50, "Katana", "Katana 2", "Kogarasumaru", "Magoroku");
	eq(70, "Katana", "Katana 3", "Murasame", "Kiku-ichimonji");
	eq(90, "Katana", "Katana 4", "Yakei", "Ame-no-Murakumo");
	eq(100, "Katana", "Katana 5", "Muramasa");
	eq(130, "Katana", "Masamune", "Masamune");
	eq(200, "Katana", "Kumbha", "Kumbha");
	eq(50, "Greatswords", "Greatswords 1", "Claymore");
	eq(70, "Greatswords", "Greatswords 2", "Defender", "Save the Queen");
	eq(80, "Greatswords", "Greatswords 3", "Ultima Blade");
	eq(100, "Greatswords", "Greatswords 4", "Ragnarok");
	eq(135, "Greatswords", "Excalibur", "Excalibur");
	eq(150, "Greatswords", "Excalipur", "Excalipur");
	eq(225, "Greatswords", "Tournesol", "Tournesol");
	eq(20, "Rods", "Rods 1", "Rod", "Serpent Rod");
	eq(30, "Rods", "Rods 2", "Healing Rod", "Gaia Rod");
	eq(40, "Rods", "Rods 3", "Power Rod", "Empyrean Rod");
	eq(50, "Rods", "Rods 4", "Holy Rod");
	eq(130, "Rods", "Rod of Faith", "Rod of Faith");
	eq(15, "Staves", "Staves 1", "Oak Staff");
	eq(25, "Staves", "Staves 2", "Cherry Staff", "Wizard's Staff");
	eq(30, "Staves", "Staves 3", "Flame Staff", "Storm Staff");
	eq(40, "Staves", "Staves 4", "Glacial Staff", "Golden Staff");
	eq(65, "Staves", "Staves 5", "Judicer's Staff", "Cloud Staff");
	eq(115, "Staves", "Staff of the Magi", "Staff of the Magi");
	eq(30, "Maces", "Maces 1", "Mace", "Bronze Mace");
	eq(40, "Maces", "Maces 2", "Bhuj", "Miter");
	eq(60, "Maces", "Maces 3", "Thorned Mace", "Chaos Mace");
	eq(65, "Maces", "Maces 4", "Doom Mace", "Zeus Mace");
	eq(50, "Maces", "Maces 5", "Grand Mace", "Bone of Byblos");
	eq(40, "Measures", "Measures 1", "Gilt Measure");
	eq(50, "Measures", "Measures 2", "Arc Scale", "Multiscale");
	eq(70, "Measures", "Measures 3", "Cross Scale", "Caliper");
	eq(100, "Measures", "Measures 4", "Euclid's Sextant");
	eq(15, "Daggers", "Daggers 1", "Dagger");
	eq(20, "Daggers", "Daggers 2", "Mage Masher", "Assassin's Dagger");
	eq(35, "Daggers", "Daggers 3", "Chopper", "Main Gauche");
	eq(45, "Daggers", "Daggers 4", "Gladius", "Avenger");
	eq(60, "Daggers", "Daggers 5", "Orichalcum Dirk", "Platinum Dagger");
	eq(80, "Daggers", "Daggers 6", "Zwill Crossblade");
	eq(220, "Daggers", "Shikari Nagasa & Mina", "Shikari Nagasa", "Mina");
	eq(30, "Guns", "Guns 1", "Altair");
	eq(50, "Guns", "Guns 2", "Capella", "Vega");
	eq(60, "Guns", "Guns 3", "Sirius", "Betelgeuse");
	eq(70, "Guns", "Guns 4", "Ras Algethi", "Aldebaran");
	eq(90, "Guns", "Guns 5", "Spica", "Antares");
	eq(100, "Guns", "Guns 6", "Arcturus", "Fomalhaut");
	eq(190, "Guns", "Mithuna", "Mithuna");
	eq(20, "Poles", "Poles 1", "Oaken Pole");
	eq(30, "Poles", "Poles 2", "Battle Bamboo", "Cypress Pole");
	eq(35, "Poles", "Poles 3", "Musk Stick", "Iron Pole");
	eq(40, "Poles", "Poles 4", "Six-fluted Pole", "Gokuu Pole");
	eq(50, "Poles", "Poles 5", "Zephyr Pole", "Ivory Pole");
	eq(60, "Poles", "Poles 6", "Sweep", "Eight-fluted Pole");
	eq(90, "Poles", "Whale Whisker", "Whale Whisker");
	eq(180, "Poles", "Kanya", "Kanya");
	eq(25, "Crossbows", "Crossbows 1", "Bowgun", "Crossbow");
	eq(40, "Crossbows", "Crossbows 2", "Paramina Crossbow", "Recurve Crossbow");
	eq(60, "Crossbows", "Crossbows 3", "Hunting Crossbow", "Penetrator Crossbow");
	eq(115, "Crossbows", "Crossbows 4", "Gastrophetes", "Tula");
	eq(35, "Hand-bombs", "Hand-bombs 1", "Hornito");
	eq(55, "Hand-bombs", "Hand-bombs 2", "Fumarole", "Tumulus");
	eq(75, "Hand-bombs", "Hand-bombs 3", "Caldera", "Volcano");
	eq(105, "Hand-bombs", "Hand-bombs 4", "Makara");
	eq(100, "Ninja Swords", "Ninja Swords 1", "Ashura", "Sakura-saezuri", "Kagenui", "Orochi");
	eq(120, "Ninja Swords", "Ninja Swords 2", "Iga Blade");
	eq(120, "Ninja Swords", "Ninja Swords 3", "Koga Blade");
	eq(180, "Ninja Swords", "Yagyu Darkblade & Mesa", "Yagyu Darkblade", "Mesa");
}

const allLicensesByName = new Map<string, License>();
for (const l of allLicenses) {
	if (allLicensesByName.has(l.fullName)) {
		throw new Error("Duplicate license name " + l.fullName);
	}
	allLicensesByName.set(l.fullName, l);
}

export { allLicenses as Licenses };
export function LicenseByName(name: string) {
	const ret = allLicensesByName.get(name);
	if (!ret) {
		throw new Error("Internal error: Unknown license " + name);
	}
	return ret;
}

export interface LicenseGroup {
	name: string;
	contents: License[];
}

const byGroup = Array<LicenseGroup>();
{
	let curr: LicenseGroup | undefined;
	for (const l of allLicenses) {
		if (!l.grants) {
			continue;
		}
		if (!curr || curr.name !== l.grants.group) {
			curr = {
				name: l.grants.group,
				contents: []
			};
			byGroup.push(curr);
		}
		curr.contents.push(l);
	}
}
export { byGroup as LicenseGroups };

// quickenings and espers can have special logic, so provide them seperately
export const Quickenings = byGroup.find(g => g.name === "Quickening")!.contents;
export const Espers = byGroup.find(g => g.name === "Esper")!.contents;
