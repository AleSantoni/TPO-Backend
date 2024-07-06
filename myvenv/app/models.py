from app.database import get_db

class Registro:
    
    def __init__(self, idRegistro=None, Name=None, Email=None, Password=None, rol='user'):
        self.idRegistro = idRegistro
        self.Name = Name
        self.Email = Email
        self.Password = Password
        self.rol = rol

    def save(self):
        db = get_db()
        cursor = db.cursor()
        if self.idRegistro:
            cursor.execute("""
                UPDATE registro SET Name = %s, Email = %s, Password = %s, rol = %s
                WHERE idRegistro = %s
            """, (self.Name, self.Email, self.Password, self.rol, self.idRegistro))
        else:
            cursor.execute("""
                INSERT INTO registro (Name, Email, Password, rol) VALUES (%s, %s, %s, %s)
            """, (self.Name, self.Email, self.Password, self.rol))
            self.idRegistro = cursor.lastrowid
        db.commit()
        cursor.close()

    @staticmethod
    def get_all():
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM registro")
        rows = cursor.fetchall()
        registros = [Registro(idRegistro=row[0], Name=row[1], Email=row[2], Password=row[3], rol=row[4]) for row in rows]
        cursor.close()
        return registros

    @staticmethod
    def get_by_id(registro_id):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM registro WHERE idRegistro = %s", (registro_id,))
        row = cursor.fetchone()
        cursor.close()
        if row:
            return Registro(idRegistro=row[0], Name=row[1], Email=row[2], Password=row[3], rol=row[4])
        return None

    def delete(self):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM registro WHERE idRegistro = %s", (self.idRegistro,))
        db.commit()
        cursor.close()

    def serialize(self):
        return {
            'idRegistro': self.idRegistro,
            'Name': self.Name,
            'Email': self.Email,
            'Password': self.Password,
            'rol': self.rol
        }
