#!/bin/bash
chmod +x antenv/bin/python3
source antenv/bin/activate
./antenv/bin/python3 -m services.prima_pizza.app
