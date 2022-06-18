import { h } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { License } from "../data/Licenses";
import { Position, Board, Boards } from "../data/Boards";
import "./LicenseBoard.css";
import { Coloring } from "../model/PartyModel";
import GithubCorner from "./GithubCorner";
import { dispatch, useStore } from "../store/Store";
import { changeParty, changePlannedParty } from "../store/State";

export default function LicenseBoard() {
	const store = useStore();
	const scrollOffset = useRef<{ x: number; y: number }>();
	const scrollEl = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		function onMouseMove(ev: MouseEvent) {
			const element = scrollEl.current;
			const offs = scrollOffset.current;
			if (offs && element) {
				element.scrollLeft = offs.x - ev.screenX;
				element.scrollTop = offs.y - ev.screenY;
			}
		}
		function onMouseUp() {
			scrollOffset.current = undefined;
		}
		document.addEventListener("mousemove", onMouseMove, { passive: true });
		document.addEventListener("mouseup", onMouseUp, { passive: true });
		return () => {
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseup", onMouseUp);
		};
	}, []);

	function onMouseDown(ev: MouseEvent) {
		const element = scrollEl.current;
		const target = ev.target as HTMLElement;
		if (element) {
			if (target.classList.contains("empty") || target.nodeName === "TABLE") {
				scrollOffset.current = {
					x: element.scrollLeft + ev.screenX,
					y: element.scrollTop + ev.screenY,
				};
				ev.preventDefault();
			}
		}
	}

	function renderPosition(pos: Position | undefined, colors: Map<License, Coloring>) {
		if (!pos) {
			return <td class="empty" />;
		}
		const l = pos.value;
		let className: string;
		let obtained = false;
		switch (colors.get(l)) {
			case Coloring.OBTAINED: className = "l obtained"; obtained = true; break;
			case Coloring.CERTAIN: className = "l certain"; break;
			case Coloring.POSSIBLE: className = "l possible"; break;
			default: className = "l blocked"; break;
		}
		const onClick = () => {
			if (obtained) {
				dispatch(changeParty(store.party.delete(store.characterIndex, l)));
			} else {
				dispatch(changeParty(store.party.add(store.characterIndex, l)));
			}
		};
		return <td class={className} onClick={onClick} aria-label={l.text}>
			<div class="name">{l.fullName}</div>
			<div class="cost">{l.cost}</div>
			{l.image && <img class="mist" src={l.image} aria-role="none" />}
		</td>;
	}

	function renderBoard(b: Board) {
		const colors = store.party.color(store.characterIndex);
		return <div class="license-board-holder" ref={scrollEl} onMouseDown={onMouseDown}>
			<table class="license-board">
				<tbody>
					{b.rows.map((row) => <tr>
						{row.map((pos, i) => renderPosition(pos, colors))}
					</tr>)}
				</tbody>
			</table>
		</div>;
	}

	function renderSelectJob(other: Board | undefined) {
		return <div class="select-job">
			{Boards.map(b => <button
				onClick={() => dispatch(changeParty(store.party.addJob(store.characterIndex, b)))}
				class="job button"
				disabled={b === other}
				aria-label={b.text}
				onMouseOver={() => dispatch(changePlannedParty(store.party.addJob(store.characterIndex, b)))}
				onMouseOut={() => dispatch(changePlannedParty(undefined))}
			>
				<img class="zodiac" src={b.image} alt={b.imageAlt} />
				{b.name}
			</button>)}
			<GithubCorner />
		</div>;
	}

	const b = store.party.getJob(store.characterIndex, store.boardIndex);
	if (b) {
		return renderBoard(b);
	} else {
		const otherBoard = store.party.getJob(store.characterIndex, store.boardIndex ^ 1);
		return renderSelectJob(otherBoard);
	}
}
