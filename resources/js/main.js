let renderCurrentTime = () => {
   
   let now = new Date();
   let hour = now.getHours();
   let minutes = now.getMinutes();
   let seconds = now.getSeconds();
   
   hour = hour < 10?"0"+hour:hour;
   minutes = minutes < 10?"0"+minutes:minutes;
   seconds = seconds < 10?"0"+seconds:seconds;
   document.querySelector('.txt_clock').innerHTML = `${hour} : ${minutes} : ${seconds}`;
}

let renderUser = (event) => {
//html요소의 기본 이벤트 중지
event.perventDefault();
   let input = document.querySelector('.inp_username').value;
   localStorage.setItem('username', input);   
   convertMainDiv(input);
}

let registSchedule = (event) => {
//html요소의 기본 이벤트 중지
event.perventDefault();
   let prevTodo = localStorage.getItem('todo');
   let input = document.querySelector('.inp_todo').value;
   let todoList = [];
   
   if(prevTodo){
      todoList = JSON.parse(prevTodo);
	   let idx = Number(localStorage.getItem('lastIdx'))+1;
	    localStorage.setItem('lastIdx',idx);
       todoList.unshift({work:input,idx:idx});
   }else{
	  localStorage.setItem('lastIdx',0);
      todoList.unshift({work:input, idx:0});
   }
   
   localStorage.setItem('todo', JSON.stringify(todoList));
   renderSchedule(todoList.slice(0,8));
}

let removeschedule = event =>{
	let curPage = Number(document.querySelector('#currentPage').textContent);
	let todoList = JSON.parse(localStorage.getItem('todo'));
	let removedList = todoList.filter(e =>{
		return event.target.dataset.idx != e.idx;
	});
	
	console.dir(removedList);
	localStorage.setItem('todo',JSON.stringify(removedList));
	
	let end = curPage *8;
	let begin = end -8;
	renderSchedule(removedList.slice(begin,end));
}


let renderSchedule = (todoList) => {
   document.querySelectorAll('.todo-list>div').forEach(e => {e.remove()});
   document.querySelector('.inp_todo').value='';
  
 todoList.forEach(schedule => {
      let workDiv = document.createElement('div');
      workDiv.innerHTML = `<i class="fas fa-trash-alt" data-idx=${e.idx}></i> ${e.work}`;
      document.querySelector('.todo-list').append(workDiv);
   });

	document.querySelectorAll('.todo-list>div>i').forEach(e=>{
		e.addEventListener('click',removeschedule)	
	})
	
}

let renderpagination =(event) =>{
	
   let dir = Number(event,target,dataset.dir);
   let curPage = Number(document.querySelector('#currentPage').textContent);
   let lastPage;
   let renderPage = curPage + dir;
   let todoList = local;
  
	 let todoList = localStorage.getItem('todo');
   if(todoList){
      todoList = JSON.parse(todoList);
      let todoCnt = todoList.length;
      lastPage = Math.ceil(todoCnt/8);
  	 }

 		if(curPage == lastPage){
	      alert('마지막 페이지 입니다.');
	      return;
	  	 }
	
	 	if(curPage == 1){
	      alert('첫 페이지 입니다.');
	      return;
	  	 } 
 
	   let renderPage = curPage+1;
	   let end = renderPage * 8
	   let begin = end-8;
   
   renderSchedule(todoList.slice(begin,end));
   document.querySelector('#currentPage').textContent = renderPage;
	
}

let renderPrevPage = () => {
   
}

let convertMainDiv = (username) => {
   document.querySelector('.username').innerHTML = username;
   document.querySelector('.inp_username').placeholder = 'Enter your schedule';
   document.querySelector('.inp_username').value = '';
   
   document.querySelector('.wrap_username').className = 'box_todo';
   document.querySelector('.frm_username').className = 'frm_todo';
   document.querySelector('.inp_username').className = 'inp_todo';
   
   document.querySelector('.main').style.justifyContent = 'space-between';
   document.querySelector('.wrap_todo').style.marginRight = '20vw';
   document.querySelector('.todo-list').style.display = 'block';

   //기존에 등록한 submit이벤트 제거
   document.querySelector('.frm_todo').addEventListener('submit',renderUser);
   document.querySelector('.frm_todo').addEventListener('submit',registSchedule);
   document.querySelector('#leftArrow').addEventListener('click',renderpagination);
   document.querySelector('#rightArrow').addEventListener('click',renderpagination);
}


(() => {
   let username = localStorage.getItem('username');
   let todoList = localStorage.getItem('todo');
   
   if(username){ //사용자가 등록을 진행했다면,
      convertMainDiv(username);
      if(todoList){
         todoList = JSON.parse(todoList);
         renderSchedule(todoList.slice(0,8));//todo리스트에 8개의 항목만 보이게 하기
      }
   }else{
      document.querySelector('.frm_username').addEventListener('submit', renderUser);
   }   
   
   setInterval(renderCurrentTime,1000);   
})();









