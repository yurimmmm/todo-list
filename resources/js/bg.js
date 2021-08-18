let getCoords = () => {
	   return new Promise((resolve,reject)=>{
	      navigator.geolocation.getCurrentPosition((position) =>{
	         resolve(position.coords);         
	      });
	   })
	}
let getLocationWeather = async() =>{
	let coords = await getCoords();
	let queryString = createQueryString({			
		lat:coords.latitude,
		lon:coords.longitude,
		units:'metric',       //화씨가 디폴트라 섭씨로 바꿔주는 구문
		lang:'kr',
		appid:'eac6dffc94c6093046facd0429f6801f'
	});
	
	/*let url =`https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid={eac6dffc94c6093046facd0429f6801f}`;
		사이트에서 주어진 이렇게 긴 코드를 위처럼 정리할 수 있다.*/
	
	let url =`https://api.openweathermap.org/data/2.5/weather?${queryString}`;
	
	let response = await fetch(url);
	let datas = await response.json();
	
	let temp = datas.main.temp;
	let loc = datas.name;
	
	return{
		temp:datas.main.temp,
		loc:datas.name		
	} //외부(renderBackground)에서 필요로 하는 부분을 따로 빼줌 
	
	
}

let getBcakgroundImg = async ()=>{
	
	let prevLog = localStorage.getItem('bg-log');
	//localStorage가 오브젝트를 저장할 수 없고, 문자열로 바꿔줘야만 적용가능.
	//아래 JSON.stringify(bgLog)로 바꿔줬음
	
	if(prevLog){
		prevLog = JSON.parse(prevLog);
		if(prevLog.expiraionOn > Date.now()){ //만료일자가 현재일자보다 크다면 = 아직 데이터 만료 전이라면
			return prevLog.bg;
		}
	
	
	
	
	
	
	
	
	
	
	}//사용자가 처음 접근한게 아니라면(=정보가 남아있다면) 실행. 처음접근하면 prevLog가 null이라 false

	let imgInfo = await requestBackgroundImage();	
	registBackgroundLog(imgInfo);
	return imgInfo;
	
}

let requestBackgroundImage = async () =>{
	/*let queryString = createQueryString({
		orientation : 'landscape',    검색사진을 'landscape'=풍경사진으로 지정
		query: 'landscape'
	});*/
	
	let url = 'https://api.unsplash.com/photos/random'/*+queryString*/;	
	let response = await fetch(url,{
		headers: {Authorization:'Client-ID cfp3lUKYjY_RXuMwqI96a6kKJP56sVBvJSJiq4VYu3Y'}
	});
	let datas = await response.json();
	
	return {
		url:datas.urls.full,
		desc : datas.description
	}//외부(renderBackground)에서 필요로 하는 부분을 따로 빼줌.
}










let registBackgroundLog = imgInfo =>{
	//통신이 끝난 시간
	let expiraionDate = new Date();
	//데이터 만료시간을 하루 뒤로 설정
	expiraionDate = expiraionDate.setDate(expiraionDate.getDate()+1);

	let bgLog = {
		expiraionDateOn : expiraionDate,
		bg:imgInfo
	} // 이 데이터를 스토리지에 저장하고 있다가, 만료되면 적용X(통신을 새롭게 해야 함) 만료전이라면 데이터 유지
	
	localStorage.setItem('bg-log',JSON.stringify(bgLog));

}














let renderBackground = async () =>{
	
	//위치와 날씨 정보를 받아온다.
	let locationWeather = await getLocationWeather();	
	//화면에 위치와 날씨정보를 그려준다.
	document.querySelector('.txt_location').innerHTML = `${locationWeather.temp}º @ ${locationWeather.loc}`;	
	
	//배경에 넣을 이미지를 받아온다.
	let background = await getBcakgroundImg();	
	//배경에 이미지와 이미지정보를 그려준다.
	document.querySelector('body').style.backgroundImage = `url(${background.url})`
	if(background.desc){
		document.querySelector('.txt_bg').innerHTML = background.desc;
	/* 배경에  description(사진위치정보)이 없다면 디폴트값 반환*/
	}
	
}

renderBackground();

