#!/bin/bash

sudo /opt/bitnami/ctlscript.sh stop apache
sudo /opt/bitnami/letsencrypt/lego --tls --email="pim@beep.nl" --domains="api.beep.nl" --domains="app.beep.nl" --domains="graph.beep.nl" --path="/opt/bitnami/letsencrypt" renew --days 90
sudo /opt/bitnami/ctlscript.sh start apache
