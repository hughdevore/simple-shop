# Simple Shop

## Challenge
Senior Engineer Code Challenge

### Assignment
We’d like you to build a simple shopping cart experience that includes a small set
of features and functions on both desktop and mobile. We are not concerned with completeness
but rather code quality and thoughtfulness in the code.

Please reach out with any clarifying questions!

### Technical Requirements
- Your Shopping cart should have a frontend, backend, and database (We want to see
data being persisted, and not stored in local storage or a JSON file)
- Your entire application should be dockerized
- Include Unit tests
- Include a detailed README that includes instructions on how to launch your dockerized
application.
  - There should not be any global dependency requirements other than Docker.
  - Please test it out on a clean clone of your repo with all the relevant Docker
containers deleted; we will not debug the app if it doesn't work out of the box

### Feature Requirements
- The user should:
  - see an empty cart message on their first interaction with the page
  - be able to add items to their cart
  - See an updated list of cart items upon adding items to their cart
  - be able to change the quantity of each cart item in their cart
  - see a cart summary or totals block on the page

### Considerations
- This is your chance to show us your skills and exploit your strengths. If you are a
back-end focused programmer, you should focus more of your time there and
vice-versa.
Note:
- If invited for an onsite interview, be prepared to demo your application and talk through
your design decisions.

## Tech Stack
- React
- ExpressJS
- NodeJS
- PostgreSQL

## Prep
If you haven't already, install Docker and npm.

_Note: check the end of this Readme for Docker instructions._

_If you're using Windows 10 Home, there are important notes there too_

We need the node_modules folders locally, so after downloading this repo, first run
```
cd server && npm install && cd ..
cd frontend && npm install && cd ..
```

To run & develop the applications, run:
```
docker-compose up —-build
# or for windows 10 home, use this instead:
# docker-compose -f docker-compose.yaml -f docker-compose.win10.yaml up --build
```
The Express & React app will live reload on each file save.

To stop the app & erase the database, run:
```
docker-compose down
```

For macOS, Windows 10 Pro:

_The Express app is running at http://localhost:3100_

_The React SPA is running at http://localhost:3000_


For Windows 10 Home:

_The Express app is running at http://192.168.99.100:3100_

_The React SPA is running at http://192.168.99.100:3000_


## Database Access
To access the app database:
`psql postgres://user:pass@localhost:35432/db`

The test database can be accessed via:
`psql postgres://user:pass@localhost:35432/db_test`

## Tests
In order to access the test database during your testing you need to run these commands from within the docker container. This can be done by running: 

`docker-compose run server bash`

Both the server and frontend directories can be tested by running `yarn test` within either directory.

## Appendix: Docker
Docker will allow you to create the nodejs app, database, and front end in one line,
`docker-compose up`. The provided docker-compose.yaml file already has many things done for you
already - networking, db credentials, live code reload for the express and react apps, etc).

### Installing Docker - macOS and Windows 10 Pro
macOS, Windows 10 Pro: https://www.docker.com/products/docker-desktop
(This includes Docker and docker-compose)

Running the app
```
docker-compose up --build
```

### Installing Docker - Windows 10 Home
Windows 10 Home: https://docs.docker.com/toolbox/toolbox_install_windows/
(This includes Docker and docker-compose)

Running the app

_Note: If you're using Windows 10 Home, run the app with the follow command instead_
```
docker-compose -f docker-compose.yaml -f docker-compose.win10.yaml up --build
```

Docker Toolbox has a few differences from Docker Desktop, which that file takes care of for you.

Additionally
- Instead of http://localhost:3000, the front end is available at http://192.168.99.100:3000
- Instead of http://localhost:3100, the server API is available at http://192.168.99.100:3100
- For volumes to work, your code must be in a sub-folder of C:/Users/ (https://docs.docker.com/toolbox/toolbox_install_windows/#optional-add-shared-directories)
