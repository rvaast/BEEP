#!/bin/bash

echo "Chose git installation directory after lamp installation."
echo "(Default will be /var/www/BEEP)"
echo "(Directory must be empty)"
read repPath

echo "Customized installation ? [y/N]"
read custom

if [[ $custom == [Yy] ]]
then
	echo -e "\nDatabase name mysql (default & recommanded : bee_data)"
	read dbName
	echo -e "\nDatabase user mysql (default : admin)"
	read dbUser
	echo -e "\nDatabase pasword mysql (default : admin)\e[8m"
	read dbPwd
	echo -e "\n\e[0mDatabase name influx (default & recommanded : bee_data)"
	read idbName
	echo -e "\nDatabase user influx (default : admin)"
	read idbUser
	echo -e "\nDatabase password influx (default : admin)\e[8m"
	read idbPwd
	echo -e "\n\e[0m"
else
	dbName='bee_data'
	dbUser='admin'
	dbPwd='admin'
	idbName='bee_data'
	dbUser='admin'
	dbPwd='admin'
fi

if [ -z "$repPath" ] 
then
	repPath="/var/www/BEEP"
fi

mkdir $repPath

cd $repPath || continue

sudo apt-get -y install git
sudo apt update -y
sudo apt upgrade -y
sudo apt-get install -y php php-curl php-mbstring php-mysql php-xml

sudo apt install -y \
	apache2 \
	libapache2-mod-php \
	mariadb-common \
	mariadb-server \
	mariadb-client \
	nodejs \
	phpmyadmin

sudo apt-get update --fix-missing -y
sudo apt-get install php-gd -y

sudo a2enmod ssl
sudo a2enmod rewrite
sudo service apache2 restart

sudo apt-get install -y composer

sudo apt-get install -y php-zip

sudo apt-get install -y redis-server

sudo apt-get install -y mysql-server
sudo mysql_secure_installation
sudo apt-get install -y influxdb
sudo apt-get install -y influxdb-client
sudo service influxdb start

sudo apt-get install parted -y

sudo apt update -y
sudo apt upgrade -y

git clone https://github.com/beepnl/BEEP.git $repPath

sudo partprobe
cd $repPath

sudo mysql -u root -e "CREATE DATABASE "$dbName";"
sudo mysql -u root -e "CREATE USER '"$dbUser"'@'%' IDENTIFIED BY '"$dbPwd"';"
sudo mysql -u root -e "GRANT ALL PRIVILEGES ON "$dbName".* TO '"$dbUser"'@'%';"
sudo mysql -u root -e "SET GLOBAL log_bin_trust_function_creators = 1;"

sudo influx -execute "CREATE USER "$idbUser" WITH PASSWORD '"$idbPwd"' WITH ALL PRIVILEGES"
sudo influx -execute "CREATE DATABASE "$idbName

if [ ! -f '.env' ]; then cp .env.example .env; fi

sudo sed -i 's/DB_DATABASE=.*/DB_DATABASE='$dbName'/g' .env
sudo sed -i 's/DB_USERNAME=.*/DB_USERNAME='$dbUser'/g' .env
sudo sed -i 's/DB_PASSWORD=.*/DB_PASSWORD='$dbPwd'/g' .env
sudo sed -i 's/LARAVEL_INFLUX_PROVIDER_DATABASE=.*/LARAVEL_INFLUX_PROVIDER_DATABASE='$idbName'/g' .env
sudo sed -i 's/LARAVEL_INFLUX_PROVIDER_USER=.*/LARAVEL_INFLUX_PROVIDER_USER='$idbUser'/g' .env
sudo sed -i 's/LARAVEL_INFLUX_PROVIDER_PASSWORD=.*/LARAVEL_INFLUX_PROVIDER_PASSWORD='$idbPwd'/' .env

php_ver=$(php -r "echo PHP_VERSION;")

sudo sed -i 's/7.1.25/'$php_ver'/g' ./composer.json

sudo sed -i 's/NO_AUTO_CREATE_USER//g' ./config/database.php

# backup data before update
read -p "Backup MySQL and Influx database (y/N)? " backup_db

if [ "$backup_db" = "y" ]; then
        echo "Backing up the databases..."
        ./backup.sh
fi
composer install && sudo chmod -R 777 storage && sudo chmod -R 777 bootstrap/cache && php artisan migrate  && php artisan storage:link

php artisan key:generate

echo "Creating apache vhosts ? [y/N]"
read apVhosts

if [[ $apVhosts == [Yy] ]]
then
	sudo rm -f /etc/apache2/sites-enabled/api.beep.nl.conf
	sudo rm -f /etc/apache2/sites-enabled/app.beep.nl.conf
	echo -e "\nYour domain"
	read userDomain
	echo -e "<VirtualHost api."$userDomain":80>\n\tDocumentRoot "$repPath"/public\n\tServerName \"api."$userDomain"\"\n\t<Directory "$repPath"/public/>\n\t\tOptions Indexes FollowSymLinks MultiViews\n\t\tAllowOverride All\n\t\tOrder allow,deny\n\t\tallow from all\n\t</Directory>\n</VirtualHost>" > /etc/apache2/sites-available/api.beep.nl.conf
	echo -e "<VirtualHost app."$userDomain":80>\n\tDocumentRoot "$repPath"/public/app\n\tServerName \"app."$userDomain"\"\n\t<Directory "$repPath"/public/app/>\n\t\tOptions Indexes FollowSymLinks MultiViews\n\t\tAllowOverride All\n\t\tOrder allow,deny\n\t\tallow from all\n\t</Directory>\n</VirtualHost>" > /etc/apache2/sites-available/app.beep.nl.conf
	sudo a2ensite api.beep.nl.conf
	sudo a2ensite app.beep.nl.conf
	sudo service apache2 restart
fi

echo -e "\e[91m\e[1m\nYour beep app is accessible at api."$userDomain"/webapp#!/login right now !\e[0m\n"
echo -e "\e[91m\e[1mYou should keep in mind that .env file is not fully configured.\e[0m\n"
echo -e "\e[91m\e[1mIt misses smtp, TTN and other things not essentials to get the app working.\n"
