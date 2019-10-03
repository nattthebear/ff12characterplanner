import { Equipment, AnimationClass }  from "../Profile";

export interface Ammo extends Equipment {
	type: AnimationClass;
}

const Ammo: Ammo[] = [
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
		elementDamgage: { fire: true }
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
		elementDamgage: { lightning: true }
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
		elementDamgage: { ice: true }
	},
	{
		name: "Artemis Arrows",
		type: "bow",
		attack: 5,
		elementDamgage: { earth: true }
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
		elementDamgage: { water: true }
	},
	{
		name: "Wyrmfire Shot",
		type: "gun",
		attack: 3,
		elementDamgage: { fire: true }
	},
	{
		name: "Mud Shot",
		type: "gun",
		attack: 2,
		elementDamgage: { earth: true }
	},
	{
		name: "Windslicer Shot",
		type: "gun",
		attack: 4,
		elementDamgage: { wind: true }
	},
	{
		name: "Dark Shot",
		type: "gun",
		attack: 4,
		elementDamgage: { dark: true }
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
		attack: 5
	},
	{
		name: " Castellanos",
		type: "handbomb",
		attack: 6
	},
];

export default Ammo;
