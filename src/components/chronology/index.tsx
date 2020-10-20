import React from 'react';
import styles from './chronology.module.scss';
import { useStaticQuery, graphql } from 'gatsby';
import Timeline from './timeline';
import Card from './card';
import useScrollAndStateRestore from 'hooks/useScrollAndStateRestore';
import { useLocation } from '@reach/router';

const Chronology: React.FC = () => {
	const chronologyData = useStaticQuery<
		GatsbyTypes.ChronologyQueryQuery
	>(graphql`
		query ChronologyQuery {
			noPost: allMarkdownRemark(
				sort: { order: ASC, fields: [frontmatter___date] }
				filter: {
					fields: { sourceInstanceName: { eq: "chronology" } }
					rawMarkdownBody: { eq: "" }
				}
			) {
				edges {
					node {
						id
						frontmatter {
							title
							date(formatString: "y")
							displayDate
							category
							card
							featuredImage {
								childImageSharp {
									fluid(maxWidth: 500) {
										...GatsbyImageSharpFluid
									}
								}
							}
						}
					}
				}
			}
			withPost: allMarkdownRemark(
				sort: { order: ASC, fields: [frontmatter___date] }
				filter: {
					fields: { sourceInstanceName: { eq: "chronology" } }
					rawMarkdownBody: { ne: "" }
				}
			) {
				edges {
					node {
						id
						fields {
							slug
						}
						frontmatter {
							title
							date(formatString: "y")
							displayDate
							category
							card
							featuredImage {
								childImageSharp {
									fluid(maxWidth: 500) {
										...GatsbyImageSharpFluid
									}
								}
							}
						}
					}
				}
			}
		}
	`);

	const loc = useLocation();
	const upperState = loc?.state?.upperState;
	const scrollPos = loc?.state?.scrollPos;
	console.log(upperState, scrollPos);

	const { edges: cardsWithoutPost } = chronologyData.noPost;
	const { edges: cardsWithPost } = chronologyData.withPost;
	const cards = [
		...cardsWithPost.map((card) => {
			return { ...card.node, hasPost: true };
		}),
		...cardsWithoutPost.map((card) => {
			return { ...card.node, fields: { slug: '' }, hasPost: false };
		}),
	];

	const pulledInCategories = cards
		.map((c) => c?.frontmatter?.category || '')
		.filter((value, index, self) => self.indexOf(value) === index)
		.filter((value) => value && value !== '');
	const categories = ['all', ...pulledInCategories];

	const {
		state: selectedCategory,
		setState: setSelectedCategory,
		ref: cardContainerWrapperRef,
		onScroll: cardContainerWrapperOnScroll,
	} = useScrollAndStateRestore({
		identifier: `card-container-wrapper`,
		initialState: upperState || 'all',
	});

	// Don't animate cards until a bit of time has passed to allow session
	// storage to be checked
	const [animateCards, setAnimateCards] = React.useState(false);

	React.useEffect(() => {
		const animateTimeout = setTimeout(() => {
			setAnimateCards(true);
		}, 500);
		return () => {
			clearTimeout(animateTimeout);
		};
	}, []);

	console.log(`selectedCategory: ${selectedCategory}`);

	const ticks = (selectedCategory !== categories[0]
		? cards.filter(
				(value) => value?.frontmatter?.category === selectedCategory
		  )
		: cards
	)
		.map((card) => card.frontmatter?.date)
		.filter((year) => typeof year !== 'undefined') as Array<string>; //not cheating, TS won't filter out undefined types

	const cardContainerRef = React.useRef<HTMLDivElement>(null);

	if (cardContainerRef.current) {
		cardContainerRef.current.focus();
	}

	//TODO restore selected state with the same session storage trick as scroll restoration

	const sectionClass = `${styles.chronology} `;

	return (
		<section className={sectionClass}>
			<h1 className={styles.chronologyTitle}>Chronology</h1>
			<div className={styles.filterMenu}>
				{categories.map((category) => (
					<h3
						key={category}
						onClick={() => setSelectedCategory(category)}
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
			<div
				className={styles.cardContainerWrapper}
				ref={cardContainerWrapperRef}
				onScroll={cardContainerWrapperOnScroll}
			>
				<div className={styles.cardContainer} ref={cardContainerRef}>
					<div className={styles.buffer}>&nbsp;</div>
					{cards &&
						cards.map((card) => {
							const show =
								selectedCategory === categories[0] ||
								card?.frontmatter?.category ===
									selectedCategory;
							return (
								<Card
									key={card.id}
									show={show}
									featuredImage={
										card?.frontmatter?.featuredImage
											?.childImageSharp?.fluid
									}
									title={card?.frontmatter?.title}
									isFullArticle={card.hasPost}
									slug={card?.fields?.slug}
									text={card?.frontmatter?.card}
									displayDate={card?.frontmatter?.displayDate}
									selectedCategory={selectedCategory}
									containerScrollPos={
										cardContainerWrapperRef?.current
											?.scrollTop
									}
									animate={animateCards}
								/>
							);
						})}
					<div className={styles.buffer}>&nbsp;</div>
				</div>
			</div>
			<Timeline
				{...{
					ticks,
					cardContainerWrapperRef,
					cardContainerRef,
				}}
			/>
		</section>
	);
};

export default Chronology;
