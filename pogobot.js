var preSender = null;
var preMsg = {};
var msgCnt = 0;

function getRespText(spId) {
  var respText = Utils.getWebText("https://spreadsheets.google.com/feeds/cells/"+spId+"/1/public/values?alt=json-in-script");
  respText = respText.substring(respText.indexOf("entry")+8).replace("]}});", "");
  
  var respArray = [];
  while (respText.indexOf("gs$cell") > -1) {
    var io1 = respText.indexOf("gs$cell");
    var io2 = respText.indexOf("}", io1);
    respArray.push(JSON.parse(respText.substring(io1+9, io2+1)));
    respText = respText.substring(io1+9);
  }
  
  var rowData = [];
  var allData = [];
  for (var i=0; i<respArray.length; i++) {
    var cell = respArray[i];
    var val = cell["$t"];
    if (cell.col == 1) {
      if (rowData.length > 0) allData.push(rowData);
      rowData = [];
    }
    rowData.push(val);
  }
  allData.push(rowData);
  rowData = [];
  
  return allData;
}

var gymData = getRespText("1aJrinOPhXRTT6M9V2GrEDAriCIcFL7mYczqRdNezSU0"); //체육관
//var nestData = getRespText("1bZR_stKIxXGrGm4usqZISJWXJOVlnJ7uneW_3tSxet4"); //둥지
var cpData = getRespText("1XwshX9ge1JtEAUrB6ZOqjxKu8DsVwl0k7rQeZq5R2_A"); //CP

function response(room, msg, sender, isGroupChat, replier, imageDB) {
  msg = msg.trim();
  
  if (preSender == sender && preMsg[sender] == msg) {
    msgCnt++;
  }
  
  if (msgCnt > 4) return; //4회 이상 도배시
  
  preSender = sender;
  preMsg[sender] = msg;
  
  if (msg.indexOf("어디") > -1 || msg.indexOf("어딘") > -1
    || msg.indexOf("오디") > -1 || msg.indexOf("오딘") > -1
    || msg.indexOf("어떻게가") > -1 || msg.indexOf("어딨") > -1
    || msg.indexOf("어딜") > -1 || msg.indexOf("오딨") > -1
    || msg.indexOf("오딜") > -1 || msg.indexOf("위치") > -1
    || msg.indexOf("@") == 0) {
    if (msg.indexOf("계시나") > -1 || msg.indexOf("계세") > -1
      || msg.indexOf("세요") > -1 || msg.indexOf("계신") > -1
      || msg.indexOf("오셨") > -1 || msg.indexOf("오셧") > -1) {
      //아무것도 안함
    } else {
      for (var i=1; i<gymData.length; i++) {
        if (msg.indexOf(gymData[i][0]) > -1) {
          if (msg.indexOf(gymData[i][3]) == -1) {
            if (gymData[i][2] != "-") {
              replier.reply(gymData[i][2]);
            }
            if (gymData[i][1] != "-") {
              //replier.reply("링크 누르시고 오른쪽 위 다른 브라우저로 열기를 누르세요~");
              //replier.reply("https://www.google.com/maps q="+gymData[i][1]);
              replier.reply("https://map.kakao.com/link/map/"+gymData[i][6]+","+gymData[i][1]);
            }
          } else {
            if (gymData[i][5] != "-") {
              replier.reply(gymData[i][5]);
            }
            if (gymData[i][4] != "-") {
              //replier.reply("링크 누르시고 오른쪽 위 다른 브라우저로 열기를 누르세요~");
              //replier.reply("https://www.google.com/maps q="+gymData[i][4]);
              replier.reply("https://map.kakao.com/link/map/"+gymData[i][7]+","+gymData[i][4]);
            }
          }
          break;
        }
      }
    }
  }
  
  if (msg.indexOf("@") == 0) {
    if (msg.indexOf("미세먼지") == 1) {
      try {
        //네이버에 대기정보에 대해 가져온 겁니다 뒤에 "%EB%8C" 이부분은 URL로 가져옵니다
        //var u = Utils.getWebText("https://search.naver.com/search.naver sm=tab_hty.top&where=nexearch&query="+msg.substr(6)+"+%EB%8C%80%EA%B8%B0%EC%A0%95%EB%B3%B4%20&o");
        var u = Utils.getWebText("https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&mra=blQ3&query="+msg.substr(6)+"%20%EB%AF%B8%EC%84%B8%EB%A8%BC%EC%A7%80");
        var a = u.split("<em class=\"main_figure\">"); 
        var b = u.split("<span class=\"state\">"); 
        var c = u.split("<span class=\"state_info\">");
        var dustTxt = msg.substr(6) + " 대기정보 검색결과 입니다."
                    + "\n미세먼지: " + a[1].split("<")[0] + "㎍/㎥"
                    + "\n초미세먼지: " + b[3].split("<")[0] + c[1].split("<")[0]
                    + "\n오존: " + b[4].split("<")[0] + c[2].split("<")[0]
                    + "\n일산화탄소: " + b[5].split("<")[0] + c[3].split("<")[0]
                    + "\n아황산가스: " + b[6].split("<")[0] + c[4].split("<")[0]
                    + "\n이산화질소: " + b[7].split("<")[0] + c[5].split("<")[0]
                    + "\n통합대기: " + b[8].split("<")[0] + c[6].split("<")[0];
        replier.reply(dustTxt);
      } catch (e) {
        //replier.reply("대기 정보가 없습니다.");
      }
    }
    
    if (msg.indexOf("인사드려") == 1 || msg.indexOf("어서오세요") == 1) {
      replier.reply("새로오신분 반갑습니다.\n상단의 공지사항을 숙지 후에 활동 부탁드립니다.\n궁금하신점 있으시면 자유롭게 물어보세요.\n감사합니다. (_ _)");
    }
    
    if (msg.indexOf("명령어") == 1) {
      replier.reply("@를 먼저 입력하시고\n레이드 몹\n체육관 명\n둥지\n미세먼지 지역명\n을 입력하시면 포고봇이 친절히 안내해 드립니다.");
    }
    
    if (msg.indexOf("둥지") == 1) {
      /*var nest = "";
      for (var i=1; i<nestData.length; i++) {
        nest += nestData[i][0] + " - " + nestData[i][1] + "\n";
      }
      
      replier.reply(nest);*/
      /*replier.reply("http://pokeweather.azurewebsites.net/Nest");*/
      replier.reply("https://darkrai.synology.me:9999/pokemongo.html");
    }
    
    for (var i=1; i<cpData.length; i++) {
      if (msg.indexOf(cpData[i][0]) > -1) {
        if (msg.indexOf(cpData[i][1]) == -1) {
          replier.reply(cpData[i][0]+"의 CP는 아래와 같습니다.\nLv 20\n"+cpData[i][2]+"\nLv 25 (날씨: "+cpData[i][4]+")\n"+cpData[i][3]);
        } else {
          replier.reply(cpData[i][0]+" "+cpData[i][1]+"폼의 CP는 아래와 같습니다.\nLv 20\n"+cpData[i][2]+"\nLv 25 (날씨: "+cpData[i][4]+")\n"+cpData[i][3]);
        }
        break;
      }
    }
  }
}
