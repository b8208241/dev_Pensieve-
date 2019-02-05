const {envDbConnection} = require('./.env.json');

module.exports = {
  "development": {
    host:envDbConnection.host,
    username:envDbConnection.user,
    password:envDbConnection.password,
    database:envDbConnection.database,
    port: envDbConnection.port,
    dialect: "mysql",
    operatorsAliases: false,
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      freezeTableName: true
    }
  },
  "test": {
    host:envDbConnection.host,
    username:envDbConnection.user,
    password:envDbConnection.password,
    database:envDbConnection.database,
    port: envDbConnection.port,
    dialect: "mysql",
    operatorsAliases: false,
    define: {
      freezeTableName: true
    }
  },
  "production": {
    host:envDbConnection.host,
    username:envDbConnection.user,
    password:envDbConnection.password,
    database:envDbConnection.database,
    port: envDbConnection.port,
    dialect: "mysql",
    dialectOptions: {

    },
    operatorsAliases: false,
    define: {
      freezeTableName: true
    }
  }
}
