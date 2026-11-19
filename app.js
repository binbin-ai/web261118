// app.js : 영화 배열을 다루는 함수 6개 / 박현빈(26) / 11주차

// average : 영화 배열 ⇒ 평균 평점(숫자)
function average(list) {
    let sum = 0;
    for (const m of list) {
        sum += m.rating;
    }
    return sum / list.length;
}
console.log("평균:", average(movies));

// best : 영화 배열 ⇒ 최고 평점 영화 제목
const best = (list) => {
    let top = list[0]
    for (const i of list) {
        if (i.rating > top.rating) {
            top = i;
        }
    }
    return top.title;
}
console.log("최고:", best(movies));

// filterByRating : 영화 배열, 기준 평점 ⇒ 평점 8점이상 개수 반환
const filterByRating = (list, min) => {
    let cnt = 0;
    for (const i of list) {
        if (i.rating > min) {
            cnt++;
        }
    }
    return cnt;
}
console.log("8점 이상:", filterByRating(movies, 8) + "편");

// sortByRating : 평점 기준 미정렬 영화 배열 ⇒ 평점 기준 정렬 영화 배열
const sortByRating = (list) => {
    let tmp = 0;
    let arr = [];

    for (let i = 0; i < list.length; i++) {
        arr[i] = list[i];
    }

    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i].rating < arr[j].rating) {
                tmp = arr[i];
                arr[i] = arr[j];
                arr[j] = tmp;
            }
        }
    }

    return arr;
}
const sorted = sortByRating(movies)
console.log("정렬 2위:", sorted[1].title, "/ 원본 2번:", movies[1].title); // 원본 1번이 평점 1등이라 2등을 비교함

// yearsSince : 영화 배열 중 첫번째 영화의 개봉일 ⇒ 현재 연도 - 개봉 연도
const yearsSince = (dateStr) => {

    let now_year = 2026;
    let last_year = dateStr.slice(0, 4);
    last_year = parseInt(last_year);
    return now_year - last_year

}
console.log(yearsSince(movies[0].date) + "년 전 개봉");

const posterUrl = (path, size) => {
    return `https://image.tmdb.org/t/p/${size}/${path}`;
}

console.log(posterUrl(movies[0].poster, "w342"));

// renderCards : 영화 배열 ⇒ 보드에 카드 생성(반환값 없음)
const liked = JSON.parse(localStorage.getItem("liked") || "[]");
const renderCards = (list) => {
    const board = document.querySelector(".board");
    board.innerHTML = "";
    for (const m of list) {
        const card = document.createElement("article");
        card.className = "card";
        card.dataset.id = m.id;
        card.setAttribute("data-type", m.type);
        card.setAttribute("data-title", m.title);
        card.onclick = function () { alert(m.overview); };
        if (m.rating >= 8) {
            card.classList.add("hot");
        }
        card.innerHTML = ` 
      <img class="poster" src="${posterUrl(m.poster, "w342")}" alt="${m.title} 포스터"> 
      <span class="badge">${m.rating}</span> 
      <div class="info"> 
        <h2>${m.title}</h2> 
        <p class="year">${m.year}</p>
        <button class="like" type="button">♥</button>
      </div>`;
        board.appendChild(card);
        if(liked.includes(m.title)){
            card.querySelector(".like").className = "like liked";
        }else{
            card.querySelector(".like").className = "like";
        }
    }
    document.querySelector("#count").textContent = list.length + "편";
    updateLikeCount();
    if (list.length === 0) {
        board.classList.add("is-empty");
    }else{
        board.classList.remove("is-empty");
    }
    document.getElementById("likeCount").textContent = liked.length;
}


const sortBy = (list, key, desc) => {
    const copy = [...list];
    copy.sort((a, b) => {
        if (typeof a[key] === "string") return a[key].localeCompare(b[key]);
        return a[key] - b[key];
    });
    if (desc) copy.reverse();
    return copy;
}

// applySort : 선택 상자 값으로 정렬해서 다시 그리기(반환값 없음)
const applySort = () => {
    renderCards(getView());
}

applySort();

// 검색창 : 글자를 칠 때마다 해당 글자에 맞게 프론트 뷰 다시 그리기
document.getElementById("q").addEventListener("input", (e) => {
    if(e.key === "Escape"){
        e.target.value = "";
        renderCards(getView());
    }else{
        renderCards(getView());
    }
    
});

// html에서 onchange 속성으로 함수를 호출하는 것이아닌 JS에서 해당 id를 가진 요소를 찾아 함수 삽입
document.getElementById("sort").addEventListener("change", applySort);

// 뷰의 모든 기능이 렌더링되게 하는 코드
function getView() {
    const keyword = document.getElementById("q").value.trim().toLowerCase();
    const found = movies.filter(m => m.title.toLowerCase().includes(keyword));
    const key = document.getElementById("sort").value;
    return sortBy(found, key, key != "title");
}

// 찜 기능
// function (e)를 쓰면 this가 보드이고, e.target은 하트 버튼인데 반해
// 화살표 함수인 (e) => {}로 쓰면 this가 window이고, e.target은 하트 버튼
document.querySelector(".board").addEventListener("click", (e)=>{
    const card = e.target.closest(".card");
    if(!card){
        return;
    }

    const title = card.getAttribute("data-title")

    // 찜 버튼 클릭
    if(e.target.closest(".like")){
        const i = liked.indexOf(title);
        if (i === -1) {
            liked.push(title);
        }else{
            liked.splice(i, 1);
        }
        saveLiked();
        applySort(); // 실습과제 #3 에서는 리프레시로 변경
        return;
    }
})

// 다크 모드 기능
document.getElementById("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

function updateLikeCount() {
    document.getElementById("likeCount").textContent = document.querySelectorAll(".liked").length;
}

function saveLiked() {
    localStorage.setItem("liked", JSON.stringify(liked));
}