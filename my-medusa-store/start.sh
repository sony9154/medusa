#!/bin/bash

# Run database migrations
npx medusa db:migrate

# Start the development server
npx medusa dev