import mysql.connector
from yml_config_loader import load_config

# Configura las credenciales


def get_params():
    params = {}  # Crea un diccionario vacío para almacenar los resultados

    try:
        config = load_config()
        
        connection = mysql.connector.connect(
            host = config.get('DATABASE_HOST', ''),
            user = config.get('DATABASE_USERNAME', ''),
            password = config.get('DATABASE_PASSWORD', ''),
            database = config.get('DATABASE_SCHEMA', '')
        )

        if connection.is_connected():
            print("Conexión establecida a la base de datos")
            cursor = connection.cursor()
            query = "SELECT * FROM parametro"
            cursor.execute(query)
            results = cursor.fetchall()
            
            for row in results:
                params[row[1]] = row[2]
                
            return params

    except mysql.connector.Error as error:
        print("Error al conectarse a la base de datos:", error)

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("Conexión cerrada")