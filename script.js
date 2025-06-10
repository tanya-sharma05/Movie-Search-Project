// USING TMDB API
const genres = [
    {
        "id": 28,
        "name": "Action"
    },
    {
        "id": 12,
        "name": "Adventure"
    },
    {
        "id": 16,
        "name": "Animation"
    },
    {
        "id": 35,
        "name": "Comedy"
    },
    {
        "id": 80,
        "name": "Crime"
    },
    {
        "id": 99,
        "name": "Documentary"
    },
    {
        "id": 18,
        "name": "Drama"
    },
    {
        "id": 10751,
        "name": "Family"
    },
    {
        "id": 14,
        "name": "Fantasy"
    },
    {
        "id": 36,
        "name": "History"
    },
    {
        "id": 27,
        "name": "Horror"
    },
    {
        "id": 10402,
        "name": "Music"
    },
    {
        "id": 9648,
        "name": "Mystery"
    },
    {
        "id": 10749,
        "name": "Romance"
    },
    {
        "id": 878,
        "name": "Science Fiction"
    },
    {
        "id": 10770,
        "name": "TV Movie"
    },
    {
        "id": 53,
        "name": "Thriller"
    },
    {
        "id": 10752,
        "name": "War"
    },
    {
        "id": 37,
        "name": "Western"
    }
]

const tagsEle=document.querySelector("#tags");
let selectedGenre=[];
setGenre();

function setGenre(){
    tagsEle.innerHTML=" ";
    genres.forEach((genre)=>{
        const btn=document.createElement("div");
        btn.classList.add("tag");
        btn.id=genre.id; 
        btn.innerText=genre.name;
        btn.addEventListener("click",()=>{
            if(selectedGenre.length==0){
                selectedGenre.push(genre.id);
            }
            else{
                if(selectedGenre.includes(genre.id)){
                    selectedGenre.forEach((id,idx)=>{
                        if(id==genre.id){
                            selectedGenre.splice(idx,1);
                        }
                    });
                }
                else{
                    selectedGenre.push(genre.id);
                }
            }
            getMovies(API_URL+'&with_genres='+encodeURI(selectedGenre.join(',')));
            highlightSelection();
        });
        tagsEle.append(btn);
    });
};

function highlightSelection(){
    const tags=document.querySelectorAll(".tag");
    tags.forEach((tag)=>{
        tag.classList.remove("highlight");
    });

    clearBtn(); 
    
    if(selectedGenre.length!=0){
        selectedGenre.forEach((id)=>{
            const hightlightedTag=document.getElementById(id);
            hightlightedTag.classList.add("highlight");
        });
    }
};

function clearBtn(){
    let clearBtn=document.querySelector("#clear");
    if(clearBtn){
        clearBtn.classList.add("highlight");
    }
    else{
        let clear=document.createElement("div");
        clear.classList.add("tag","highlight");
        clear.id="clear";
        clear.innerText="Clear x";
        clear.addEventListener("click",()=>{
            selectedGenre=[];
            setGenre();
            getMovies(API_URL);
        });
        tagsEle.append(clear);
    }
};

