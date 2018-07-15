import * as React from "react";
import CharacterPanel from "./CharacterPanel";
import LicenseBoard from "./LicenseBoard";
import "./CharacterPlanner.scss";
import PartyModel from "../model/PartyModel";
import QeBoard from "./QeBoard";
import autobind from "autobind-decorator";

export interface Props {
	party: PartyModel;
	changeParty(newParty: PartyModel): void;
	characterIndex: number;
	boardIndex: number;
	changeIndices(characterIndex: number, boardIndex: number): void;
	qeActive: boolean;
	toggleQe(): void;
}

export interface State {
	/** Future party change.  Set by LicenseBoard in job select mode only, and used in CharacterPanel display */
	plannedParty?: PartyModel;
}

export default class CharacterPlanner extends React.PureComponent<Props, State> {
	state: State = {};
	@autobind
	private changePlannedParty(plannedParty: PartyModel | undefined) {
		this.setState({ plannedParty });
	}

	render() {
		const plannedParty = this.props.party.getJob(this.props.characterIndex, this.props.boardIndex) ? undefined : this.state.plannedParty;
		return <div className="character-planner">
			<CharacterPanel {...this.props} plannedParty={plannedParty} />
			{this.props.qeActive ? <QeBoard {...this.props} /> : <LicenseBoard {...this.props} changePlannedParty={this.changePlannedParty} />}
		</div>;
	}
}
