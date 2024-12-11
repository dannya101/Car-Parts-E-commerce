# Pitstop Performance - CompE 561

The frontend, backend, and postgres db are dockerized making it simple to run the development server locally and eventually simplifying the process of deployment.

# Instructions for running development server

1. Make Sure Docker Desktop is running
2. Run the command "docker compose up -d --build" to start the docker containers
3. The website will now be running on your local machine using port 3000 for the front end and 8000 for the backend

# Notes on Operation

Docker will use a volume to save your image uploads in the ./uploads folder in the local machine allowing them to persist when the server restarts