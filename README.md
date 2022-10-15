![Logo](./Disatomic_Logo.png)
__<p align="center">A minimal online chat service, and provided both website and cross-platform desktop application with <a href="https://www.electronjs.org/">Electron</a>.</p>__

## Disatomic

- [Website](https://dis4tomic.com)
- [Front-End Repo](https://github.com/HackHow/Disatomic-React)
- [Demo Video](https://drive.google.com/file/d/1x9eUrFunTPjnNZyUa8nAw0Lkrj1JphJY/view)

## Table of Contents

- [Motivation](https://github.com/HackHow/Disatomic-server/tree/develop#Motivation)
- [Requirement](https://github.com/HackHow/Disatomic-server/tree/develop#Requirement)
- [Getting Started](https://github.com/HackHow/Disatomic-server/tree/develop#Getting Started)
- [Features](https://github.com/HackHow/Disatomic-server/tree/develop#Features)
- [How To Use](https://github.com/HackHow/Disatomic-server/tree/develop#How To Use)
- [Download]()
- [Implementation details of online notification mechanism]
- [Architecture](https://github.com/HackHow/Disatomic-server/tree/develop#Architecture)
- [Roadmap]()

## Motivation
I want to create a chat room that automatically stores files and links because the primary communication platform is Discord in the training camp, where students and teachers frequently share specific technical articles or files. Still, I can't find something quickly in the chat room when I want to find something. It is not easy to access files or web links that have already been sent.

## Requirement
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git/)
- [Node.js](https://nodejs.org/en/download/)
- [MongoDB Clusters](https://www.mongodb.com/atlas/database)

## Getting Started
```
# Clone front-end repository and back-end repository
$ git clone git@github.com:HackHow/Disatomic-React.git
$ git clone git@github.com:HackHow/Disatomic-server.git 

# Go into the repository
$ cd Disatomic-React
$ cd Disatomic-server

# Install dependencies
$ yarn install (front-end)
$ npm install (backe-end)

# Run the app
$ yarn start (front-end)
$ npm start (backe-end)
```
需要填入 mongodb 的 clusters 的 URI

## Features
- Stored automaitcally files and links in chat room
- Created Workspaces and channels
- Cross-platform desktop applications
- Identified text containing http or https and turn it into a link
- Previewed user-uploaded images
- Real-time notification mechanism

## How To Use
Provide three sets of test accounts to users. Through these test accounts, you can add friends and private messages and create multi-person chat rooms. In addition, users can also register a new account.

_user1_
```
email: demo1@test.com
password: 123456
```
_user2_
```
email: demo2@test.com
password: 654321
```
_user3_
```
email: demo3@test.com
password: abcdef
```

## Download
Users can download the latest installable version of Disatomic for Windows and macOS. 

## Architecture
