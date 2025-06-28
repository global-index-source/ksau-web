# Stage 1: Build the application
FROM node:16-alpine AS BUILD_IMAGE

# Set working directory
WORKDIR /usr/app/

# Copy the entire project into the container
COPY . .

# Add build arguments
ARG NEXT_PUBLIC_LOCAL_API_ENDPOINT
ARG NEXT_PUBLIC_API_ENDPOINT

# Convert args to environment variables
ENV NEXT_PUBLIC_LOCAL_API_ENDPOINT=$NEXT_PUBLIC_LOCAL_API_ENDPOINT
ENV NEXT_PUBLIC_API_ENDPOINT=$NEXT_PUBLIC_API_ENDPOINT

# Install dependencies
RUN npm install

# Build the application
RUN npm run build

# Clean up unnecessary files (e.g., development dependencies)
RUN rm -rf node_modules

# Reinstall dependencies in production mode
RUN npm install --production

# Stage 2: Final image for running the application
FROM node:16-alpine

# Set environment variable for production
ENV NODE_ENV production

# Create a non-root user and group
RUN addgroup -g 1001 -S user_group \
    && adduser -u 1001 -S application -G user_group -s /bin/sh -D application

# Set working directory
WORKDIR /usr/app/

# Copy necessary files from the build stage
COPY --from=BUILD_IMAGE --chown=application:user_group /usr/app/node_modules ./node_modules
COPY --from=BUILD_IMAGE --chown=application:user_group /usr/app/package.json .
COPY --from=BUILD_IMAGE --chown=application:user_group /usr/app/package-lock.json .
COPY --from=BUILD_IMAGE --chown=application:user_group /usr/app/app ./app
COPY --from=BUILD_IMAGE --chown=application:user_group /usr/app/.next ./.next
COPY --from=BUILD_IMAGE --chown=application:user_group /usr/app/next.config.js .

# Expose the port used by the application (adjust as needed)
EXPOSE 3000

# Switch to the non-root user
USER application

# Command to start the application
CMD ["npm", "start"]