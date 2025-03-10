import os
import multiprocessing

# Gunicorn config
bind = "0.0.0.0:8000"
workers = multiprocessing.cpu_count() * 2 + 1
timeout = 600
keepalive = 5
preload_app = True
worker_class = "sync"
