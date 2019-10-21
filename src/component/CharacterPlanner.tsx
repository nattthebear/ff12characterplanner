import * as React from "react";
import CharacterPanel from "./CharacterPanel";
import LicenseBoard from "./LicenseBoard";
import "./CharacterPlanner.scss";
import PartyModel from "../model/PartyModel";
import QeBoard from "./QeBoard";
import autobind from "autobind-decorator";
import Dps from "./Dps";
import { Environment } from "../dps/Profile";

export interface Props {
	party: PartyModel;
	changeParty(newParty: PartyModel): void;
	characterIndex: number;
	boardIndex: number;
	changeIndices(characterIndex: number, boardIndex: number): void;
	qeActive: boolean;
	toggleQe(): void;
	dpsActive: boolean;
	toggleDps(): void;
}

export interface State {
	/** Future party change.  Set by LicenseBoard in job select mode only, and used in CharacterPanel display */
	plannedParty?: PartyModel;
	/** The environment used by the dps engine */
	env: Environment;
}

export default class CharacterPlanner extends React.PureComponent<Props, State> {
	state: State = {
		plannedParty: undefined,
		env: {
			character: -1,
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
		}
	};
	@autobind
	private changePlannedParty(plannedParty: PartyModel | undefined) {
		this.setState({ plannedParty });
	}

	@autobind
	private changeEnv<K extends keyof Environment>(key: K, value: Environment[K]) {
		this.setState(s => ({
			env: {
				...s.env,
				[key]: value
			}
		}));
	}

	render() {
		const plannedParty = this.props.party.getJob(this.props.characterIndex, this.props.boardIndex) ? undefined : this.state.plannedParty;
		return <div className="character-planner">
			<CharacterPanel {...this.props} plannedParty={plannedParty} />
			{this.props.qeActive
				? <QeBoard {...this.props} />
				: this.props.dpsActive
					? <Dps party={this.props.party} env={this.state.env} changeEnv={this.changeEnv} />
					: <LicenseBoard {...this.props} changePlannedParty={this.changePlannedParty} />
			}
		</div>;
	}
}
