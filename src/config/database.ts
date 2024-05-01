import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('library_db', 'library_admin', 'library_admin_pw', {
    host: 'db', // This should match the service name in docker-compose.yml if using Docker
    dialect: 'postgres'
});

export default sequelize;
