import { h, type TPC, cleanup, effect } from "vdomk";
import { type License } from "../data/Licenses.ts";
import { type Position, type Board, Boards, PS2Board } from "../data/Boards.ts";
import "./LicenseBoard.css";
import { Coloring } from "../model/PartyModel.ts";
import GithubCorner from "./GithubCorner.tsx";
import { dispatch, useStore } from "../store/Store.ts";
import { type State, changeParty, changePlannedParty } from "../store/State.ts";

const LicenseBoard: TPC<{}> = (_, instance) => {
	const getState = useStore(instance);
	let store: State;
	let scrollOffset: { x: number; y: number } | undefined;
	let scrollEl: HTMLDivElement | null | undefined;
	let previousBoard: Board | undefined;
	const acceptScrollEl = (el: HTMLDivElement | null) => {
		scrollEl = el;
	};

	{
		function onMouseMove(ev: MouseEvent) {
			if (scrollOffset && scrollEl) {
				scrollEl.scrollLeft = scrollOffset.x - ev.screenX;
				scrollEl.scrollTop = scrollOffset.y - ev.screenY;
			}
		}
		function onMouseUp() {
			scrollOffset = undefined;
		}
		document.addEventListener("mousemove", onMouseMove, { passive: true });
		document.addEventListener("mouseup", onMouseUp, { passive: true });

		cleanup(instance, () => {
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseup", onMouseUp);
		});
	}

	function onMouseDown(ev: MouseEvent) {
		const target = ev.target as HTMLElement;
		if (scrollEl) {
			if (target.classList.contains("empty") || target.nodeName === "TABLE") {
				scrollOffset = {
					x: scrollEl.scrollLeft + ev.screenX,
					y: scrollEl.scrollTop + ev.screenY,
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
			<div class="name">{store.party.isPS2(store.characterIndex) && l.grants?.group === "Quickening" ? "Quickening" : l.fullName}</div>
			<div class="cost">{l.cost}</div>
			{l.image && <img class="mist" src={l.image} aria-role="none" />}
		</td>;
	}

	function renderBoard(b: Board) {
		const colors = store.party.color(store.characterIndex);
		return <div class="license-board-holder" ref={acceptScrollEl} onMouseDown={onMouseDown}>
			<table class="license-board">
				<tbody>
					{b.rows.map((row) => <tr>
						{row.map((pos) => renderPosition(pos, colors))}
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
				disabled={b === other || b === PS2Board && !!other || other === PS2Board}
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

	return () => {
		store = getState();

		const board = store.party.getJob(store.characterIndex, store.boardIndex);
		if (board !== previousBoard) {
			previousBoard = board;
			if (board === PS2Board) effect(instance, () => {
				const start = scrollEl?.querySelector<HTMLTableCellElement>("td.obtained");
				if (start && scrollEl) {
					scrollEl.scrollLeft = Math.max(0, start.offsetLeft - scrollEl.clientWidth / 2);
					scrollEl.scrollTop = Math.max(0, start.offsetTop - scrollEl.clientHeight / 2);
				}
			});
		}
		if (board) {
			return renderBoard(board);
		} else {
			const otherBoard = store.party.getJob(store.characterIndex, store.boardIndex ^ 1);
			return renderSelectJob(otherBoard);
		}
	};
};
export default LicenseBoard;
