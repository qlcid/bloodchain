# Hyperledger Fabric, node.js 체인코드, 웹 연동 구축 가이드
* Hyperledger Fabric, express(Node.js), sdk(Node.js) 연동한 웹 서비스 구축
* chaincode : Go 언어가 아닌 javascript(Node.js) 사용
* fabric sdk : Node.js 사용
* 상태 db : couchdb 
* fabric 공식 sample의 byfn 기반 네트워크 구축

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
* Hyperledger Fabric v1.4.3
* 
### 1. Docker CE 설치
---------------
다음의 명령어들을 한 줄씩 실행

``` sh
~$ sudo apt update
~$ sudo apt install apt-transport-https ca-certificates curl software-properties-common
~$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add
~$ sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
~$ sudo apt update
~$ apt-cache policy docker-ce
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
~$ sudo apt install docker-ce
```

잘 설치되었는지 확인
``` sh
~$ sudo docker version

Client: Docker Engine - Community
 Version:           19.03.4
 API version:       1.40
 Go version:        go1.12.10
 Git commit:        9013bf583a
 Built:             Fri Oct 18 15:54:09 2019
 OS/Arch:           linux/amd64
 Experimental:      false

Server: Docker Engine - Community
 Engine:
  Version:          19.03.4
  API version:      1.40 (minimum version 1.12)
  Go version:       go1.12.10
  Git commit:       9013bf583a
  Built:            Fri Oct 18 15:52:40 2019
  OS/Arch:          linux/amd64
  Experimental:     false
(생략)
```

사용자 docker 그룹에 추가 (sudo 없이 docker 명령어 실행하기 위함)
``` sh
~$ sudo usermod -aG docker <사용자id>
```
재로그인 후 확인
``` sh
~$ docker image

Usage:	docker image COMMAND

Manage images
(생략)
```
### 2. Docker-Compose 설치
---------------
설치
``` sh
~$ sudo apt -y install docker-compose
```
확인
``` sh
~$ docker compose version

docker-compose version 1.17.1, build unknown
docker-py version: 2.5.1
CPython version: 2.7.15+
OpenSSL version: OpenSSL 1.1.1  11 Sep 2018
```

### 3. 파이썬 2.7 설치
---------------
설치되어 있는지 확인
``` sh
~$ python -V

Python 2.7.15+
```
설치 안돼있다면 설치
``` sh
~$ sudo apt -y install python
```
### 4. Node.js, npm 설치
---------------
설치
``` sh
~$ curl -sL https://deb.nodesource.com/setup_8.x | sudo bash -
~$ sudo apt install nodejs
```
확인
``` sh
~$ node -v

v8.16.2
```
``` sh
~$ npm -v

6.4.1
```
### 5. Hyperledger Fabric 도커 이미지 설치 (현재 디폴트 설치 버전 : 1.4.3)
---------------
설치
``` sh
~$ curl -sSL http://bit.ly/2ysbOFE | bash -s
```
패브릭 명령어 디렉터리(bin) path 설정
``` sh
~$ cd fabric-samples
~/fabric-samples$ ls bin
configtxgen    cryptogen  fabric-ca-client  orderer configtxlator  discover  idemixgen  peer
```
```sh
~/fabric-samples$ echo 'export PATH=$PATH:$HOME/fabric-samples/bin' >> ~/.profile
~/fabric-samples$ source ~/.profile
```
패브릭 도커 컨테이너 설치 확인
``` sh
~/fabric-samples$ docker images
REPOSITORY                     TAG                 IMAGE ID            CREATED             SIZE
hyperledger/fabric-tools       1.4.3               18ed4db0cd57        2 months ago        1.55GB
hyperledger/fabric-tools       latest              18ed4db0cd57        2 months ago        1.55GB
hyperledger/fabric-ca          1.4.3               c18a0d3cc958        2 months ago        253MB
hyperledger/fabric-ca          latest              c18a0d3cc958        2 months ago        253MB
hyperledger/fabric-ccenv       1.4.3               3d31661a812a        2 months ago        1.45GB
hyperledger/fabric-ccenv       latest              3d31661a812a        2 months ago        1.45GB
hyperledger/fabric-orderer     1.4.3               b666a6ebbe09        2 months ago        173MB
hyperledger/fabric-orderer     latest              b666a6ebbe09        2 months ago        173MB
hyperledger/fabric-peer        1.4.3               fa87ccaed0ef        2 months ago        179MB
hyperledger/fabric-peer        latest              fa87ccaed0ef        2 months ago        179MB
hyperledger/fabric-javaenv     1.4.3               5ba5ba09db8f        2 months ago        1.76GB
hyperledger/fabric-javaenv     latest              5ba5ba09db8f        2 months ago        1.76GB
hyperledger/fabric-zookeeper   0.4.15              20c6045930c8        7 months ago        1.43GB
hyperledger/fabric-zookeeper   latest              20c6045930c8        7 months ago        1.43GB
hyperledger/fabric-kafka       0.4.15              b4ab82bbaf2f        7 months ago        1.44GB
hyperledger/fabric-kafka       latest              b4ab82bbaf2f        7 months ago        1.44GB
hyperledger/fabric-couchdb     0.4.15              8de128a55539        7 months ago        1.5GB
hyperledger/fabric-couchdb     latest              8de128a55539        7 months ago        1.5GB

```
## 구축 메뉴얼

