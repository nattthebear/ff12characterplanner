import * as React from "react";
import PartyModel from "../model/PartyModel";
import CharacterPlanner from "./CharacterPlanner";
import "normalize.css/normalize.css";
import "./App.scss";

export interface State {
	party: PartyModel;
	characterIndex: number;
	boardIndex: number;
	qeActive: boolean;
	dpsActive: boolean;
}

export default class App extends React.PureComponent<{}, State> {
	constructor(props: {}) {
		super(props);
		const party = window.location.search && PartyModel.decode(window.location.search.slice(1));
		this.state = {
			party: party || new PartyModel(),
			characterIndex: 0,
			boardIndex: 0,
			qeActive: false,
			dpsActive: false
		};
	}

	private changeParty = (newParty: PartyModel) => {
		this.setState(s => {
			if (s.boardIndex && !newParty.getJob(s.characterIndex, s.boardIndex)) {
				// don't allow selecting second job when first one is not learned
				return { party: newParty, boardIndex: 0 };
			} else {
				return { party: newParty, boardIndex: s.boardIndex };
			}
		});
	}

	private changeIndices = (characterIndex: number, boardIndex: number) => {
		this.setState(s => {
			if (boardIndex && !s.party.getJob(characterIndex, 0)) {
				// don't allow selecting second job when first one is not learned
				boardIndex = 0;
			}
			return { characterIndex, boardIndex };
		});
	}

	private toggleQe = () => {
		this.setState(s => {
			if (s.qeActive) {
				return {
					qeActive: false
				} as {
					qeActive: boolean,
					dpsActive: boolean
				};
			} else {
				return {
					qeActive: true,
					dpsActive: false
				};
			}
		});
	}

	private toggleDps = () => {
		this.setState(s => {
			if (s.dpsActive) {
				return {
					dpsActive: false
				} as {
					dpsActive: boolean,
					qeActive: boolean
				};
			} else {
				return {
					dpsActive: true,
					qeActive: false
				};
			}
		});
	}

	private updateSearch() {
		window.history.replaceState(null, "", window.location.href.split("?")[0] + "?" + this.state.party.encode());
	}

	componentDidMount() {
		this.updateSearch();
	}

	componentDidUpdate(prevProps: {}, prevState: State) {
		if (this.state.party !== prevState.party) {
			this.updateSearch();
		}
	}

	render() {
		return <CharacterPlanner
			{...this.state}
			changeParty={this.changeParty}
			changeIndices={this.changeIndices}
			toggleQe={this.toggleQe}
			toggleDps={this.toggleDps}
		/>;
	}
}
