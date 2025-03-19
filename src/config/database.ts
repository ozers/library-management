import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('library_db', 'postgres', 'postgres', {
    host: 'db',
    dialect: 'postgres'
});

export default sequelize;