### 1. 작업 디렉터리 구성
------------

* bloodchain
    * expressApp
    * fabric
        * blood-network
            * 네트워크 구성 파일들 (yaml)
        * chaincode
            * javascript
        * nodejs-sdk
        * startNetwork.sh

위와 같이 fabric 관련 리소스들이 담길 fabric 디렉터리 안에 
fabric 네트워크 구성을 위한 yaml 파일이 담길 blood-network 디렉터리,
javascript chaincode를 위한 chaincode 디렉터리,
skd for node.js를 위한 nodejs-sdk 디렉터리
로 구성되어 있다.

blood-network로 docker에 올라가는 노드들은 다음과 같이 구성된다.<br>
org1 : peer0.org1.example.com, peer1.org1.example.com (admin1, user1)<br>
org2 : peer0.org2.example.com, peer1.org2.example.com (admin2, user2)<br>
(nodejs-sdk에서 각 조직별로 admin과 user을 생성해 user를 통해 네트워크에 접근할 수 있게 한다.)<br>
orderer : orderer.example.com<br>
cli (명령어줄 인터페이스)

먼저 작업할 fabric 디렉터리 생성
```sh
~/fabric-samples$ cd ..
~$ mkdir bloodchain && cd bloodchain && mkdir fabric && cd fabric
```
네트워크 구성파일들 생성(각자 커스터마이징한 파일들 가능, 본 가이드에서는 first-network 파일 이용)
프로젝트 주제에 맞게 blood-network로 수정해서 가져온다.
```sh
~/bloodchain/fabric$ cp -r ../../fabric-samples/first-network/ ./blood-network
```

현재 channel 이름이 mychannel로 설정되어있는데, 각자 app에 맞게 바꿔준다. 여기에선 bloodchannel로 바꿔준다. 바꾸기 위해 grep, sed 명령어를 이용해 모든 파일에 있는 mychannel을 찾아 변경한다.
```sh
grep "mychannel" * -rl | xargs sed -i 's/mychannel/bloodchannel/g'
```

couchdb 옵션으로 byfn 실행해 docker에 네트워크 up
```sh
~/bloodchain/fabric$ cd blood-network && ./byfn.sh up -a -n -s couchdb
```
다음과 같은 내용이 표시되면 성공
```
d orderer connections initialized
2019-10-29 07:07:39.906 UTC [channelCmd] update -> INFO 002 Successfully submitted channel update
===================== Anchor peers updated for org 'Org2MSP' on channel 'mychannel' ===================== 


========= All GOOD, BYFN execution completed =========== 


 _____   _   _   ____   
| ____| | \ | | |  _ \  
|  _|   |  \| | | | | | 
| |___  | |\  | | |_| | 
|_____| |_| \_| |____/  

```

chaincode 디렉터리가 생성된 것을 확인할 수 있다.
```sh
~/bloodchain/fabric/blood-network$ cd ..
~/bloodchain/fabric$ ls
blood-network  chaincode
```

