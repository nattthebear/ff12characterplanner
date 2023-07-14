import { h, TPC } from "vdomk";
import CharacterPanel from "./CharacterPanel";
import LicenseBoard from "./LicenseBoard";
import QeBoard from "./QeBoard";
import Dps from "./Dps";
import { useStore } from "../store/Store";
import PartyModel from "../model/PartyModel";

import "./CharacterPlanner.css";

const CharacterPlanner: TPC<{}> = (_, instance) => {
	const getState = useStore(instance);
	let prevParty: PartyModel | undefined;

	return () => {
		const { party, qeActive, dpsActive } = getState();

		if (party !== prevParty) {
			requestIdleCallback(() => {
				const urlBase = window.location.href.split("?")[0];
				const search = party.encode();
				const urlSuffix = search === "AA.AA.AA.AA.AA.AA" ? "" : "?" + search;
				window.history.replaceState(null, "", urlBase + urlSuffix);
			});
			prevParty = party;
		}

		return <div class="character-planner">
			<CharacterPanel />
			{qeActive
				? <QeBoard />
				: dpsActive
					? <Dps party={party} />
					: <LicenseBoard />
			}
		</div>;
	};
};
export default CharacterPlanner;
