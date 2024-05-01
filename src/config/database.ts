import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('library_db', 'library_admin', 'library_admin_pw', {
    host: 'db',
    dialect: 'postgres'
});

export default sequelize;
