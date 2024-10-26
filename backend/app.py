from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
import os

# Initialize Flask app
app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///friends.db'  # Example for SQLite
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize database
db = SQLAlchemy(app)



# Set up folder paths for serving static frontend files
frontend_folder = os.path.join(os.getcwd(), "..", "frontend")
dist_folder = os.path.join(frontend_folder, "dist")

# Ensure routes are imported after initializing app and db
import routes

#Serve static files from the frontend/dist folder under frontend
 

# Route to serve static files (frontend)
@app.route("/", defaults={"filename": ""})
@app.route("/<path:filename>")
def index(filename):
    if not filename:
        filename = "index.html"
    return send_from_directory(dist_folder, filename)

# Main application entry point
if __name__ == "__main__":
    # Print the routes for debugging purposes
    print(app.url_map)
    print("Running app on http://127.0.0.1:5000")
    
    # Run the Flask app with debug mode on
    app.run(debug=True)
