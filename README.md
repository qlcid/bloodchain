#Hyperledger Fabric을 이용한 헌혈증 공유 서비스 구축
=========================================
Hyperledger Fabric, express(Node.js) 기반 웹 서비스 구축 가이드입니다.<br>
체인코드는 Go 언어가 아닌 javascript(Node.js)를 사용했고, fabric sdk 또한 Node.js를 사용했습니다.
## 개발환경
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

### Docker CE 설치
다음의 명령어들을 한 줄씩 실행
<pre><code>sudo apt update</code></pre><br>
`sudo apt install apt-transport-https ca-certificates curl software-properties-common`<br>
`curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -`<br>
`sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"`<br>
`sudo apt update`<br>
`apt-cache policy docker-ce`<br>

모두 실행하면 다음과 같은 메시지가 표시된다. 아직 도커가 설치되지 않았다는 뜻이다.
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
