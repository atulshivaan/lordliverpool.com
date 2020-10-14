module.exports = {
	siteMetadata: {
		title: `Britain's Greatest Prime Minister: Lord Liverpool`, //TODO Change title and description
		description: `Britain’s Greatest Prime Minister: Lord Liverpool unpicks two centuries of Whig history to redeem Lord Liverpool (1770-1828) from ‘arch-mediocrity’ and establish him as the greatest political leader the country has ever seen.`,
		author: `Martin Hutchinson`,
	},
	plugins: [
		{
			resolve: `gatsby-plugin-typegen`,
			options: {
				emitSchema: {
					'src/__generated__/gatsby-introspection.json': true,
					'src/__generated__/gatsby-schema.graphql': true,
				},
				emitPluginDocuments: {
					'src/__generated__/gatsby-plugin-documents.graphql': true,
				},
			},
		},
		`gatsby-alias-imports`,
		{
			resolve: `gatsby-plugin-typescript`,
			options: {
				isTSX: true,
				allExtensions: true,
			},
		},
		`gatsby-plugin-scss-typescript`,
		{
			resolve: `gatsby-plugin-typography`,
			options: {
				pathToConfigModule: `src/utils/typography`,
				omitGoogleFont: true,
			},
		},
		`gatsby-plugin-react-helmet`,
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `images`,
				path: `${__dirname}/src/images`,
			},
		},
		`gatsby-transformer-sharp`,
		`gatsby-plugin-sharp`,
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				name: `gatsby-starter-default`,
				short_name: `starter`,
				start_url: `/`,
				background_color: `#663399`,
				theme_color: `#663399`,
				display: `minimal-ui`,
				// icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
				// TODO add icon back in
			},
		},
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				path: `${__dirname}/content/miscellany`,
				name: `miscellany`,
			},
		},
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				path: `${__dirname}/content/chronology`,
				name: `chronology`,
			},
		},
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				path: `${__dirname}/content/contenders`,
				name: `contenders`,
			},
		},
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				path: `${__dirname}/content/pages`,
				name: `pages`,
			},
		},
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				path: `${__dirname}/content/retailers`,
				name: `retailers`,
			},
		},
		`gatsby-transformer-remark`,
		`gatsby-plugin-catch-links`,
		`gatsby-plugin-netlify-cms`, // should be last in the array
	],
};
