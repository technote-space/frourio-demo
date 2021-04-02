#!/bin/bash

set -e

mysql=( mysql --protocol=socket -uroot -hlocalhost -p"${MYSQL_ROOT_PASSWORD}" )
echo "GRANT CREATE, ALTER, DROP, REFERENCES ON *.* TO '"$MYSQL_USER"'@'%' ;" | "${mysql[@]}"
echo 'FLUSH PRIVILEGES ;' | "${mysql[@]}"
