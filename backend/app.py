from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Database configuration
#app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///friends.db'  # Use to chnage it for SQLite once db expires

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///friends.db')  # fallback

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize database
db = SQLAlchemy(app)

# Create tables if they don't exist
with app.app_context():
    db.create_all()

# Set up folder paths for serving static frontend files
frontend_folder = os.path.join(os.getcwd(), "..", "frontend")
dist_folder = os.path.join(frontend_folder, "dist")

# Import routes after initializing app and db
import routes

# Serve static files from the frontend/dist folder
@app.route("/", defaults={"filename": ""})
@app.route("/<path:filename>")
def index(filename):
    if not filename:
        filename = "index.html"
    return send_from_directory(dist_folder, filename)

# Main application entry point
if __name__ == "__main__":
    # Print routes for debugging
    print(app.url_map)
    print("Running app on http://127.0.0.1:5000")

    # Run Flask app in debug mode (for development)
    app.run(debug=True)
