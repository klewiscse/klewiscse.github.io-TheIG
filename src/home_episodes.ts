var rankCount = 0;
var overallInt: number;
var gameplayInt : number;
var aestheticsInt : number;
var contentInt: number;

window.addEventListener('load',function(){fetchData()});
window.addEventListener('resize',function(){resize()});

function resize(){
	if(window.innerWidth <= 600){
		document.getElementById("ig-content-rank").style.display = "none";
		return;
	}
}

function fetchData(){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
		var data = JSON.parse(this.responseText);
		sortEpisodesByDate(data)
		var seasonNum = data[0]["season"]["number"] + 1;
		for(var i = 0; i < data.length; i++){
			if(data[i]["Rank"]){
				rankCount++;
			}
			if (data[i]["season"]["number"] < seasonNum){
				seasonNum = data[i]["season"]["number"];
				createEpisode(data[i],i,true);
			}
			else {
				createEpisode(data[i],i,false);
			}
		}

		setRatingValues(0);
	  }
	};
	xmlhttp.open("GET", "database/data.json", true);
	xmlhttp.send();
}

function sortEpisodesByDate(episodes:any) {
	return episodes.sort(function(a:any,b:any){return <any>new Date(b["published_at"]) - <any>new Date(a["published_at"])});
}

function createEpisode(data: any, id: number, newSeason: boolean){
	if (data["status"] != "published")
		return;
	
	var episodes = document.getElementById("episodes");

	if(newSeason){
		var season = document.createElement("h1");
		season.setAttribute("class","season-title");
		season.innerHTML = "Season " + data["season"]["number"];
		episodes.appendChild(season);
	}
	
	var ep = document.createElement("div");
	if(newSeason)
		ep.setAttribute("class", "episode-first");
	else
		ep.setAttribute("class", "episode");
	
	ep.setAttribute("id", `ep${id}`);
	let title = data["title"] + " ";

	if (data["Ranking Info"]){
		ep.setAttribute("onmouseover",`setRatingValues(${id})`);
		ep.setAttribute("data-rank",data["Rank"]);
		ep.setAttribute("data-overall",data["Ranking Info"]["IG Score"]);
		ep.setAttribute("data-gameplay",data["Ranking Info"]["Gameplay"]);
		ep.setAttribute("data-aesthetics",data["Ranking Info"]["Aesthetics"]);
		ep.setAttribute("data-content",data["Ranking Info"]["Content"]);
	}

	var epPlayer = document.createElement("section");
	epPlayer.setAttribute("class", "player");

	var playButton = document.createElement("i");
	playButton.setAttribute("class","fas fa-play-circle fa-lg");
	playButton.setAttribute("onclick",`playEpisode(this,${id})`);

	var audio = document.createElement("audio");
	audio.setAttribute("id",`ep${id}-audio`);
	audio.setAttribute("src",data["enclosure_url"]);
	audio.setAttribute("onended","stopEpisode(this)");
	audio.setAttribute("onloadstart","loadEpisode(this)");
	audio.setAttribute("preload","none");
	epPlayer.appendChild(audio);

	var epInfo = document.createElement("aside");
	epInfo.setAttribute("class","ep-info");
		
	var epTitle = document.createElement("h2");
	epTitle.setAttribute("class", "episode-title");
	epTitle.setAttribute("id",`ep${id}-title`);
	epTitle.textContent = title;
	if(data["Ranking Info"]){
		let icon = document.createElement("i");
		icon.className = "fas fa-gamepad";
		icon.title = "Game Review";
		epTitle.appendChild(icon);
	}
	epInfo.appendChild(epTitle);
		
	var epDes = document.createElement("p");
	epDes.setAttribute("class", "ep-description");
	epDes.textContent = data["description"];
	epInfo.appendChild(epDes);
		
	episodes.appendChild(ep);
	epPlayer.appendChild(playButton);
	ep.appendChild(epPlayer);
	ep.appendChild(epInfo);
}

/* exported setRatingValues */
function setRatingValues(id:number) {
	if(window.innerWidth < 992){
		document.getElementById("ig-content-rank").style.display = "none";
		return;
	}

	var ep = document.getElementById(`ep${id}`);
	if(!ep.hasAttribute("data-overall"))
		return;

	clearInterval(overallInt);
	clearInterval(gameplayInt);
	clearInterval(aestheticsInt);
	clearInterval(contentInt);

	var title = document.getElementById("ig-content-rank-game-title");
	title.innerHTML = document.getElementById(`ep${id}-title`).innerText;

	var rank = document.getElementById("ig-content-rank-game-rank");
	rank.innerHTML = `Rank ${ep.getAttribute("data-rank")}/${rankCount}`;
	
	var overall = document.getElementById("ig-content-rank-game-overall");
	var overallVal = +Number(ep.getAttribute("data-overall")).toFixed(2);
	overall.innerHTML = `Overall ${overallVal}/100`;
	let overallPercent = document.getElementById("ig-content-rank-progress-overall");

	var gameplay = document.getElementById("ig-content-rank-game-gameplay");
	var gameplayVal = +Number(ep.getAttribute("data-gameplay")).toFixed(2);
	gameplay.innerHTML = `Gameplay ${gameplayVal}/100`;
	let gameplayPercent = document.getElementById("ig-content-rank-progress-gameplay");

	var aesthetics = document.getElementById("ig-content-rank-game-aesthetics");
	var aestheticsVal = +Number(ep.getAttribute("data-aesthetics")).toFixed(2);
	aesthetics.innerHTML = `Aesthetics ${aestheticsVal}/100`;
	let aestheticsPercent = document.getElementById("ig-content-rank-progress-aesthetics");

	var content = document.getElementById("ig-content-rank-game-content");
	var contentVal = +Number(ep.getAttribute("data-content")).toFixed(2);
	content.innerHTML = `Content ${contentVal}/100`;
	let contentPercent = document.getElementById("ig-content-rank-progress-content");

	document.getElementById("ig-content-rank").style.display = "Block";

	overallInt = transition(overallPercent,overallVal);
	gameplayInt = transition(gameplayPercent,gameplayVal);
	aestheticsInt = transition(aestheticsPercent,aestheticsVal);
	contentInt = transition(contentPercent,contentVal);

}

function transition(ele: HTMLElement, val:number){
	var contentSlide = setInterval(frame,16.7);
	val = Math.round(val);
	return contentSlide;

	function frame(){
		var width = Number(ele.style.width.substring(0, ele.style.width.length - 1));
		if(	width == val){
			clearInterval(contentSlide);
		} else {
			if (width > val){
				ele.style.width = `${width-1}%`;
			}
			else if (width < val) {
				ele.style.width = `${width+1}%`;
			}
		}
	}
}
