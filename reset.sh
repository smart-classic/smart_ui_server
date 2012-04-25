#!/bin/sh

DATABASE_NAME=smart-ui
DATABASE_USER=smart

echo Please enter the smart database password when asked...

dropdb -U $DATABASE_USER $DATABASE_NAME
createdb -U $DATABASE_USER -O $DATABASE_USER --encoding='utf8' $DATABASE_NAME

python manage.py syncdb
