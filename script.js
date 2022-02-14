let playerAnsList = ["", "", "", "", "", "", "", ""]
let ans=""
let word=""
let tilesWidth = 7
let tilesHeight = 6
let nowLine=0
let nowStr=0
let resultList=[[],[],[],[],[],[],[],[]]
let wordList
let flag

$(document).ready(function () {
	initArray()
	loadJSON()
	setTimeout(()=>{
		printWordList()
	},1000)
})

//min以上max未満　での乱数
function getRand(min, max) { 
	return (Math.floor(Math.random() * (max - min))) + min
}

function initArray(){
	for(let i=0;i<4;i++){
		for(let j=0;j<8;j++){
			resultList[i][j]=0
		}
	}
}

function loadJSON() {
	$.ajax({
			type: "GET",
			url: "./wordList.json",
			dataType: "json",
			async: false
		})
		.then(
		function (json) {
			console.log("JSON OK")
						wordList = json
			let a = getRand(0, wordList.length)
			ans=wordList[a].word
			word=wordList[a].name

			
		},
		function () {
			console.log("failed to load")
			alert("Sorry. failed to load..\nPlease reload")
		})
}


function strPadding(str,num){
	while(str.length!=num){
		str+=" "
	}
	return str
}

function printError1(){//このきもいかもしれない関数名許せめんどいオーバーロードできないのかね
	console.log("ワードリストにねえ")
	$(".errors").prepend("<div class='error'>ワードリストにない高専です</div>")
	setTimeout(()=>{
			$(".error:last").remove()
	},1000,)
}

function printError2(index){
	console.log((index+1)+"文字目は"+ans[index]+"でないといけません")
	$(".errors").prepend("<div class='error'>" + (index + 1) + "文字目は" + ans[index] + "でないといけません</div>")
	setTimeout(() => {
		$(".error:last").remove()
	}, 1000, )
}

function checkWord(playerAns,resultList){
	let Flag = 0;
	// console.log(playerAns)
	wordList.forEach(e=>{
		if(e.word==playerAns){
			Flag=1//ワードリストにあったら１
		}
	})
	if(Flag==0){
		printError1()
		return Flag
	}
	let paddingedAns = strPadding(ans, tilesWidth)
	for(let i=0;i<nowLine;i++){
		for(let j=0;j<tilesWidth;j++){
			if((resultList[nowLine][j]!=1)&&(resultList[i][j]==1)&&(paddingedAns[j]!=" ")){//以前に1が出てるのに1じゃなかったら
				printError2(j)
				return Flag=0
			}
		}
	}

	return Flag
}

function compAns(playerAns,result){
	playerAns=strPadding(playerAns, tilesWidth)
	let paddingedAns=strPadding(ans, tilesWidth)
	// console.log(ans)
	for (let i = 0; i < playerAns.length; i++) { //まずは完全一致判定をする（優先順位上
		for (let j = 0; j < paddingedAns.length; j++) {
			if ((j == i) && (playerAns[i] == paddingedAns[j])) {
				result[i] = 1 //完全一致
			}
		}
	}
	// console.log(result)
	for (let i = 0; i < playerAns.length; i++) { //不完全一致
		for (let j = 0; j < paddingedAns.length; j++) {
			if ((result[i] != 1)&&(result[j]!=1 )) { //1になってるところとはもう比較しない　まだ文字の判定が０であるときかつ不完全一致するとき
				if (playerAns[i] == paddingedAns[j]){
					result[i] = 2 //不完全一致
				}
			}
		}
	}
}

function checkResult(result){
	let flag=1
	for(let i=0;i<ans.length;i++){
		flag=flag&result[i]
	}
	return flag
}

function printResult(result,playerAns){
	let i=0
	let row=$(".row")
	let timerID=setInterval(()=>{
		if (i > tilesWidth) {
			clearInterval(timerID)
		}

		if(result[i]==1){
			if(playerAns[i]!=" "){
				$(".keyBoard button:contains('"+playerAns[i]+"')").addClass("correct")
			}
			row.eq(nowLine-1).find(".tile").eq(i).addClass("correct")
		}else if(result[i]==0){
			if(playerAns[i]!=" "){
				$(".keyBoard button:contains('"+playerAns[i]+"')").addClass("incorrect")
			}
			row.eq(nowLine-1).find(".tile").eq(i).addClass("incorrect")
		}else{
			if(playerAns[i]!=" "){
				$(".keyBoard button:contains('"+playerAns[i]+"')").addClass("half")
			}
			row.eq(nowLine-1).find(".tile").eq(i).addClass("half")
		}
		i++
	},300)
}

