import { Profile, Environment } from "./Profile";
import Ammo from "./equip/Ammo";

/** Given a profile where the weapon has already been chosen, and an environment, choose the optimal ammo */
export function chooseAmmo(p: Profile, e: Environment) {
	const name = chooseAmmoName(p, e);
	if (name) {
		const ammo = ammoByName.get(name);
		if (!ammo) {
			throw new Error(`Internal: Bad ammo name ${name}`);
		}
		return ammo;
	} else {
		return undefined;
	}
}

const ammoByName = new Map(Ammo.map(a => [a.name, a]));

function chooseAmmoName(p: Profile, e: Environment) {
	// Assume that the combined elemental coefficient always wins over raw ATT value when choosing an ammo
	// The only time this wouldn't be true is with unrealistically high def

	// The only elementBonus that has an ammo type that interacts with it and is not on the weapon slot is Dark Shot.
	// Since Dark Shot equals the max ATT of any Shot, we have enough information here to decide the best ammo unambiguously
	// If dark shot had a lower ATT than other shots, then we'd need to know whether the Black Robes were available

	switch (p.animationType) {
		case "bow":
			if (e.earthReaction === 2) {
				return "Artemis Arrows";
			} else if (e.iceReaction === 2) {
				return "Icecloud Arrows";
			} else if (e.lightningReaction === 2) {
				return "Lightning Arrows";
			} else if (e.fireReaction === 2) {
				return "Fiery Arrows";
			} else if (e.fireReaction === 1 && p.fireBonus) {
				return "Fiery Arrows";
			} else if (e.earthReaction === 1) {
				return "Artemis Arrows";
			} else if (e.iceReaction === 1) {
				return "Icecloud Arrows";
			} else {
				return "Assassin's Arrows";
			}
		case "xbow":
			return "Grand Bolts";
		case "gun":
			if (e.darkReaction === 2) {
				// prioritize dark shot for potential 3x overall from black robes
				return "Dark Shot";
			} else if (e.windReaction === 2) {
				return "Windslicer Shot";
			} else if (e.waterReaction === 2) {
				return "Aqua Shot";
			} else if (e.fireReaction === 2) {
				return "Wyrmfire Shot";
			} else if (e.earthReaction === 2) {
				return "Mud Shot";
			} else if (e.darkReaction === 1) {
				// prioritize dark shot for potential 1.5 from black robes
				return "Dark Shot";
			} else if (e.windReaction === 1) {
				return "Windslicer Shot";
			} else {
				return "Stone Shot";
			}
		case "handbomb":
			if (e.waterReaction === 2 || e.waterReaction === 1 && p.waterBonus) {
				return "Water Bombs";
			} else {
				return "Castellanos";
			}
		default:
			// other weapon types can't use ammo
			return undefined;
	}
	/*const possibleAmmo = Ammo
		.filter(a => a.type === p.animationType)
		.sort((a, b) => b.attack! - a.attack!);
	
	const elementCoefficients = AllElements
		.map(elt => ({
			element: elt,
			coeff: p.elementDamgage[elt] ? ((p.elementBonus[elt] ? 1.5 : 1) * e.elementReaction[elt]) : 1
		}))
		.sort((a, b) => b.coeff - a.coeff);*/
}
