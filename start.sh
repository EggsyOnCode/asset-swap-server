#!/bin/bash

# Start auth service
npm run start:dev auth &

# Start assets service
npm run start:dev assets &

# Start orders service
npm run start:dev orders &

echo "All microservices started successfully."

# Keep the script running indefinitely
while true; do
    sleep 1
done
