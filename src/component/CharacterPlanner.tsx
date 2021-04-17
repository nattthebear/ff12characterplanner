import * as React from "react";
import CharacterPanel from "./CharacterPanel";
import LicenseBoard from "./LicenseBoard";
import "./CharacterPlanner.scss";
import QeBoard from "./QeBoard";
import Dps from "./Dps";
import { useStore } from "../store/Store";


export default function CharacterPlanner() {
	const props = useStore();

	return <div className="character-planner">
		<CharacterPanel />
		{props.qeActive
			? <QeBoard />
			: props.dpsActive
				? <Dps party={props.party} />
				: <LicenseBoard />
		}
	</div>;
}
