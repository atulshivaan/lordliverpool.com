import React from 'react';
import styles from './miscellany.module.scss';
import { useStaticQuery, graphql, Link } from 'gatsby';
import Img from 'gatsby-image';

const Miscellany: React.FC = () => {
	const blogRollData = useStaticQuery<GatsbyTypes.BlogRollQueryQuery>(graphql`
		query BlogRollQuery {
			allMarkdownRemark(
				sort: { order: DESC, fields: [frontmatter___date] }
				filter: { fields: { sourceInstanceName: { eq: "miscellany" } } }
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
							featuredImage {
								childImageSharp {
									fluid(maxWidth: 550) {
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

	const { edges: posts } = blogRollData.allMarkdownRemark;

	return (
		<div className={styles.masonry}>
			{posts &&
				posts.map(({ node: post }) => {
					return post?.fields?.slug ? (
						<Link
							key={post.id}
							to={post.fields.slug}
							className={styles.link}
						>
							<article className={styles.item}>
								{post?.frontmatter?.featuredImage
									?.childImageSharp?.fluid && (
									<Img
										className={styles.itemImage}
										fluid={
											post.frontmatter.featuredImage
												.childImageSharp.fluid
										}
									/>
								)}
								{post?.frontmatter && (
									<header className={styles.header}>
										<div>
											<h2 className={styles.title}>
												{post.frontmatter.title}
											</h2>
											{post.frontmatter?.subtitle && (
												<h3 className={styles.subtitle}>
													{post.frontmatter?.subtitle}
												</h3>
											)}
										</div>
									</header>
								)}
							</article>
						</Link>
					) : null;
				})}
		</div>
	);
};

export default Miscellany;