### [project DBYM]

###### # 20180711 WED

- 개발 환경  
  React.js, Node.js(express) [세팅](https://www.youtube.com/watch?v=8bNlffXEcC0), mongoose(mlab)
- facebook login [(react-facebook-login)](https://www.npmjs.com/package/react-facebook-login)  
  [youtube 도움](https://www.youtube.com/watch?v=ea9KyE78qKI)
- backend를 통해서 화면에 보여줄게 아닌 이상 view engine(ejs, jade, etc..) 사용 할 필요가 없다!

###### # 20180712 THU

- facebook api 에서 친구 리스트에 접근하려면 해당 앨을 사용하는 친구들에게 제한적으로 접근할 수 있다.
- 개발중인데 이거 쓸 친구가 어디쪄... 는 앱 - 역할 - 테스트 사용자 에서 가짜친구들 만들 수 있음

###### # 20180716 MON

- 서버 요청에 대한 응답으로 무조건 한개만 가야 한다. 어떤 조건에 의해서라도 두개 이상의 응답이 갈 경우 에러!!

###### # 20180717 TUE

- spa에서 링크를 찾아가기 위해서는 index.js 에서 렌더링하는 컴포넌트(App.js)에 모든 컴포넌트의 정보가 있어야 한다.
- 서버사이드 렌더링을 위해서는 리덕스가 필수인 것인가...(눈물..)  [예제](https://velopert.com/3425)
- 연결된 스키마 사이에서 새로운 조합의 데이터가 필요할 경우, 서버쪽에서 데이터를 조합해서 가져오는게 좀 더 편할 때가 있다. 그럼 서버쪽에 요청을 한번만 보내면 되니까!! ㅇ.<
- 서버코드 작성할때 오타좀 작작내라..^^..쥬긴다..

###### # 20170718 WED

- DB schema 짤 때, 앞으로 뭐든 여러가지 경우의 상황을 고려해서 짜야함.  
  DB 연결성을 만들기 위해서는 oid로 저장하는것을 권장.  
  만약에 외부에서 주는 값을 key값 처럼 사용할 경우, 의존성이 높아지기 때문에 지양할 것.
- 서버와 연결을 주고받을때에는 무조건 응답을 꼭 확인해야함. json으로는 빈 객체 말고, 확인할 수 있는 값을 전송하도록.
- 몽구스 쿼리를 쓸때는 일반 콜백함수보다 프로미스를 사용하도록 하자!
- 서버 디버깅 : node --inspect ./bin/www
- 처음보는 모듈에 어떤 함수가 있는지 모를때는 디버깅에서 stop point 설정하고 해당 모듈 마우스오버하면 사용가능한 메소드들이 보인다..
- (오늘의 하이라이트) post /meetups/setloca 부분 : 2중 객체 내부의 값을 변경할 때, 값이 저장은 되지만 데이터베이스에 업데이트가 안되었는데, copy로 object 만들고 위에서 한 방식으로 set 함수 찾아서 해결함
- 비동기 중요!!!!! 비동기 요청으로 받아온 값으로 또 다음 작업을 해야할 때에는 함수 안에서 또 함수를 써야함...  
  그. 래. 서. 콜백지옥이 나오는거구나 ^^..

###### # 20170719 THU

- http://n1k0.github.io/kept/ 나중에 이거 참고해서 디자인 확장시키면 이쁠듯...ㅎㅅㅎ
- https://react.rocks/tag/Popup 리액트 팝업 참고
- 화면 요소때문에 배경이 다 보이지 않을 경우 height: 100vh (viewport height)를 주면 됨.  
  대신 다른 요소가 그 이상으로 렌더링 되면 화면 그 밑으로는 그려지지 않음.

###### # 20170720 FRI

- 