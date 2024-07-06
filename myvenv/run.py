from flask import Flask
from flask_cors import CORS
from app.database import init_app
from app.views import *

app = Flask(__name__)

# Configurar la aplicación Flask
# app.config.from_pyfile('config/development.py')

# Inicializar la base de datos con la aplicación Flask
init_app(app)
# Permitir solicitudes desde cualquier origen
CORS(app)
# Permitir solicitudes desde un origen específico
# CORS(app, resources={r"/api/*": {"origins": "http://127.0.0.1:5000"}})

# Rutas para el CRUD de la entidad Registro
app.route('/', methods=['GET'])(index)
app.route('/api/registros/', methods=['POST'])(create_registro)
app.route('/api/registros/', methods=['GET'])(get_all_registros)
app.route('/api/registros/<int:registro_id>', methods=['GET'])(get_registro)
app.route('/api/registros/<int:registro_id>', methods=['PUT'])(update_registro)
app.route('/api/registros/<int:registro_id>', methods=['DELETE'])(delete_registro)

if __name__ == '__main__':
    app.run(debug=True)