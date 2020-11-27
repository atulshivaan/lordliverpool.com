import React from 'react';
import styles from './retailersModal.module.scss';
import { useStaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';

const RetailersModal: React.FC = () => {
	const retailersData = useStaticQuery<
		GatsbyTypes.RetailersInfoQuery
	>(graphql`
		query RetailersInfo {
			allMarkdownRemark(
				sort: { order: ASC, fields: [frontmatter___order] }
				filter: { fields: { sourceInstanceName: { eq: "retailers" } } }
			) {
				edges {
					node {
						id
						frontmatter {
							title
							currency
							format
							link
							flag
							featuredImage {
								childImageSharp {
									fluid(maxWidth: 400) {
										...GatsbyImageSharpFluid
									}
								}
							}
						}
					}
				}
			}
			UK_pic: file(relativePath: { eq: "uk.png" }) {
				childImageSharp {
					fixed(width: 40) {
						...GatsbyImageSharpFixed
					}
				}
			}
			USA_pic: file(relativePath: { eq: "usa.png" }) {
				childImageSharp {
					fixed(width: 40) {
						...GatsbyImageSharpFixed
					}
				}
			}
			JP_pic: file(relativePath: { eq: "japan.png" }) {
				childImageSharp {
					fixed(width: 40) {
						...GatsbyImageSharpFixed
					}
				}
			}
			ES_pic: file(relativePath: { eq: "spain.png" }) {
				childImageSharp {
					fixed(width: 40) {
						...GatsbyImageSharpFixed
					}
				}
			}
			FR_pic: file(relativePath: { eq: "france.png" }) {
				childImageSharp {
					fixed(width: 40) {
						...GatsbyImageSharpFixed
					}
				}
			}
			IT_pic: file(relativePath: { eq: "italy.png" }) {
				childImageSharp {
					fixed(width: 40) {
						...GatsbyImageSharpFixed
					}
				}
			}
		}
	`);

	const flagPics = React.useRef(
		(() => {
			const UK_pic = retailersData?.UK_pic?.childImageSharp?.fixed;
			const USA_pic = retailersData?.USA_pic?.childImageSharp?.fixed;
			const JP_pic = retailersData?.JP_pic?.childImageSharp?.fixed;
			const ES_pic = retailersData?.ES_pic?.childImageSharp?.fixed;
			const FR_pic = retailersData?.FR_pic?.childImageSharp?.fixed;
			const IT_pic = retailersData?.IT_pic?.childImageSharp?.fixed;
			const flagObj = {
				UK_pic,
				USA_pic,
				JP_pic,
				ES_pic,
				FR_pic,
				IT_pic,
			};

			if (
				!UK_pic ||
				!USA_pic ||
				!JP_pic ||
				!ES_pic ||
				!FR_pic ||
				!IT_pic
			) {
				throw new Error('Missing image for flags');
			}
			return flagObj;
		})()
	);

	const { edges: retailers } = retailersData.allMarkdownRemark;

	const [formats, currencies] = React.useRef(
		(() => {
			const formatsGQL = retailers.map(
				(edge) => edge.node.frontmatter?.format
			);
			const currenciesGQL = retailers.map(
				(edge) => edge.node.frontmatter?.currency
			);
			const convertGQLListToArray = (
				gqlList: typeof formatsGQL | typeof currenciesGQL
			) => {
				const returnArr: Array<string> = [];
				gqlList.forEach((listItem) => {
					listItem?.forEach((item) => {
						if (item && returnArr.indexOf(item) === -1) {
							returnArr.push(item);
						}
					});
				});
				return returnArr;
			};
			const formats = convertGQLListToArray(formatsGQL);
			const currencies = convertGQLListToArray(currenciesGQL);
			return [formats, currencies];
		})()
	).current;

	const [selectedFormat, setSelectedFormat] = React.useState<string | null>(
		null
	);
	const [selectedCurrency, setSelectedCurrency] = React.useState<
		string | null
	>(null);

	type typeOfOption = 'format' | 'currency';

	const handleOptionChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		type: typeOfOption
	) => {
		const toChange = e.target.value;
		if (type === 'format') {
			setSelectedFormat(toChange);
		} else {
			setSelectedCurrency(toChange);
		}
	};

	const clearOptions = (type: typeOfOption) => {
		if (type === 'format') {
			setSelectedFormat(null);
		} else {
			setSelectedCurrency(null);
		}
	};

	const closeRef = React.useRef<HTMLAnchorElement>(null);

	const escFunction = (event: KeyboardEvent) => {
		if (event.key === 'Escape' && closeRef.current) {
			closeRef.current.click();
		}
	};

	// Potential improvement: only add the event listener when the modal is
	// actually open
	React.useEffect(() => {
		document.addEventListener('keydown', escFunction, false);
		return () => {
			document.removeEventListener('keydown', escFunction, false);
		};
	}, []);

	return (
		<section
			className={styles.outer}
			id={'retailers'}
			tabIndex={-1}
			role={'dialog'}
			aria-hidden={true}
		>
			<div className={styles.inner}>
				<div className={styles.menu}>
					<div className={styles.menuSelection}>
						<span className={styles.menuLabel}>Format:</span>
						<div className={styles.radioOptionsContainer}>
							{' '}
							{formats.map((format) => (
								<React.Fragment key={format}>
									<input
										className={styles.radioOption}
										type="radio"
										id={format.toLowerCase()}
										name="format-radio"
										value={format}
										checked={selectedFormat === format}
										onChange={(e) =>
											handleOptionChange(e, 'format')
										}
									/>
									<label
										className={styles.radioLabel}
										htmlFor={format.toLowerCase()}
									>
										{format}
									</label>
								</React.Fragment>
							))}
							<span
								className={`${styles.radioLabel} ${
									styles.unselect
								} ${
									selectedFormat !== null
										? styles.showUnselect
										: ''
								}`}
								onClick={() => clearOptions('format')}
							>
								X
							</span>
						</div>
					</div>
					<div className={styles.menuSelection}>
						<span className={styles.menuLabel}>Currency:</span>
						<div className={styles.radioOptionsContainer}>
							{currencies.map((currency) => (
								<React.Fragment key={currency}>
									<input
										className={styles.radioOption}
										type="radio"
										id={currency.toLowerCase()}
										name="currency-radio"
										value={currency}
										checked={selectedCurrency === currency}
										onChange={(e) =>
											handleOptionChange(e, 'currency')
										}
									/>
									<label
										className={styles.radioLabel}
										htmlFor={currency.toLowerCase()}
									>
										{currency}
									</label>
								</React.Fragment>
							))}
							<span
								className={`${styles.radioLabel} ${
									styles.unselect
								} ${
									selectedCurrency !== null
										? styles.showUnselect
										: ''
								}`}
								onClick={() => clearOptions('currency')}
							>
								X
							</span>
						</div>
					</div>
				</div>
				<div className={styles.retailersList}>
					{retailers &&
						retailers.map(({ node: retailer }) => {
							const flag = retailer?.frontmatter?.flag;
							let shouldDisplay = true;
							if (
								selectedCurrency !== null &&
								!retailer?.frontmatter?.currency?.includes(
									selectedCurrency
								)
							) {
								shouldDisplay = false;
							}
							if (
								selectedFormat !== null &&
								!retailer?.frontmatter?.format?.includes(
									selectedFormat
								)
							) {
								shouldDisplay = false;
							}
							return (
								<div
									className={
										shouldDisplay
											? `${styles.retailer} ${styles.showRetailer}`
											: styles.retailer
									}
									key={retailer.id}
								>
									<a
										target={'_blank'}
										href={retailer?.frontmatter?.link || ''}
										className={styles.retailerLink}
									>
										{retailer?.frontmatter?.featuredImage
											?.childImageSharp?.fluid && (
											<Img
												fluid={
													retailer.frontmatter
														.featuredImage
														.childImageSharp.fluid
												}
												alt={retailer.frontmatter.title}
												className={styles.logo}
												imgStyle={{
													margin: 0,
													objectFit: 'contain',
												}}
											/>
										)}
										{flag && flag !== 'None' && (
											<Img
												fixed={
													flagPics.current[
														`${flag}_pic`
													]
												}
												alt={`${flag} flag`}
												className={styles.flag}
												style={{ position: 'absolute' }}
											/>
										)}
									</a>
								</div>
							);
						})}
				</div>
			</div>

			<a
				href={'#!'}
				className={styles.close}
				title="Close the list of retailers"
				ref={closeRef}
			>
				?
			</a>
		</section>
	);
};

export default RetailersModal;
