# [LordLiverpool.com](https://www.lordliverpool.com/)

[![Netlify Status](https://img.shields.io/netlify/6c600477-b01f-411f-bafd-d5a428a1ec4e?logo=netlify&style=flat-square)](https://app.netlify.com/sites/torystories/deploys)
[![Build-badge](https://img.shields.io/github/actions/workflow/status/Zweihander-Main/lordliverpool.com/test.yml?branch=master&logo=github&style=flat-square)](https://github.com/Zweihander-Main/lordliverpool.com/actions?query=workflow%3Ae2e-test)

> Gatsby content site for Britain's Greatest Prime Minister

![Screenshot of LordLiverpool.com](./docs/lordliverpool.png)

## Technologies used:

-   GatsbyJS (v5)
    -   TypeScript
    -   GraphQL + Typegen
    -   SCSS + Modules
    -   Sitemap using git metadata
-   Jest + Linting Runners
-   Cypress + Axe + Visual Regression
-   NetlifyCMS + Netlify

## Dev workflow

### Notes:

-   Deployed on Netlify
    -   Netlify experimental cache enabled
    -   Gatsby fingerprinting disabled
-   Netlify builds from `netlify` branch
    -   NetlifyCMS and netlify preview deploys working from `master` branch
-   Perf analysis:
    -   `/report.html` for `webpack-bundle-analyser` total bundle info
    -   `/admin/report.html` for `webpack-bundle-analyser` on `netlify-cms`
    -   `/_report.html` for `perf-budgets` breakdown by page

### Workflow for development:

    1. Pre-commit hooks run on code: all jest tests and lint runners
    2. Push to `master` branch
    3. E2E tests run on new code
    4. If passed, branch pushed into `netlify`

### Workflow for NetlifyCMS:

    1. PR created in `master`
    2. Preview deploys run on PR
    3. PR manually merged or merged through UI
    4. E2E tests run on new code
    5. If passed, branch pushed into `netlify`

## Scripts

-   `yarn run build`: Build to production using Gatsby (outputs to `public` folder)
-   `yarn run dev`: Build and serve development version using Gatsby
-   `yarn run clean`: Clean the `public` and `.cache` folders
-   `yarn run serve`: Build and serve production
-   `yarn run test`: Run jest and runners
-   `yarn run test:coverage`: Generate coverage reports
-   `yarn run test:watch`: Run jest and runners in watch mode
-   `yarn run test:debug`: Run jest and allow node-based debugging
-   `yarn run test:e2e`: Run cypress E2E tests
-   `yarn run test:e2e:run`: Run cypress on production build
-   `yarn run test:e2e:dev`: Open cypress dashboard on development build
-   `yarn run test:e2e:dev:prod`: Open cypress dashboard on production build
-   `yarn run cy:run`: Run cypress
-   `yarn run cy:open`: Open cypress dashboard
-   `yarn run lint`: Run all jest runners
-   `yarn run lint:md`: Run remark markdown linter
-   `yarn run lint:ts`: Run TypeScript compiler
-   `yarn run prepare`: Prepare husky
-   `yarn run netlify`: Script to run as netlify that builds and generates public coverage reports
-   `yarn run format`: Auto-format using prettier

## Possible improvements

-   Change Chronology to use a virtualized list when javascript is enabled
-   Better support for older browsers
-   Add in Critical FOFT font loading strategy

## Available for Hire

I'm available for freelance, contracts, and consulting both remotely and in the Hudson Valley, NY (USA) area. [Some more about me](https://www.zweisolutions.com/about.html) and [what I can do for you](https://www.zweisolutions.com/services.html).

Feel free to drop me a message at:

```
hi [a+] zweisolutions {●} com
```

## License

Code (outside the `/content` and `/static/docs` folders) is licensed under [MIT](./LICENSE)
Content underneath the `/content` and `/static/docs` folders is Copyright 2020 of the book author Martin Hutchinson unless otherwise stated, All Rights Reserved.
