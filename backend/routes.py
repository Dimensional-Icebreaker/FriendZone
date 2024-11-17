from flask import request, jsonify
from models import db, Room, Friend
from app import app, db  # Import app and db from app.py
from flask_mail import Mail, Message

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'dimensional.icebreaker@gmail.com' 
app.config['MAIL_PASSWORD'] = 'vfok eqkg svfu krbv' 
mail = Mail(app)

# Route to create a new room
@app.route('/api/rooms', methods=['POST'])
def create_room():
    data = request.json
    name = data.get('name')
    acess_password = data.get('access_password')
    admin_password = data.get('admin_password')
    email = data.get('email')  # Add email field from frontend input


    if not name or not acess_password or not admin_password:
        return jsonify({'error': 'Room name and password are required'}), 400
    
    new_room = Room(name=name, access_password=acess_password, admin_password=admin_password)
    db.session.add(new_room)
    db.session.commit()

    #Email continued....
    try:
        msg = Message(
            subject=f"Welcome to the FriendZone App! Make Friends, Have Fun!",
            sender=app.config['MAIL_USERNAME'],  # The sender's email from Flask-Mail config
            recipients=[email]
        )
        msg.body = (
            f"Hi,\n\nYour room '{name}' has been successfully created!\n"
            f"Access Password: {acess_password}\n"
            f"Admin Password: {admin_password}\n\n"
            "You can now use this room to collaborate with others.\n\nEnjoy!\n"
        )
        mail.send(msg)
    except Exception as e:
        return jsonify({'error': 'Room created, but failed to send email', 'details': str(e)}), 500
    #Email end....

    return jsonify(new_room.to_json()), 201


@app.route('/api/test', methods=['GET'])
def test_get():
    return jsonify({'message': 'GET request successful!'}), 200


# Route to verify room password
@app.route('/api/rooms/<int:room_id>/verify', methods=['POST'])
def verify_room_password(room_id):
    room = Room.query.get(room_id)
    if room is None:
        return jsonify({'error': 'Room not found'}), 404

    data = request.json
    password = data.get('access_password')

    if room.access_password != password:
        return jsonify({'error': 'Incorrect password'}), 401

    return jsonify(room.to_json()), 200

# Route to verify admin password
@app.route('/api/rooms/<int:room_id>/verify_admin_password', methods=['POST'])
def verify_admin_password(room_id):
    # Find the room by ID
    room = Room.query.get(room_id)
    if room is None:
        return jsonify({'error': 'Room not found'}), 404

    # Get the request data (expects admin_password to be passed in the body)
    data = request.json
    admin_password = data.get('admin_password')
    
    # Check if the provided admin password matches the room's admin password
    if room.admin_password == admin_password:
        return jsonify({'message': 'Admin password is correct'}), 200
    else:
        return jsonify({'error': 'Invalid admin password'}), 403

# Route to delete a room
@app.route('/api/rooms/<int:room_id>/delete', methods=['DELETE'])
def delete_room(room_id):
    # Find the room by ID
    room = Room.query.get(room_id)
    if room is None:
        return jsonify({'error': 'Room not found'}), 404

    try:
        # Delete the room from the database
        db.session.delete(room)
        db.session.commit()
        return jsonify({'message': 'Room deleted successfully'}), 200
    except Exception as e:
        # Handle any errors that occur during deletion
        return jsonify({'error': 'An error occurred while deleting the room'}), 500
    
# Route to fetch all rooms
@app.route('/api/rooms', methods=['GET'])
def rooms():
    rooms = Room.query.all()
    room_list = [room.to_json() for room in rooms]
    return jsonify(room_list), 200


# Route to fetch all friends in a specific room
@app.route('/api/rooms/<int:room_id>/friends', methods=['GET'])
def get_friends_in_room(room_id):
    room = Room.query.get(room_id)
    if room is None:
        return jsonify({'error': 'Room not found'}), 404

    return jsonify([friend.to_json() for friend in room.friends])

# Route to add a friend to a specific room
@app.route('/api/rooms/<int:room_id>/friends', methods=['POST'])
def add_friend_to_room(room_id):
    room = Room.query.get(room_id)
    if room is None:
        return jsonify({'error': 'Room not found'}), 404

    data = request.json
    name = data.get('name')
    role = data.get('role')
    description = data.get('description')
    gender = data.get('gender')

    if not all([name, role, description, gender]):
        return jsonify({'error': 'All fields are required'}), 400

    img_url = None
    if gender == 'male':
        img_url = f'https://avatar.iran.liara.run/public/boy?username={name}'
    elif gender == 'female':
        img_url = f'https://avatar.iran.liara.run/public/girl?username={name}'
    else:
        img_url=f'https://avatar.iran.liara.run'
    new_friend = Friend(name=name, role=role, description=description, gender=gender, img_url=img_url, room_id=room.id)

    db.session.add(new_friend)
    db.session.commit()

    return jsonify(new_friend.to_json()), 201

# Route to delete a friend in a specific room
@app.route("/api/rooms/<int:room_id>/friends/delete/<int:friend_id>", methods=["DELETE"])
def delete_friend_in_room(room_id, friend_id):
    try:
        room = Room.query.get(room_id)
        if room is None:
            return jsonify({"error": "Room not found"}), 404

        friend = Friend.query.filter_by(id=friend_id, room_id=room_id).first()
        if friend is None:
            return jsonify({"error": "Friend not found in this room"}), 404
        
        db.session.delete(friend)
        db.session.commit()
        return jsonify({"msg": "Friend deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Route to update a friend in a specific room
@app.route("/api/rooms/<int:room_id>/friends/update/<int:friend_id>", methods=["PATCH"])
def update_friend_in_room(room_id, friend_id):
    try:
        room = Room.query.get(room_id)
        if room is None:
            return jsonify({"error": "Room not found"}), 404

        friend = Friend.query.filter_by(id=friend_id, room_id=room_id).first()
        if friend is None:
            return jsonify({"error": "Friend not found in this room"}), 404
        
        data = request.json
        friend.name = data.get("name", friend.name)
        friend.role = data.get("role", friend.role)
        friend.description = data.get("description", friend.description)
        friend.gender = data.get("gender", friend.gender)

        db.session.commit()
        return jsonify(friend.to_json()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