const API_KEY='09a3f9f5ad8f7ea5920a26d052289849';
const BASE_URL='https://api.themoviedb.org/3';
const API_URL=`${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;

const prev=document.querySelector("#prev");
const next=document.querySelector("#next");
const current=document.querySelector("#current");

let currentPage=1;
let nextPage=2;
let previousPage=3;
let lastUrl='';
let totalPages=100;

const main=document.querySelector("#main");

getMovies(API_URL);

function getMovies(url){
    lastUrl=url;
    fetch(url)
        .then(res=>res.json())
        .then((data)=>{
            if(data.results.length!==0){
                showMovies(data.results);
                currentPage=data.page;
                nextPage=currentPage+1;
                previousPage=currentPage-1;
                totalPages=data.total_pages;
                current.innerText=currentPage;

                if(currentPage<=1){
                    prev.classList.add("disabled");
                    next.classList.remove("disabled");
                }
                else if(currentPage>=totalPages){
                    prev.classList.remove("disabled");
                    next.classList.add("disabled");
                }
                else{
                    prev.classList.remove("disabled");
                    next.classList.remove("disabled");
                }

                tagsEle.scrollIntoView({behavior:'smooth'});
            }
            else{
                main.innerHTML=`<h1 class="no-results">Oops! No Results Found!</h1>`;
            }
        });
};

const IMG_URL='https://image.tmdb.org/t/p/w500'

function showMovies(data){
    main.innerHTML='';
    data.forEach((movie)=>{
        const {title,poster_path,vote_average,overview,id}=movie;
        const movieElement=document.createElement("div");
        movieElement.classList.add("movie");
        movieElement.innerHTML=`
        <img src="${poster_path?IMG_URL+poster_path:"http://via.placeholder.com/1080x1580"}" alt="${title}">
        <div class="movie-info">
            <h4>${title}</h4>
            <span class="${getColor(vote_average)}">${vote_average}</span>  
        </div>
        <div class="overview">
            <h3>Overview</h3>
            ${overview}
            <br>
            <button class="know-more" id="${id}">Know More?</button>
        </div>
        `;
        main.appendChild(movieElement);
        
        const movieId=document.getElementById(id);
        movieId.addEventListener("click",()=>{
            openNav(movie);
        });
    });
};

function getColor(vote){
    if(vote>=8){
        return 'green';
    }
    else if(vote>=5){
        return 'orange';
    }
    else{
        return 'red';
    }
};

const form=document.querySelector("#form");
const search=document.querySelector("#search");
const searchURL=BASE_URL+'/search/movie?api_key='+API_KEY;

form.addEventListener("submit",(e)=>{
    e.preventDefault();

    const searchTerm=search.value;
    selectedGenre=[];
    setGenre();

    if(searchTerm){
        getMovies(searchURL+'&query='+searchTerm);
    }
    else{
        getMovies(API_URL);
    }
});

prev.addEventListener("click",()=>{
    if(previousPage>0){
        pageCall(previousPage);
    }
});

next.addEventListener("click",()=>{
    if(nextPage<=totalPages){
        pageCall(nextPage);
    }
});

function pageCall(page){
    let urlSplit=lastUrl.split('?');
    let queryParams=urlSplit[1].split('&');
    let key=queryParams[queryParams.length-1].split('=');

    if(key[0]!='page'){
        let url=lastUrl+'&page='+page;
        getMovies(url);
    }
    else{
        key[1]=page.toString();
        let a=key.join('=');
        queryParams[queryParams.length-1]=a;
        let b=queryParams.join('&');
        let url=urlSplit[0]+'?'+b;
        getMovies(url);
    }
};

function closeNav(){
    const nav=document.querySelector("#myNav");
    nav.style.width="0%";
};

const overlayContent=document.querySelector("#overlay-content");
let activeSlide=0;
let totalVideos=0;

function openNav(movie){
    let id=movie.id;
    fetch(BASE_URL+'/movie/'+id+'/videos?api_key='+API_KEY)
        .then(res=>res.json())
        .then((videoData)=>{
            if(videoData){
                document.getElementById("myNav").style.width="100%";
                if(videoData.results.length>0){
                    let embed=[];
                    let dots=[];
                    videoData.results.forEach((video,idx)=>{
                        let {name,key,site}=video;
                        if(site=='YouTube'){
                            embed.push(`<iframe width="560" height="315" margin-top=30px src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
                            dots.push(`<span class="dot">${idx+1}</span>`);
                        }
                    });
                    let content=`
                    <h1 class="no-results">${movie.original_title}</h1>
                    <br/>
                    ${embed.join('')}
                    <br/>
                    <div class="dots">${dots.join('')}</div>
                    `;
                    overlayContent.innerHTML=content;
                    activeSlide=0;
                    showVideos();
                }
                else{
                    overlayContent.innerHTML=`<h1 class="no-results">Oops! No Results Found!</h1>`
                }
            }
        });
};

function showVideos(){
    let embedClasses=document.querySelectorAll(".embed");
    let dots=document.querySelectorAll(".dot");

    totalVideos=embedClasses.length;
    embedClasses.forEach((embedTag,idx)=>{
        if(activeSlide==idx){
            embedTag.classList.add("show");
            embedTag.classList.remove("hide");
        }
        else{
            embedTag.classList.add("hide");
            embedTag.classList.remove("show");
        }
    });
    dots.forEach((dot,indx)=>{
        if(activeSlide==indx){
            dot.classList.add("active");
        }
        else{
            dot.classList.remove("active");
        }
    });
};

const leftArrow=document.querySelector("#left-arrow");
const rightArrow=document.querySelector("#right-arrow");

leftArrow.addEventListener("click",()=>{
    if(activeSlide>0){
        activeSlide--;
    }
    else{
        activeSlide=totalVideos-1;
    }

    showVideos();
});

rightArrow.addEventListener("click",()=>{
    if(activeSlide<(totalVideos-1)){
        activeSlide++;
    }
    else{
        activeSlide=0;
    }

    showVideos();
});
