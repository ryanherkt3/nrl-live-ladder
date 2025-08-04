# NRL Live Ladder Website

This website (https://nrl-live-ladder.vercel.app) is built using [Next.js](https://nextjs.org/) - a modern React framework, and hosted on [Vercel](https://vercel.com/).

For a package manager, `npm` is preferred (`Node.js` must also be installed) - https://docs.npmjs.com/downloading-and-installing-node-js-and-npm.

### Installation

To clone the local repository and install the `Node` modules, run:

```bash
npx create-next-app@latest nrl-live-ladder --use-npm --example "https://github.com/ryanherkt3/nrl-live-ladder/tree/main"
npm install
```

### Local Development (NPM)

```bash
npm run dev
```

And browse to http://localhost:3000.

### Local Development (Docker)

Alternatively, if you would like to run the code in a Docker container, run the following commands:

```bash
docker build -t nrl-live-ladder .
docker run -p 3000:3000 nrl-live-ladder
```

To kill the container, in a new terminal run:
```bash
docker ps
docker container stop {id}
```
Where `{id}` is the ID of the container currently running.

### Tests

Test coverage has been added to this project. To run the entire test suite, use one of the following commands:
```bash
npm test
```
```bash
jest
```

### Website Features

* Full support for all major NRL-affiliated competitions - see the live ladder for the NRL, NRL Womens, NSW Cup, or Q Cup competitions.
* Live ladder & fixtures - automatic updates of the ladder and fixtures as they happen, so you don't have to refresh the page.
* "No Byes" ladder - use the toggles at the top of the live ladder page to view the ladder as if bye points counted for nothing.
* Live "max points" page - see how high (or low) your team can finish on the ladder with a visual chart (or table if on mobile) showing where each team stands in the race for Finals Football.
* Ladder predictor - predict the outcome of matches and see how your predictions affect the ladder.

### Future improvements

* Add integration and E2E test coverage.
* Make `SWR` requests on the main page once a minute instead of infrequently.
* Include the ability to save/load predictions to/from a JSON file.
* Add support for finals football predictions.

### Bug reports, Feature requests

For any bugs or feature requests, create an issue on the repo's [Issues page](https://github.com/ryanherkt3/nrl-live-ladder/issues) with the appropriate label.