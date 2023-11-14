import mysql.connector
from config.config import ConfigLoader

class DatabaseConnector:
    def __init__(self):
        self.connection = None

    def connect(self):
        try:
            config = ConfigLoader.load_config()
            self.connection = mysql.connector.connect(
                host=config.get('DATABASE_HOST', ''),
                user=config.get('DATABASE_USERNAME', ''),
                password=config.get('DATABASE_PASSWORD', ''),
                database=config.get('DATABASE_SCHEMA', '')
            )
            if self.connection.is_connected():
                print("Conexión establecida a la base de datos")
        except mysql.connector.Error as error:
            print("Error al conectarse a la base de datos:", error)

    def close(self):
        if self.connection and self.connection.is_connected():
            self.connection.close()
            print("Conexión cerrada")

    def get_params(self):
        params = {}
        if not self.connection or not self.connection.is_connected():
            self.connect()
        if self.connection and self.connection.is_connected():
            try:
                cursor = self.connection.cursor()
                query = "SELECT * FROM parameter"
                cursor.execute(query)
                results = cursor.fetchall()
                for row in results:
                    params[row[1]] = row[2]
                return params
            except mysql.connector.Error as error:
                print("Error al obtener parámetros:", error)
            finally:
                if cursor:
                    cursor.close()
                self.close()
        return params
