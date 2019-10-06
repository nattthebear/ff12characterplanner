import * as React from "react";
import PartyModel from "../model/PartyModel";
import { optimizeForCharacter } from "../dps/OptimizeForCharacter";
import { OptimizerResult } from "../dps/Optimize";
import { Characters } from "../data/Characters";
import "./Dps.scss";

export interface Props {
	party: PartyModel;
}

export default class Dps extends React.PureComponent<Props> {
	render() {
		const components = Array.from({ length: 6 })
			.map((_, idx) => {
				const results = optimizeForCharacter({
					character: idx,
					def: 30,
					mdef: 30,
					percentHp: 1,
					fireReaction: 1,
					iceReaction: 1,
					lightningReaction: 1,
					waterReaction: 1,
					windReaction: 1,
					earthReaction: 1,
					darkReaction: 1,
					holyReaction: 1,
					level: 70,
					resistGun: false,
					battleSpeed: 6,
					berserk: true,
					haste: true,
					bravery: true
				}, this.props.party);
				return <SingleCharacterDps key={idx} name={Characters[idx].name} results={results} />;
			});
		return <div className="dps-results">
			<table>
				<tbody>
					{components}
				</tbody>
			</table>	
		</div>;
	}
}

function SingleCharacterDps(props: { name: string, results: OptimizerResult[] }) {
	return <>
		<tr>
			<th colSpan={9999}>{props.name}</th>
		</tr>
		<tr>
			<th className="r">DPS</th>
			<th>Weapon</th>
			<th>Ammo</th>
			<th>Helm</th>
			<th>Armor</th>
			<th>Accessory</th>
		</tr>

		{props.results.slice(0, 5).map((r, i) => <tr key={i}>
			<td className="r">{Math.round(r.dps)}</td>
			<td>{r.doll.weapon.name}</td>
			<td>{r.doll.ammo && r.doll.ammo.name}</td>
			<td>{r.doll.helm && r.doll.helm.name}</td>
			<td>{r.doll.armor && r.doll.armor.name}</td>
			<td>{r.doll.accessory && r.doll.accessory.name}</td>
		</tr>)}
	</>;
}
