# ============================================================
# Scholarship Management — Node.js + Python
# ============================================================

FROM node:18-bookworm-slim

WORKDIR /app

# ------------------------------------------------------------
# Install Python
# ------------------------------------------------------------
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       python3 \
       python3-pip \
       python3-venv \
    && rm -rf /var/lib/apt/lists/*

# ------------------------------------------------------------
# Node.js dependencies
# ------------------------------------------------------------
COPY Agent1/package*.json ./Agent1/

WORKDIR /app/Agent1
RUN npm install --omit=dev
# RUN npm ci --omit=dev

# ------------------------------------------------------------
# Python dependencies
# ------------------------------------------------------------
WORKDIR /app

COPY requirements-python.txt ./

RUN python3 -m venv /opt/venv \
    && /opt/venv/bin/pip install --no-cache-dir --upgrade pip \
    && /opt/venv/bin/pip install --no-cache-dir -r requirements-python.txt

# Make the Python virtual environment available as `python`
ENV PATH="/opt/venv/bin:$PATH"

# ------------------------------------------------------------
# Application source
# ------------------------------------------------------------
COPY Agent1/ ./Agent1/
COPY Agent2/ ./Agent2/
COPY Agent3/ ./Agent3/
COPY Agent1/scrape_scholarships.py ./Agent1/
# COPY scrape_scholarships.py ./

# ------------------------------------------------------------
# Application port
# ------------------------------------------------------------
EXPOSE 3333

# ------------------------------------------------------------
# Start Node.js application
# ------------------------------------------------------------
CMD ["node", "Agent1/server.js"]
