
# Boilerplate for launching Telegram bots using GrammyJS and deploying to Vercel Functions

A quick-start template for building and deploying Telegram bots using GramJS with Vercel Functions.

## Overview

This project template provides a streamlined setup for launching Telegram bots using [GrammyJS](https://grammy.dev/) and deploying them with [Vercel Functions](https://vercel.com/docs/functions). It's ideal for beginners looking to dive into bot development with a solid foundation.

## What's Included

[TypeScript](https://www.typescriptlang.org/): Utilize the benefits of static typing and modern JavaScript features.

[ESLint](https://eslint.org/): Enforce coding style and catch errors early in development.

[Prettier](https://prettier.io/): Keep your codebase clean and consistent with automatic code formatting.

[dotenv](https://www.npmjs.com/package/dotenv): Safely manage environment variables for sensitive information.

[ts-node](https://typestrong.org/ts-node/): Achieve live-reloading during development for a smooth workflow.

[tsc-alias](https://www.npmjs.com/package/tsc-alias ) and [tsconfig-paths](https://www.npmjs.com/package/tsconfig-paths): Simplify module resolution with path aliases.

[rimraf](https://www.npmjs.com/package/rimraf): Cleanly delete old builds for a fresh start.

## Getting Started

Clone the Repository: Begin by cloning this repository to your local machine.
```sh
git clone https://github.com/sadraliev/grammyjs-vercel-drizzlejs
```
Install Dependencies: Run npm install to install all necessary dependencies.
```sh
npm install
```
Configure Environment Variables: Create a .env file in the root directory and add your environment variables. This is where you'll store sensitive information like API keys and tokens.

Development: Start the development server with `npm run start:dev`. This will launch the bot locally with live-reloading enabled.

Linting and Formatting: Ensure code quality and consistency by running `npm run lint` and `npm run format`.

Build and Deployment: When you're ready to deploy, use `npm run build` to generate a production-ready build. Then, deploy your bot with Vercel Functions.

## Contributing

Contributions are welcome! If you encounter any issues or have suggestions for improvements, feel free to open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

Special thanks to the creators and maintainers of GrammyJS, Vercel, TypeScript, ESLint, Prettier, and all other dependencies used in this project. Your contributions make projects like this possible.

### Happy Bot Building!