import yaml

class ConfigLoader:
    @staticmethod
    def load_config():
        try:
            config_file = 'config/config.yml'
            with open(config_file, 'r') as archivo:
                config = yaml.safe_load(archivo)
            return config
        except FileNotFoundError:
            print(f"El archivo de configuración '{config_file}' no fue encontrado.")
            return {}
        except Exception as e:
            print(f"Error al cargar la configuración desde '{config_file}': {str(e)}")
            return {}

# Ejemplo de uso:
# config = ConfigLoader.load_config()
