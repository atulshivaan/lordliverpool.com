import React from 'react';
import styles from './card.module.scss';
import Img from 'gatsby-image';
import { Link } from 'gatsby';
import { AppLocState } from 'types';

type CardProps = {
	show: boolean;
	animate: boolean;
	featuredImage?: GatsbyTypes.Maybe<
		Pick<
			GatsbyTypes.ImageSharpFluid,
			'sizes' | 'base64' | 'aspectRatio' | 'src' | 'srcSet'
		>
	>;
	title?: string;
	isFullArticle: boolean;
	slug?: string;
	text?: string;
	displayDate?: string;
	id: string;
	selectedCategory: string;
	cardContainerWrapperRef?: React.RefObject<HTMLDivElement | undefined>;
};

const Card: React.FC<CardProps> = ({
	show,
	animate,
	featuredImage,
	title,
	isFullArticle,
	slug,
	text,
	displayDate,
	id,
	selectedCategory,
	cardContainerWrapperRef,
}) => {
	const passingState: AppLocState = {
		get selectedCategory() {
			return selectedCategory;
		},
		get initialPos() {
			return cardContainerWrapperRef?.current?.scrollTop;
		},
	};

	return (
		<article
			className={`${styles.card} ${animate ? styles.animate : ''} ${
				show ? '' : styles.hidden
			}`}
			id={id}
		>
			<div className={styles.inner}>
				{featuredImage &&
					(isFullArticle && slug ? (
						<Link
							to={slug}
							className={styles.titleLink}
							state={passingState}
						>
							<Img
								className={styles.image}
								imgStyle={{
									objectPosition: 'center 10%',
								}}
								fluid={featuredImage}
							/>
						</Link>
					) : (
						<Img
							className={styles.image}
							imgStyle={{
								objectPosition: 'center 10%',
							}}
							fluid={featuredImage}
						/>
					))}
				{title && (
					<h2
						className={
							featuredImage
								? styles.header
								: `${styles.header} ${styles.headerNoImage}`
						}
					>
						{isFullArticle && slug ? (
							<Link
								to={slug}
								className={styles.titleLink}
								state={passingState}
							>
								{title}
							</Link>
						) : (
							title
						)}
					</h2>
				)}
				{text && <p className={styles.text}>{text}</p>}
			</div>
			{displayDate && (
				<span className={styles.displayDate}>{displayDate}</span>
			)}
		</article>
	);
};

// export default Card;

const memoizedCard = React.memo(Card, (prevProps, nextProps) => {
	if (
		prevProps.show !== nextProps.show ||
		prevProps.animate !== nextProps.animate ||
		prevProps.selectedCategory !== nextProps.selectedCategory
	) {
		return false;
	}
	return true;
});

export default memoizedCard;
