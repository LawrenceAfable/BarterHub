# Step 1: Use the official Node.js image to build the React app
FROM node:18 AS build

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and install dependencies
COPY package.json package-lock.json /app/
RUN npm install

# Step 4: Copy the entire React app into the container
COPY . /app/

# Step 5: Build the React app for production
RUN npm run build

# Step 6: Use Nginx to serve the build
FROM nginx:alpine

# Step 7: Copy the build files from the build stage to Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Step 8: Expose port 80 (default for Nginx)
EXPOSE 80
