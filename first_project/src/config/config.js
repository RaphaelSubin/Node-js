export const config={
  "development": {
    "username": "postgres",
    "password": "postgres",
    "database": "sampleDataBase",
    "port": "8082",
    "host": "localhost",
    "dialect": "postgres"

  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
