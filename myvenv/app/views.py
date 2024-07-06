from flask import jsonify, request
from app.models import Registro

def index():
    return jsonify({'message': 'Hello World API Registro'})

def create_registro():
    data = request.json
    new_registro = Registro(Name=data['Name'], Email=data['Email'], Password=data['Password'], rol=data.get('rol', 'user'))
    new_registro.save()
    return jsonify({'message': 'Registro created successfully'}), 201

def get_all_registros():
    registros = Registro.get_all()
    return jsonify([registro.serialize() for registro in registros])

def get_registro(registro_id):
    registro = Registro.get_by_id(registro_id)
    if not registro:
        return jsonify({'message': 'Registro not found'}), 404
    return jsonify(registro.serialize())

def update_registro(registro_id):
    registro = Registro.get_by_id(registro_id)
    if not registro:
        return jsonify({'message': 'Registro not found'}), 404
    data = request.json
    registro.Name = data['Name']
    registro.Email = data['Email']
    registro.Password = data['Password']
    registro.rol = data.get('rol', 'user')
    registro.save()
    return jsonify({'message': 'Registro updated successfully'})

def delete_registro(registro_id):
    registro = Registro.get_by_id(registro_id)
    if not registro:
        return jsonify({'message': 'Registro not found'}), 404
    registro.delete()
    return jsonify({'message': 'Registro deleted successfully'})