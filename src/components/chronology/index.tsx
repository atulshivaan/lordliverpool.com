import React from 'react';
import styles from './chronology.module.scss';
import { useStaticQuery, graphql, Link } from 'gatsby';
import Img from 'gatsby-image';

const Miscellany: React.FC = () => {
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
					}
				}
			}
		}
	`);

	const { edges: cards } = chronologyData.allMarkdownRemark;

	return (
		<section className={styles.chronology}>
			<h1 className={styles.chronologyTitle}>Chronology</h1>
			<div className={styles.cardContainerWrapper}>
				<div className={styles.cardContainer}>
					{cards &&
						cards.map(({ node: card }) => {
							return (
								<article key={card.id} className={styles.card}>
									{card?.frontmatter?.featuredImage
										?.childImageSharp?.fluid && (
										<Img
											className={styles.cardImage}
											fluid={
												card.frontmatter.featuredImage
													.childImageSharp.fluid
											}
										/>
									)}
									{card?.frontmatter?.title && (
										<h2 className={styles.cardHeader}>
											{card.frontmatter.title}
										</h2>
									)}
									{card?.frontmatter?.card && (
										<p>{card.frontmatter.card}</p>
									)}
								</article>
							);
						})}
					<div className={styles.buffer}>&nbsp;</div>
				</div>
			</div>
			<div className={styles.timeline}>Timeline here</div>
		</section>
	);
};

export default Miscellany;