```sh
~/bloodchain/fabric$ cd chaincode
~/bloodchain/fabric/chaincode$ sudo cp -r ../../../fabric-samples/chaincode/fabcar/javascript/ .
```
이후 javascript 안에 있는 fabcar.js의 파일 이름을 app에 맞게 바꾸고, 바꾼 파일과 index.js안에있는 fabcar을 모두 app에맞게 바꾼다. (본 프로젝트에서는 bloodchain으로 변경)<br>
바꾼 bloodchain.js (원래 fabcar.js)에 각자의 app에 맞게 체인코드를 작성한다. [Node.js 체인코드 개발 가이드](https://lab.hanium.or.kr/19-p398/bloodchain/blob/master/Node.js%20%EC%B2%B4%EC%9D%B8%EC%BD%94%EB%93%9C%20%EA%B0%80%EC%9D%B4%EB%93%9C.md)

체인코드를 다음과 같이 환경변수 설정하여 4개의 피어에 설치한다.
```sh
export CONFIG_ROOT=/opt/gopath/src/github.com/hyperledger/fabric/peer
export ORG1_MSPCONFIGPATH=${CONFIG_ROOT}/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export ORG1_TLS_ROOTCERT_FILE=${CONFIG_ROOT}/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export ORG2_MSPCONFIGPATH=${CONFIG_ROOT}/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export ORG2_TLS_ROOTCERT_FILE=${CONFIG_ROOT}/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
export ORDERER_TLS_ROOTCERT_FILE=${CONFIG_ROOT}/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
```

peer0.org1에 설치
```sh
docker exec \
  -e CORE_PEER_LOCALMSPID=Org1MSP \
  -e CORE_PEER_ADDRESS=peer0.org1.example.com:7051 \
  -e CORE_PEER_MSPCONFIGPATH=${ORG1_MSPCONFIGPATH} \
  -e CORE_PEER_TLS_ROOTCERT_FILE=${ORG1_TLS_ROOTCERT_FILE} \
  cli \
  peer chaincode install \
    -n bloodchain \
    -v 1.0 \
    -p "/opt/gopath/src/github.com/chaincode/javascript" \
    -l "node"
2019-11-13 05:14:08.567 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 001 Using default escc
2019-11-13 05:14:08.567 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 002 Using default vscc
2019-11-13 05:14:09.181 UTC [chaincodeCmd] install -> INFO 003 Installed remotely response:<status:200 payload:"OK" > 

```

peer1.org1에 설치
```sh
docker exec \
  -e CORE_PEER_LOCALMSPID=Org1MSP \
  -e CORE_PEER_ADDRESS=peer1.org1.example.com:8051 \
  -e CORE_PEER_MSPCONFIGPATH=${ORG1_MSPCONFIGPATH} \
  -e CORE_PEER_TLS_ROOTCERT_FILE=${ORG1_TLS_ROOTCERT_FILE} \
  cli \
  peer chaincode install \
    -n bloodchain \
    -v 1.0 \
    -p "/opt/gopath/src/github.com/chaincode/javascript" \
    -l "node"
2019-11-13 05:16:06.780 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 001 Using default escc
2019-11-13 05:16:06.780 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 002 Using default vscc
2019-11-13 05:16:06.846 UTC [chaincodeCmd] install -> INFO 003 Installed remotely response:<status:200 payload:"OK" > 

``` 

peer0.org2에 설치
```sh
docker exec \
  -e CORE_PEER_LOCALMSPID=Org2MSP \
  -e CORE_PEER_ADDRESS=peer0.org2.example.com:9051 \
  -e CORE_PEER_MSPCONFIGPATH=${ORG2_MSPCONFIGPATH} \
  -e CORE_PEER_TLS_ROOTCERT_FILE=${ORG2_TLS_ROOTCERT_FILE} \
  cli \
  peer chaincode install \
    -n bloodchain \
    -v 1.0 \
    -p "/opt/gopath/src/github.com/chaincode/javascript" \
    -l "node"
2019-11-13 05:16:06.780 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 001 Using default escc
2019-11-13 05:16:06.780 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 002 Using default vscc
2019-11-13 05:16:06.846 UTC [chaincodeCmd] install -> INFO 003 Installed remotely response:<status:200 payload:"OK" > 
```

peer1.org2에 설치
```sh
docker exec \
  -e CORE_PEER_LOCALMSPID=Org2MSP \
  -e CORE_PEER_ADDRESS=peer1.org2.example.com:10051 \
  -e CORE_PEER_MSPCONFIGPATH=${ORG2_MSPCONFIGPATH} \
  -e CORE_PEER_TLS_ROOTCERT_FILE=${ORG2_TLS_ROOTCERT_FILE} \
  cli \
  peer chaincode install \
    -n bloodchain \
    -v 1.0 \
    -p "/opt/gopath/src/github.com/chaincode/javascript" \
    -l "node"
2019-11-13 05:16:06.780 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 001 Using default escc
2019-11-13 05:16:06.780 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 002 Using default vscc
2019-11-13 05:16:06.846 UTC [chaincodeCmd] install -> INFO 003 Installed remotely response:<status:200 payload:"OK" > 

```
install 후 앵커피어인 peer0.org1.example.com에 instantiate를 한다. -C 엔 채널이름, -n은 체인코드 이름이 들어간다.

```sh
docker exec \
  -e CORE_PEER_LOCALMSPID=Org1MSP \
  -e CORE_PEER_MSPCONFIGPATH=${ORG1_MSPCONFIGPATH} \
  cli \
  peer chaincode instantiate \
    -o orderer.example.com:7050 \
    -C bloodchannel \
    -n bloodchain \
    -l "node" \
    -v 1.0 \
    -c '{"Args":[]}' \
    -P "AND('Org1MSP.member','Org2MSP.member')" \
    --tls \
    --cafile ${ORDERER_TLS_ROOTCERT_FILE} \
    --peerAddresses peer0.org1.example.com:7051 \
    --tlsRootCertFiles ${ORG1_TLS_ROOTCERT_FILE}
2019-11-13 06:31:57.134 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 001 Using default escc
2019-11-13 06:31:57.134 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 002 Using default vscc

```

모든 peer에 대해 다음 요청될 트랜잭션을 위해 initLedger로 초기화 트랜잭션을 요청한다. (시간 다소 소요)
```sh
docker exec \
  -e CORE_PEER_LOCALMSPID=Org1MSP \
  -e CORE_PEER_MSPCONFIGPATH=${ORG1_MSPCONFIGPATH} \
  cli \
  peer chaincode invoke \
    -o orderer.example.com:7050 \
    -C bloodchannel \
    -n bloodchain \
    -c '{"function":"initLedger","Args":[]}' \
    --waitForEvent \
    --tls \
    --cafile ${ORDERER_TLS_ROOTCERT_FILE} \
    --peerAddresses peer0.org1.example.com:7051 \
    --peerAddresses peer1.org1.example.com:8051 \
    --peerAddresses peer0.org2.example.com:9051 \
    --peerAddresses peer1.org2.example.com:10051 \
    --tlsRootCertFiles ${ORG1_TLS_ROOTCERT_FILE} \
    --tlsRootCertFiles ${ORG1_TLS_ROOTCERT_FILE} \
    --tlsRootCertFiles ${ORG2_TLS_ROOTCERT_FILE} \
    --tlsRootCertFiles ${ORG2_TLS_ROOTCERT_FILE}
2019-11-13 06:41:05.280 UTC [chaincodeCmd] ClientWait -> INFO 001 txid [405dfd0e3c2c04061e50faef6bc1bf2963cfe62fb1d3b9c58ec1f17fa11bc4df] committed with status (VALID) at peer0.org2.example.com:9051
2019-11-13 06:41:05.387 UTC [chaincodeCmd] ClientWait -> INFO 002 txid [405dfd0e3c2c04061e50faef6bc1bf2963cfe62fb1d3b9c58ec1f17fa11bc4df] committed with status (VALID) at peer1.org2.example.com:10051
2019-11-13 06:41:05.412 UTC [chaincodeCmd] ClientWait -> INFO 003 txid [405dfd0e3c2c04061e50faef6bc1bf2963cfe62fb1d3b9c58ec1f17fa11bc4df] committed with status (VALID) at peer0.org1.example.com:7051
2019-11-13 06:41:05.426 UTC [chaincodeCmd] ClientWait -> INFO 004 txid [405dfd0e3c2c04061e50faef6bc1bf2963cfe62fb1d3b9c58ec1f17fa11bc4df] committed with status (VALID) at peer1.org1.example.com:8051
2019-11-13 06:41:05.427 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 005 Chaincode invoke successful. result: status:200 

```