const {Sequelize} = require('sequelize')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const sequelize = new Sequelize(
    process.env.DATABASE_URL,
    {
        dialect: 'mysql',
        logging: false,
        dialectOptions: {
            ssl: {
                rejectUnauthorized: true,
            },
        },
        define: {
            underscored: true,
        },
    }
)

module.exports = sequelize
