FROM node:21

# Set the working directory in the container
WORKDIR /app

# Copy all files from the current directory to the working directory
COPY . ./

# Install dependencies
RUN npm install

# Build the Next.js application
RUN npm run build

# Next.js collects telemetry data by default. The following ENV line opts out.
ENV NEXT_TELEMETRY_DISABLED 1

# Expose the port the app runs on
EXPOSE 3000

# Command to run your app using the Next.js start script
CMD ["npm", "start"]
