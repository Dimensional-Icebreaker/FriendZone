from app import db

# Room Model
class Room(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    access_password = db.Column(db.String(100), nullable=False)
    admin_password = db.Column(db.String(100), nullable=False)
    friends = db.relationship('Friend', backref='room', lazy=True)

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'friends': [friend.to_json() for friend in self.friends]
        }


# Friend Model
class Friend(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    img_url = db.Column(db.String(200), nullable=True)
    room_id = db.Column(db.Integer, db.ForeignKey('room.id'), nullable=True)

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'role': self.role,
            'description': self.description,
            'gender': self.gender,
            'imgUrl': self.img_url,
            'room_id': self.room_id
        }
