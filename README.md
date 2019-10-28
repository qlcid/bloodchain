# Hyperledger Fabric을 이용한 헌혈증 공유 서비스 구축 
* Hyperledger Fabric, express(Node.js), sdk 연동한 웹 서비스 구축
* chaincode : Go 언어가 아닌 javascript(Node.js) 사용
* fabric sdk : Node.js 사용
## 개발환경 설정
* 가상머신
    * Oracle VM VirtualBox 6.0
* os
    * Ubuntu 18.04.2
* Docker
    * 17.06.2-ce 버전 이상
* Docker-Compose
    * 1.14.0 버전 이상
* Node.js
    * v8 : v8.9.4 이상
    * v10 : v10.15.3 이상
* npm
    * 5.5.1 이상
* python
    * 2.7
* Hyperledger Fabric v1.4
### Docker CE 설치
---------------
다음의 명령어들을 한 줄씩 실행

``` sh
$ sudo apt update
$ sudo apt install apt-transport-https ca-certificates curl software-properties-common
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add
$ sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
$ sudo apt update
$ apt-cache policy docker-ce
```

모두 실행하면 다음과 같은 메시지가 표시
``` sh
docker-ce:
  설치: (없음)
  후보: 5:19.03.4~3-0~ubuntu-bionic
  버전 테이블:
     5:19.03.4~3-0~ubuntu-bionic 500
        500 https://download.docker.com/linux/ubuntu bionic/stable amd64 Packages
     5:19.03.3~3-0~ubuntu-bionic 500
        500 https://download.docker.com/linux/ubuntu bionic/stable amd64 Packages
     5:19.03.2~3-0~ubuntu-bionic 500
        500 https://download.docker.com/linux/ubuntu bionic/stable amd64 Packages

```

다음 명령어를 통해 도커를 설치

``` sh
$ sudo apt install docker-ce
```

잘 설치돼었는지 확인
``` sh
$ sudo docker version
```

사용자 docker 그룹에 추가
``` sh
$ sudo usermod -aG docker <사용자id>
```
재로그인 후 확인
``` sh
$ docker image

Usage:	docker image COMMAND

Manage images
(생략)
```
### Docker-Compose 설치
---------------
설치
``` sh
$ sudo apt -y install docker-compose
```
확인
``` sh
$ docker compose version

docker-compose version 1.17.1, build unknown
docker-py version: 2.5.1
CPython version: 2.7.15+
OpenSSL version: OpenSSL 1.1.1  11 Sep 2018
```

### 파이썬 2.7 설치
---------------
설치돼 있는지 확인
``` sh
$ python -V

Python 2.7.15+
```
설치 안돼있다면 설치
``` sh
$ sudo apt -y install python
```
### Node.js, npm 설치
---------------
설치
``` sh
$ curl -sL https://deb.nodesource.com/setup_8.x | sudo bash -
$ sudo apt install nodejs
```
확인
``` sh
$ node -v

v8.16.2
```
``` sh
$ npm -v

6.4.1
```
### Docker CE 설치
---------------
### Docker CE 설치
---------------