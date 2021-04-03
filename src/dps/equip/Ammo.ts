import { Ammo, buildEquipments }  from "../Profile";

const Ammos = buildEquipments<Ammo>([
	{
		name: "Onion Arrows",
		type: "bow",
		attack: 1
	},
	{
		name: "Parallel Arrows",
		type: "bow",
		attack: 2
	},
	{
		name: "Fiery Arrows",
		type: "bow",
		attack: 1,
		fireDamage: true
	},
	{
		name: "Bamboo Arrows",
		type: "bow",
		attack: 2
	},
	{
		name: "Lightning Arrows",
		type: "bow",
		attack: 2,
		lightningDamage: true
	},
	{
		name: "Assassin's Arrows",
		type: "bow",
		attack: 3
	},
	{
		name: "Icecloud Arrows",
		type: "bow",
		attack: 4,
		iceDamage: true
	},
	{
		name: "Artemis Arrows",
		type: "bow",
		attack: 5,
		earthDamage: true
	},
	{
		name: "Onion Bolts",
		type: "xbow",
		attack: 1
	},
	{
		name: "Long Bolts",
		type: "xbow",
		attack: 1
	},
	{
		name: "Stone Bolts",
		type: "xbow",
		attack: 1
	},
	{
		name: "Lead Bolts",
		type: "xbow",
		attack: 2
	},
	{
		name: "Black Bolts",
		type: "xbow",
		attack: 2
	},
	{
		name: "Time Bolts",
		type: "xbow",
		attack: 2
	},
	{
		name: "Sapping Bolts",
		type: "xbow",
		attack: 3
	},
	{
		name: "Grand Bolts",
		type: "xbow",
		attack: 4
	},
	{
		name: "Onion Shot",
		type: "gun",
		attack: 1
	},
	{
		name: "Silent Shot",
		type: "gun",
		attack: 1
	},
	{
		name: "Aqua Shot",
		type: "gun",
		attack: 3,
		waterDamage: true
	},
	{
		name: "Wyrmfire Shot",
		type: "gun",
		attack: 3,
		fireDamage: true
	},
	{
		name: "Mud Shot",
		type: "gun",
		attack: 2,
		earthDamage: true
	},
	{
		name: "Windslicer Shot",
		type: "gun",
		attack: 4,
		windDamage: true
	},
	{
		name: "Dark Shot",
		type: "gun",
		attack: 4,
		darkDamage: true
	},
	{
		name: "Stone Shot",
		type: "gun",
		attack: 3
	},
	{
		name: "Onion Bombs",
		type: "handbomb",
		attack: 1
	},
	{
		name: "Poison Bombs",
		type: "handbomb",
		attack: 2
	},
	{
		name: "Stun Bombs",
		type: "handbomb",
		attack: 2
	},
	{
		name: "Oil Bombs",
		type: "handbomb",
		attack: 3
	},
	{
		name: "Chaos Bombs",
		type: "handbomb",
		attack: 4
	},
	{
		name: "Stink Bombs",
		type: "handbomb",
		attack: 2
	},
	{
		name: "Water Bombs",
		type: "handbomb",
		attack: 5,
		waterDamage: true
	},
	{
		name: "Castellanos",
		type: "handbomb",
		attack: 6
	},
]);

export default Ammos;
