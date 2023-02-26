from server import db,app
def test_connection():
    with app.app_context():
        db.create_all()
test_connection()
