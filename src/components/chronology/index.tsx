import React from 'react';
import styles from './chronology.module.scss';
import { useStaticQuery, graphql, Link } from 'gatsby';
import Img from 'gatsby-image';

const Chronology: React.FC = () => {
	const chronologyData = useStaticQuery<
		GatsbyTypes.ChronologyQueryQuery
	>(graphql`
		query ChronologyQuery {
			allMarkdownRemark(
				sort: { order: ASC, fields: [frontmatter___timelineDate] }
				filter: { fields: { sourceInstanceName: { eq: "chronology" } } }
			) {
				edges {
					node {
						id
						fields {
							slug
						}
						frontmatter {
							title
							subtitle
							timelineDate
							displayDate
							category
							card
							featuredImage {
								childImageSharp {
									fluid {
										...GatsbyImageSharpFluid
									}
								}
							}
						}
						rawMarkdownBody
					}
				}
			}
		}
	`);

	const { edges: cards } = chronologyData.allMarkdownRemark;
	const pulledInCategories = cards
		.map((c) => c?.node.frontmatter?.category || '')
		.filter((value, index, self) => self.indexOf(value) === index)
		.filter((value) => value && value !== '');
	const categories = ['all', ...pulledInCategories];

	const [selectedCategory, setSelectedCategory] = React.useState<
		typeof categories[number]
	>(categories[0]);

	const ticks =
		selectedCategory !== categories[0]
			? cards.filter(
					(value) =>
						value?.node?.frontmatter?.category === selectedCategory
			  ).length
			: cards.length;

	const tickContent = Array(ticks).fill(
		<span className={styles.tick}></span>
	);

	return (
		<section className={styles.chronology}>
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
			<div className={styles.cardContainerWrapper}>
				<div className={styles.cardContainer}>
					<div className={styles.buffer}>&nbsp;</div>
					{cards &&
						cards.map(({ node: card }) => {
							const show =
								selectedCategory === categories[0] ||
								card?.frontmatter?.category ===
									selectedCategory;
							return (
								<article
									key={card.id}
									className={`${styles.card} ${
										show ? '' : styles.cardHidden
									}`}
								>
									<div className={styles.innerCard}>
										{card?.frontmatter?.featuredImage
											?.childImageSharp?.fluid && (
											<Img
												className={styles.cardImage}
												fluid={
													card.frontmatter
														.featuredImage
														.childImageSharp.fluid
												}
											/>
										)}
										{card?.frontmatter?.title && (
											<h2
												className={
													card?.frontmatter
														?.featuredImage
														?.childImageSharp?.fluid
														? styles.cardHeader
														: `${styles.cardHeader} ${styles.cardHeaderNoImage}`
												}
											>
												{card?.rawMarkdownBody !== '' &&
												card?.fields?.slug ? (
													<Link
														to={card.fields.slug}
														className={
															styles.titleLink
														}
													>
														{card.frontmatter.title}
													</Link>
												) : (
													card.frontmatter.title
												)}
											</h2>
										)}
										{card?.frontmatter?.card && (
											<p className={styles.cardText}>
												{card.frontmatter.card}
											</p>
										)}
									</div>
									{card?.frontmatter?.displayDate && (
										<span className={styles.displayDate}>
											{card.frontmatter.displayDate}
										</span>
									)}
								</article>
							);
						})}
					<div className={styles.buffer}>&nbsp;</div>
				</div>
			</div>
			<div className={styles.timeline}>{tickContent}</div>
		</section>
	);
};

export default Chronology;
