# ------------------------------------------------
# -- jrpg-verse: devcontainer
# ------------------------------------------------

# node.js
FROM node:17-buster-slim

# 日本時間に設定
ENV TZ Asia/Tokyo

WORKDIR /home/project

# # projectフォルダから
# COPY ./project/frontend/package*.json ./

# RUN apt-get -y update; \
#     apt-get -y upgrade; \
#     npm update; \
# # install from package.json
#     npm install

COPY ./docker/start.sh /start.sh
CMD ["/bin/bash", "/start.sh"]
