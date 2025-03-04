#!/bin/bash
# Ensure we are in the right directory
cd /home/site/wwwroot

# Activate virtual environment
source antenv/bin/activate

# Run Gunicorn with the correct module path
exec gunicorn -w 4 -b 0.0.0.0:8000 services.prima_pizza.app:app
