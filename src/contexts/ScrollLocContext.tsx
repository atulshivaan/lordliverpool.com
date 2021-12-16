import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useReducer,
} from 'react';
import StorageContext from './StorageContext';

export type ScrollLoc = {
	id?: string;
	pos?: number;
};

type ScrollStateContextProps = {
	state: ScrollLocReducerState;
	dispatch: React.Dispatch<ScrollLocReducerActions>;
	getPositions(this: void): ScrollLoc;
	loadStorage(this: void): ScrollLoc;
};

type ScrollLocReducerState = {
	contextState: string;
	pos: number | null;
	id: string | null;
};

const initialScrollLocState: ScrollLocReducerState = {
	contextState: 'all',
	pos: null,
	id: null,
};

const ScrollStateContext = createContext<ScrollStateContextProps>({
	state: initialScrollLocState,
	dispatch: () => undefined,
	getPositions: () => ({}),
	loadStorage: () => ({}),
});

export default ScrollStateContext;

type ScrollLocReducerActions =
	| {
			type: 'updatePos';
			payload: number;
	  }
	| {
			type: 'updateId';
			payload: string;
	  }
	| {
			type: 'updatePositions';
			payload: {
				pos: number;
				id: string;
			};
	  }
	| {
			type: 'updateAll';
			payload: {
				contextState: string;
				pos: number;
				id: string;
			};
	  }
	| {
			type: 'updateContextState';
			payload: string;
	  }
	| {
			type: 'resetPositions';
	  }
	| {
			type: 'resetAll';
	  };

const scrollLocReducer = (
	state: ScrollLocReducerState,
	action: ScrollLocReducerActions
) => {
	switch (action.type) {
		case 'updatePos': {
			return { ...state, pos: action.payload };
		}
		case 'updateId': {
			return { ...state, id: action.payload };
		}
		case 'updatePositions': {
			return {
				...state,
				pos: action.payload.pos,
				id: action.payload.id,
			};
		}
		case 'updateAll': {
			return {
				...state,
				contextState: action.payload.contextState,
				pos: action.payload.pos,
				id: action.payload.id,
			};
		}
		case 'updateContextState': {
			return { ...state, contextState: action.payload };
		}
		case 'resetPositions': {
			return { ...state, pos: null, id: null };
		}
		case 'resetAll': {
			return { ...state, contextState: 'all', pos: null, id: null };
		}
		default: {
			return state;
		}
	}
};

export const ScrollLocProvider: React.FC = ({ children }) => {
	const storage = useContext(StorageContext);

	const [state, dispatch] = useReducer(
		scrollLocReducer,
		initialScrollLocState
	);

	const getPositions = useCallback(() => {
		const returnObj: ScrollLoc = {};
		const id = state.id;
		const pos = state.pos;
		if (id) {
			returnObj.id = id;
		}
		if (pos) {
			returnObj.pos = pos;
		}
		dispatch({ type: 'resetPositions' });
		return returnObj;
	}, [state.id, state.pos]);

	const loadStorage = useCallback(() => {
		const returnObj: ScrollLoc = {};
		const savedState = storage.loadSavedState();
		if (savedState) {
			const { position, state } = savedState;
			dispatch({ type: 'updatePos', payload: position });
			returnObj.pos = position;
			dispatch({ type: 'updateContextState', payload: state });
		}
		const savedId = storage.loadSavedId();
		if (savedId) {
			const { id } = savedId;
			dispatch({ type: 'updateId', payload: id });
			returnObj.id = id;
		}
		return returnObj;
	}, [storage]);

	useEffect(() => {
		const pos = state.pos;
		const contextState = state.contextState;
		if (pos) {
			storage.saveState(pos, contextState);
		}
	}, [storage, state.pos, state.contextState]);

	useEffect(() => {
		const id = state.id;
		if (id) {
			storage.saveId(id);
		}
	}, [storage, state.id]);

	return (
		<ScrollStateContext.Provider
			value={{
				state,
				dispatch,
				getPositions,
				loadStorage,
			}}
		>
			{children}
		</ScrollStateContext.Provider>
	);
};

export const { Consumer: ScrollLocConsumer } = ScrollStateContext;
