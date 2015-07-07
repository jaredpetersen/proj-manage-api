# Project Management WebApp API
API for the Honors Thesis project management application

# Setup Steps
This is a brief overview of the steps that I used to start all of this backend stuff. This **will** need to be modified when it comes down to actually deploying everything; I'm just noting it down here so that I don't forget.
## Database
1. Set up MongoDB on a server.
2. Enter the command ``mongod`` to start up the database.
3. Note down the connection port listed in the output to configure the connection to the API.
4. Open up a new console tab and enter ``mongo`` to start the MongoDB console.
5. Enter ``use proj-manage`` in the MongoDB console to create a new database.
6. Enter ``db.projects.insert({name: "Project 1"})`` in the MongoDB console to insert a new item and officially instantiate the new database. This will later be deleted.

## API
1. Install NodeJS (on a different server in production)
2. Use the previously noted down database port to configure the database connection ([server.js Line 24](https://github.com/jaredpetersen/proj-manage-api/blob/master/server.js#L24)).
3. Start up the API by entering ``node server.js``
4. Send a GET request to http://localhost/projects/ and note down the id for the project that we created earlier.
5. Send a DELETE request to http://localhost/projects/idgoeshere to delete that project.
6. Now we have a clean slate, good to go!
