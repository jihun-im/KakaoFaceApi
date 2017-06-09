var express = require('express');
var request = require('request');
var router = express.Router();
var Calc = require('./Calc.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/keyboard', function(req, res, next) {
	var resultObject = new Object();

	resultObject.type = "buttons";

	//var buttonArray = ["1", "2", "3"];
	var buttonArray = new Array();

	buttonArray.push("도움말");
	buttonArray.push("친구에게추천");

	resultObject.buttons = buttonArray;

	var resultJson = JSON.stringify(resultObject);

	res.send(resultJson);
});

// 메시지 수신 및 자동응답 API
router.post('/message', function(req, res, next){
	var user_key = req.body.user_key;
	var type = req.body.type;
	var content = req.body.content;

	console.log("user_key : " + user_key);
	console.log("type : " + type);
	console.log("content : " + content);

	var resultObject = new Object();
	var messageObject = new Object();
	var text = "";
	var isTherePhoto = false;
	var isThereLink = false;
	var isThereNextMessage = false;
	var timerValue = 0;
	var faceJson = "";
	var timerHandler;

        if(type=="text") {
		switch (content) {
			case "도움말":
			case "ㄷㅇㅁ":
		        	        text = "안녕하세요 자동응답서비스입니다\n1. 도움말(ㄷㅇㅁ)\n도움말을 출력합니다 \n" +
                                        	"2. 사진인식\n사진을 전송하시면 나이와 성별을 구분하여 알려드립니다\n" +
						"3. 계산기\n기본적인 계산기능을 제공해드립니다(입력예제:1000*3) \n" +
                                	        "4. 맞춤법교정\n" + "자동으로 교정!\n" +
                                	        "5. 친구에게추천(ㅊㅊ)\n" + "임지훈봇 친구링크를 제공\n" +
						""
					break;
			case "타이머":
			case "ㅌㅇㅁ":
					text = "x분후 알려드리겠습니다";
					break;
			case "친구에게추천":
			case "ㅊㅊ":
					text = "https://goo.gl/LgPJmE";
					break;
			default:
					//Calculater
					var assert = require("assert"),
					testExpression = "5+2*7",
					calc = new Calc(testExpression);
					function testCalc(exp) {
		 			   return eval(calc.sanitize(exp));
					}
					var calResult = testCalc(content);
					console.log("result~~~~~~~");
                                        console.log(calResult);
					if(calResult+"" == "undefined" || calResult==content) {
					startSpellCheck();
					function startSpellCheck() {
				                var headers = {
				                    "Content-Type":     "application/x-www-form-urlencoded",
				                }

				                var options = {
				                    // possible attributes: age,gender,smile,facialHair,glasses,emotion
				                    url: 'http://speller.cs.pusan.ac.kr/PnuSpellerISAPI_201602/lib/check.asp',
				                    method: 'POST',
				                    headers: headers,
				                    form: { 'text1': content }
				                }

				                // Start the request
				                request(options, function (error, response, body) {
				                    if (!error && response.statusCode == 200) {
				                        // Print out the response body
				                        //console.log(body);
				                        console.log("\nsuccessful\n")
							
//parsing logic start
var pattern = /class='tdReplace' >/;
var patternBr = /<br\/>/;
var patternOriginal = /class='tdErrWord' style='color:#0000FF;' >/;
var patternOriginalTd = /<\/TD>/;
var string = body;
var match;
var start;
var end;
var matchBr;
var matchOriginal;
var matchOriginalTd;
var originalStr="";
var editedStr;
var count = 0;

while (( matchOriginal = patternOriginal.exec(string)) != null ) {
   count++;
   string = string.substring(matchOriginal.index + matchOriginal[0].length,string.length);
   matchOriginalTd = patternOriginalTd.exec(string);
   originalStr = string.substring(0, matchOriginalTd.index);

   match = pattern.exec(string);
   start = match.index;
   end = start + match[0].length;
   

   string = string.substr(end,string.length);
   matchBr = patternBr.exec(string)
   editedStr = string.substring(0,matchBr.index);
   content = content.replace(originalStr,editedStr);
}
text = content;
//parsing logic end



				                    } else {
				                        console.log("error--\n" + body + error)
				                        text = error;
				                    }

				                    messageObject.text = text;
				                    resultObject.message = messageObject;
				                    var resultJson = JSON.stringify(resultObject);
				                    res.send(resultJson);
				                    console.log(resultJson)

				                })

					}
					return;
					} else {
						text = "계산기: " + calResult;
					}
					
					break;
		}


        	messageObject.text = text;
	        resultObject.message = messageObject;
	        var resultJson = JSON.stringify(resultObject);
	        res.send(resultJson);
                console.log(resultJson)


	} else if(type=="photo") {

		// For Face API
		// Set the headers
		var headers = {
		    "Content-Type":     "application/json",
		    "Ocp-Apim-Subscription-Key":    "447ccc9953ed42c7ba005b77875c65ae"
		}

		var options = {
		    // possible attributes: age,gender,smile,facialHair,glasses,emotion
		    url: 'https://westus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=false&returnFaceLandmarks=false&returnFaceAttributes=age,gender,smile,glasses',
		    method: 'POST',
		    headers: headers,
		    json: { 'url': content }
	   	    //json: { 'url': 'http://dn-m.talk.kakao.com/talkm/oWzaP6dFkk/64c5qlfkG1kavu3lsPNxzk/i_gydspawvvzja.jpg' }
		}
		
		// Start the request
		request(options, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		        // Print out the response body
		        console.log("\nsuccessful\n")
			console.log(body);
			faceJson = body;
		    } else {
			console.log("error--\n" + body + error)
		    }
		    responseToKakao();
		})
                function responseToKakao(){ 
		try {
		    var i = 0;
		    for ( i = 0 ; i < faceJson.length ; i++ ) {    
			var age = faceJson[i].faceAttributes.age + ""
			var gender = faceJson[i].faceAttributes.gender + ""
			var smile = faceJson[i].faceAttributes.smile + ""
			var glasses = faceJson[i].faceAttributes.glasses + ""
	                text = text.concat("" + age + "세 ");
			if ( gender == "male" ) {
	                        text = text.concat("남자");
			} else {
	                        text = text.concat("여자");
			}
			if ( smile > 0.8 ) {
                                text = text.concat(" 웃고있음");
                        } 

			//text = text.concat(" 웃음기" + (""+smile*100).substring(0,4) + "%");
			if ( glasses != "NoGlasses" ) {
				text = text.concat(" 안경낌");
			}
			if ( i < faceJson.length - 1 ) {
				text = text.concat("\n---------------------------------\n");
			}
		    }
			messageObject.text = text;
        	        resultObject.message = messageObject;
	                var resultJson = JSON.stringify(resultObject);
			console.log(resultJson)
                 	res.send(resultJson);
		} catch(err) {
				messageObject.text = "얼굴을 찾을수가 없습니다. 다시 시도해주세요";
	                        resultObject.message = messageObject;
	                        var resultJson = JSON.stringify(resultObject);
	                        console.log(resultJson)
        	                res.send(resultJson);
			}
		}

	}


});


function startSpellCheck() {
	        var headers = {
                    "Content-Type":     "application/json",
                }

                var options = {
                    // possible attributes: age,gender,smile,facialHair,glasses,emotion
                    url: 'http://speller.cs.pusan.ac.kr/PnuSpellerISAPI_201602/lib/check.asp',
                    method: 'POST',
                    headers: headers,
                    json: { 'text1': content }
                }

                // Start the request
                request(options, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        // Print out the response body
                        console.log("\nsuccessful\n")
                        console.log(body);
                        faceJson = body;
                    } else {
                        console.log("error--\n" + body + error)
                    }
		    text = body;
                })

}


// 친구 추가 알림 API
router.post(['/friend'], function(req, res, next){
	var user_key = req.body.user_key;
	//console.log("user_key : " + user_key);

	res.send("SUCCESS");
});

// 친구 차단 알림 API
router.delete(['/friend/:user_key'], function(req, res, next){
	var user_key = req.params.user_key;
	//console.log("user_key : " + user_key);

	res.send("SUCCESS");
});


// 채팅방 나가기
router.delete(['/chat_room/:user_key'], function(req, res, next){
	var user_key = req.params.user_key;
	//console.log("user_key : " + user_key);

	res.send("SUCCESS");
});






module.exports = router;
