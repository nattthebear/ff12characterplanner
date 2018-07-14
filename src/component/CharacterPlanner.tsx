import * as React from "react";
import CharacterPanel from "./CharacterPanel";
import LicenseBoard from "./LicenseBoard";
import "./CharacterPlanner.scss";
import PartyModel from "../model/PartyModel";
import QeBoard from "./QeBoard";

export interface Props {
	party: PartyModel;
	changeParty(newParty: PartyModel): void;
	characterIndex: number;
	boardIndex: number;
	changeIndices(characterIndex: number, boardIndex: number): void;
	qeActive: boolean;
	toggleQe(): void;
}

export default class CharacterPlanner extends React.PureComponent<Props> {
	render() {
		return <div className="character-planner">
			<CharacterPanel {...this.props} />
			{this.props.qeActive ? <QeBoard {...this.props} /> : <LicenseBoard {...this.props} />}
		</div>;
	}
}
