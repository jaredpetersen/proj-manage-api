# Project Management WebApp API
API for the Honors Thesis project management application

# Endpoints
## Users
| Endpoint        | HTTP Verb | Description                  | Parameters                              |
| --------------- | --------- | ---------------------------- | --------------------------------------- |
| /users          | GET       | Retrieve a list of all users | None                                    |
| /users          | POST      | Create a new user            | username, firstname, lastname, password |
| /users/:userid  | GET       | Get a single user            | userid                                  |
| /users/:userid  | PUT       | Update a single user         | userid                                  |
| /users/:userid  | DELETE    | Delete a single user         | userid                                  |

## Projects
| Endpoint              | HTTP Verb | Description                     | Parameters                              |
| --------------------- | --------- | ------------------------------- | --------------------------------------- |
| /projects             | GET       | Retrieve a list of all projects | None                                    |
| /projects             | POST      | Create a new project            | name, description (optional), userid    |
| /projects/:projectid  | GET       | Get a single project            | projectid                               |
| /projects/:projectid  | PUT       | Update a single project         | projectid                               |
| /projects/:projectid  | DELETE    | Delete a single project         | projectid                               |
