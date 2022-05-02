pwd
rm -r ./public/uploads/*
dropdb -f strapi_db_development
createdb strapi_db_development --owner strapi_dbuser