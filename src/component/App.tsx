import * as React from "react";
import PartyModel from "../model/PartyModel";
import CharacterPlanner from "./CharacterPlanner";
import autobind from "../../node_modules/autobind-decorator";
import "normalize.css/normalize.css";
import "./App.scss";

export interface State {
	party: PartyModel;
	characterIndex: number;
	boardIndex: number;
}

export default class App extends React.PureComponent<{}, State> {
	state: State = {
		party: new PartyModel(),
		characterIndex: 0,
		boardIndex: 0
	};

	@autobind
	private changeParty(newParty: PartyModel) {
		this.setState({ party: newParty });
	}

	@autobind
	private changeIndices(characterIndex: number, boardIndex: number) {
		this.setState({ characterIndex, boardIndex });
	}

	render() {
		return <CharacterPlanner {...this.state} changeParty={this.changeParty} changeIndices={this.changeIndices} />;
	}
}
