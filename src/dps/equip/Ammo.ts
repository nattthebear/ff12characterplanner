import { buildEquipments } from "./Equipment";

const Ammos = buildEquipments([
	{
		name: "Onion Arrows",
		animationType: "bow",
		attack: 1
	},
	{
		name: "Parallel Arrows",
		animationType: "bow",
		attack: 2
	},
	{
		name: "Fiery Arrows",
		animationType: "bow",
		attack: 1,
		fireDamage: true
	},
	{
		name: "Bamboo Arrows",
		animationType: "bow",
		attack: 2
	},
	{
		name: "Lightning Arrows",
		animationType: "bow",
		attack: 2,
		lightningDamage: true
	},
	{
		name: "Assassin's Arrows",
		animationType: "bow",
		attack: 3
	},
	{
		name: "Icecloud Arrows",
		animationType: "bow",
		attack: 4,
		iceDamage: true
	},
	{
		name: "Artemis Arrows",
		animationType: "bow",
		attack: 5,
		earthDamage: true
	},
	{
		name: "Onion Bolts",
		animationType: "xbow",
		attack: 1
	},
	{
		name: "Long Bolts",
		animationType: "xbow",
		attack: 1
	},
	{
		name: "Stone Bolts",
		animationType: "xbow",
		attack: 1
	},
	{
		name: "Lead Bolts",
		animationType: "xbow",
		attack: 2
	},
	{
		name: "Black Bolts",
		animationType: "xbow",
		attack: 2
	},
	{
		name: "Time Bolts",
		animationType: "xbow",
		attack: 2
	},
	{
		name: "Sapping Bolts",
		animationType: "xbow",
		attack: 3
	},
	{
		name: "Grand Bolts",
		animationType: "xbow",
		attack: 4
	},
	{
		name: "Onion Shot",
		animationType: "gun",
		attack: 1
	},
	{
		name: "Silent Shot",
		animationType: "gun",
		attack: 1
	},
	{
		name: "Aqua Shot",
		animationType: "gun",
		attack: 3,
		waterDamage: true
	},
	{
		name: "Wyrmfire Shot",
		animationType: "gun",
		attack: 3,
		fireDamage: true
	},
	{
		name: "Mud Shot",
		animationType: "gun",
		attack: 2,
		earthDamage: true
	},
	{
		name: "Windslicer Shot",
		animationType: "gun",
		attack: 4,
		windDamage: true
	},
	{
		name: "Dark Shot",
		animationType: "gun",
		attack: 4,
		darkDamage: true
	},
	{
		name: "Stone Shot",
		animationType: "gun",
		attack: 3
	},
	{
		name: "Onion Bombs",
		animationType: "handbomb",
		attack: 1
	},
	{
		name: "Poison Bombs",
		animationType: "handbomb",
		attack: 2
	},
	{
		name: "Stun Bombs",
		animationType: "handbomb",
		attack: 2
	},
	{
		name: "Oil Bombs",
		animationType: "handbomb",
		attack: 3
	},
	{
		name: "Chaos Bombs",
		animationType: "handbomb",
		attack: 4
	},
	{
		name: "Stink Bombs",
		animationType: "handbomb",
		attack: 2
	},
	{
		name: "Water Bombs",
		animationType: "handbomb",
		attack: 5,
		waterDamage: true
	},
	{
		name: "Castellanos",
		animationType: "handbomb",
		attack: 6
	},
], true);

export default Ammos;