function printChar(key) {
	let tiles = $(".tile")
	tiles.eq(tilesWidth*(nowLine)+nowStr).append("<div class='tileChar'>" + key + "</div>")
}

function deleteChar() {
	let tiles = $(".tile")
	if(nowStr>0){
		tiles.eq(tilesWidth * (nowLine) + nowStr-1).text("")
	}
}


function showHowToTab() {
	let tab = $(".howToTab")
	tab.fadeIn(500)
}

function hideHowToTab() {
	let tab = $(".howToTab")
	tab.hide()
}

function printWordList(){
	let tab = $(".wordListTab .Tab")
	let text = ""
	wordList.forEach((e) => {
		text += "校名(略): " + e.name + "<br>"
		text += "回答方法: " + e.word + "<br><br>"
	})
	tab.append("<div class='wordListDiv'>" + text + "</div>")
}

function showWordListTab() {
	let tab = $(".wordListTab")
	tab.fadeIn(500)
}

function hideWordListTab() {
	let tab = $(".wordListTab")
	tab.hide()
}

function printCorrect(flag){
	let tab=$(".correctTab .Tab")
	let realtab=$(".correctTab")
	let resultString="\n"
	let worl="LOSE(笑)"
	let worlClass="lose"
	for(let i=0;i<tilesHeight;i++){
		for(let j=0;j<tilesWidth;j++){
			if (resultList[i][j] == 1) {
				resultString += "🟩"
			} else if (resultList[i][j] == 0) {
				resultString += "⬜"
			} else{
				resultList += "🟨"
			}
		}
		resultString+="\n"
	}
	resultString+="\n答え: "+word+"\n"
	if(flag){
		worl="WIN!"
		worlClass="win"
	}
	resultString+="\n"+worl+"\n"
	let hashtag=encodeURI("高専Wordle")
	resultString=encodeURI(resultString)
	let url = encodeURI("https://trimscash.github.io/KosenWordle");
	let encoded = "https://twitter.com/intent/tweet?&text=%20%23" + hashtag + "%20" + resultString + "&url=" + url;

	tab.append("<div class='ans'>答え: " + ans + "</div>")
	tab.append("<div class='word'>" + word + "</div>")
	tab.append("<div class='"+worlClass+"'>" + worl + "</div>")
	tab.append("<div class='howmany'>試行回数: " + (nowLine+1) + "</div>")
	tab.append('<a href="' + encoded + '"><div class="share"><img src="./Icon/circleTweet.png"></div></a>');

	realtab.delay(3000).fadeIn(500)
}

function deleteTab(){
	let tab = $(".correctTab .Tab")
	tab.remove()
}


function keyBoard(key) {
	if(nowLine<tilesHeight){
		if(key=='E'&&flag!=1){
			compAns(playerAnsList[nowLine], resultList[nowLine])
			if(checkWord(playerAnsList[nowLine],resultList)){//ワードリストにあったら
				printResult(resultList[nowLine],playerAnsList[nowLine])
				if (checkResult(resultList[nowLine])) {
					flag=1
					console.log("WIN")
					printCorrect(flag)
				}else if(nowLine+1==tilesHeight){
					console.log("LOSE")
					printCorrect(flag)
				}
				nowLine++
				nowStr=0
			}
		}else if(key=='B'&&flag!=1){
			if(playerAnsList[nowLine].length>0){
				playerAnsList[nowLine] = playerAnsList[nowLine].slice(0, playerAnsList[nowLine].length - 1)
				deleteChar()
				nowStr--
			}
		} else if (flag!=1&&playerAnsList[nowLine].length < tilesWidth) {
			playerAnsList[nowLine] += key
			printChar(key)
			nowStr++
		}
	}


}
