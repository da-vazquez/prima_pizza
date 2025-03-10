#!/bin/bash
# Install dependencies
./antenv/bin/pip install -r requirements.txt
chmod +x antenv/bin/python3
./antenv/bin/python3 -m services.prima_pizza.app