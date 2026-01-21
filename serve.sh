#!/bin/bash
# Simple script to serve the current directory
# Required because ES Modules (modules used in JS) need to be served via HTTP/HTTPS, not file:// protocol

echo "Starting local server at http://localhost:8000"
echo "Press Ctrl+C to stop"

# Check if python3 is available
if command -v python3 &> /dev/null; then
    python3 -m http.server 8000
    exit
fi

# Check if python is available
if command -v python &> /dev/null; then
    python -m SimpleHTTPServer 8000
    exit
fi

# Check if npx/serve is available (Node.js)
if command -v npx &> /dev/null; then
    npx serve .
    exit
fi

echo "Error: Neither Python nor Node.js found. Please install one to run a local server."
