import React, { useCallback } from 'react';
import HistoryContext from 'contexts/HistoryContext';
import { useLocation } from '@reach/router';
import rafSchd from 'raf-schd';
import { LocTyping } from 'types';

interface UseLocationStateProps {
	scrollContainer: React.RefObject<HTMLElement>;
	calculateScrollDistance: (targetItem: HTMLElement) => number;
}

interface LocationStateProps {
	initialState: React.MutableRefObject<string | null>;
	itemToScrollToOnLoad: (item: HTMLElement | null) => void;
	scrolledToID: string | undefined;
}

const useLocationState = ({
	scrollContainer,
	calculateScrollDistance,
}: UseLocationStateProps): LocationStateProps => {
	const location = useLocation() as LocTyping;
	const { fromBackButton, resetBackButton } =
		React.useContext(HistoryContext);

	// If from back button, get data (if any) and send it back
	// If not, restore scroll state based on location data (if any)
	const initialState = React.useRef<string | null>(
		fromBackButton.current ? null : location?.state?.upperState || null
	);

	const [scrolledToID, setScrolledToID] = React.useState<string>();

	const scrollItemIntoView = (targetItem: HTMLElement) => {
		if (scrollContainer.current) {
			const toScroll = calculateScrollDistance(targetItem);
			scrollContainer.current.scrollTop = toScroll;
		}
	};

	const rafScrollItemIntoView = rafSchd(scrollItemIntoView);

	const itemToScrollToOnLoad = React.useCallback(
		(node: HTMLElement | null) => {
			if (node) {
				rafScrollItemIntoView(node);
			}
		},
		[rafScrollItemIntoView]
	);

	const restoreScrollStateBasedOnLocationState = useCallback(() => {
		const locScrollToID = location?.state?.id;
		const locInitialPos = location?.state?.initialPos;
		if (!fromBackButton.current) {
			if (typeof locInitialPos === 'number') {
				if (scrollContainer.current) {
					scrollContainer.current.scrollTop = locInitialPos;
				}
			} else if (locScrollToID) {
				setScrolledToID(locScrollToID);
			}
		} else {
			resetBackButton();
		}
	}, [scrollContainer, location, fromBackButton, resetBackButton]);

	React.useEffect(() => {
		const rafRestoreScrollStateBasedOnLocationState = rafSchd(
			restoreScrollStateBasedOnLocationState
		);
		rafRestoreScrollStateBasedOnLocationState();
		return () => {
			rafRestoreScrollStateBasedOnLocationState.cancel();
		};
	}, [restoreScrollStateBasedOnLocationState]);

	return {
		initialState,
		itemToScrollToOnLoad,
		scrolledToID,
	};
};

export default useLocationState;
