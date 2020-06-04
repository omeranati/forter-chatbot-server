# forter-chatbot-server

Handles all the messages that users send

### Prerequisites

* ```git clone``` this repository.
* Make sure you have [docker](https://www.docker.com/get-started) installed on your machine
* [Node.js](https://nodejs.org/en/download/) version ^10
* [npm](https://www.npmjs.com/get-npm) version ^6

### Installing

1. In the project dir, ```cd ./elasticsearch```
2. ```docker build . -t elasticsearch:1.0.0```
3. ```docker run -p 9200:2900 -p 9300:9300 -d elasticsearch:1.0.0```
4. ```cd ../```
5. ```npm install```
6. ```npm run start:dev```
