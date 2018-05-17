# vue-builder

> Standalone build/development pipeline for Vue.js.

`vue-builder` is a CLI tool that comes packaged with everything you need to build and develop a Vue.js app. Why? So you can unbloat your project from extraneous build scripts and dev dependencies and focus on making your product awesome.

Notable features:

1. Prerendering
2. Hot module reloading with Webpack dev server
3. Company-wide ESLint config
4. Assets fingerprinting
5. Multilingual setup
6. Client-side router setup
7. Continuous integration setup with [CircleCI](https://circleci.com)
8. Automatic deployment to [Netlify](https://netlify.com)

## Quick Start

Follow these steps to quickly set up a project built with `vue-builder` and deploy it to Netlify:

1. Generate the project with [`vue-cli`](https://github.com/vuejs/vue-cli), install dependencies and run the dev server:
    ```sh
    $ vue init andrewscwei/vue-builder#<release_tag> <project_dir> --clone
    $ cd <project_dir>
    $ yarn
    $ yarn dev
    ```
2. Set up CircleCI:
    1. Push your project to GitHub
    2. Log in to [CircleCI dashboard](https://circleci.com/)
    3. **Projects** > **Add Project** > Find the GitHub repo for your project > **Setup project** > **Start building**
    4. In your project settings > **Checkout SSH keys** > **Add user key**
    5. In your project settings > **Environment Variables** > Create a variable named `NETLIFY_KEY` and set its value to the Netlify key.
3. Trigger rebuild on CircleCI (your first build probably failed). Once complete, your site will be deployed to Netlify. From the build logs, head to step **Deploy to Netlify** and find the URL highlighted in **green** at the bottom.

## License

This software is released under the [MIT License](http://opensource.org/licenses/MIT).
