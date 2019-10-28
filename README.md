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
<pre><code>sudo apt update</code></pre><br>
`sudo apt install apt-transport-https ca-certificates curl software-properties-common`<br>
`curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -`<br>
`sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"`<br>
`sudo apt update`<br>
`apt-cache policy docker-ce`<br>