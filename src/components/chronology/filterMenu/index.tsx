import React from 'react';
import styles from './filterMenu.module.scss';
import { MdFilterList } from 'react-icons/md';

type FilterMenuProps = {
	categories: React.MutableRefObject<any[]>;
	setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
	selectedCategory: string;
};

const FilterMenu: React.FC<FilterMenuProps> = ({
	categories,
	setSelectedCategory,
	selectedCategory,
}) => {
	const filterMenuButtonRef = React.useRef<HTMLInputElement>(null);

	const changeSelectedCategory = (category: string) => {
		setSelectedCategory(category);
		if (filterMenuButtonRef.current?.checked) {
			filterMenuButtonRef.current.checked = false;
		}
	};
	return (
		<div className={styles.filterMenu}>
			<input
				type="checkbox"
				name="filter"
				id="filter"
				ref={filterMenuButtonRef}
				className={styles.filterMenuInput}
			/>
			<label
				htmlFor="filter"
				className={styles.filterMenuButtonContainer}
			>
				<h3 className={styles.filterMenuLink}>
					<MdFilterList />
				</h3>
			</label>
			<div className={styles.filterMenuMobile}>
				{categories.current.map((category) => (
					<h3
						key={category}
						onClick={() => changeSelectedCategory(category)}
						className={
							category === selectedCategory
								? `${styles.filterMenuLink} ${styles.selectedLink}`
								: styles.filterMenuLink
						}
					>
						{category.charAt(0).toUpperCase() + category.slice(1)}
					</h3>
				))}
			</div>
		</div>
	);
};

export default FilterMenu;