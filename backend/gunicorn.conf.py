import os
import multiprocessing

# Gunicorn config
bind = "0.0.0.0:" + str(os.getenv("PORT", "8000"))
workers = multiprocessing.cpu_count() * 2 + 1
timeout = 120
keepalive = 5
worker_class = "sync"
