import mysql.connector

# Configura las credenciales
host = "database-1.cbtbx79jvpr1.us-east-2.rds.amazonaws.com"
username = "admin"
password = "trabajogrado"
database = "backend_gui_nodules"

def get_params():
    params = {}  # Crea un diccionario vacío para almacenar los resultados

    try:
        # Establece la conexión a la base de datos
        connection = mysql.connector.connect(
            host=host,
            user=username,
            password=password,
            database=database
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
