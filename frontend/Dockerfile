FROM node:18-slim

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./ 

# Install dependencies
RUN npm install

# Copy the rest of the frontend files
COPY . . 

# Build the frontend (if needed)
#RUN npm run build

# Expose the frontend port
EXPOSE 3000

# Start the frontend application
CMD ["npm", "run", "dev"]
