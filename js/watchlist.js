const toggle = document.getElementById('toggleDark');
const body = document.querySelector('body');

toggle.addEventListener('click', function () {
    this.classList.toggle('bi-moon');
    if (this.classList.toggle('bi-brightness-high-fill')) {
        body.style.background = '#FFF4F4';
        body.style.color = '#374259';
        body.style.transition = '2s';


    } else {
        body.style.background = '#374259';
        body.style.color = '#FFF4F4';
        body.style.transition = '2s';

    }
});
const movieResults = document.querySelector('.results')
if(!localStorage.getItem('Watchlist')){
    localStorage.setItem('Watchlist', JSON.stringify([]))
    document.querySelector('.watchlist-empty').classList.toggle('hidden')
    document.querySelector('main').classList.classList('rwfl')
}else if (localStorage.Watchlist === '[]'){
    document.querySelector('.watchlist-empty').classList.toggle('hidden')
    document.querySelector('main').classList.add('rwfl')
}else {
    document.querySelector('main').classList.toggle('rwfl')
    let currentStorage = localStorage.getItem('Watchlist')
    let storedMovies = JSON.parse(currentStorage)
    omdbTitleSearch(storedMovies)
}

function omdbTitleSearch(searchData){
    let groupoFmOVIES = []
    searchData.forEach( movieData => {
        fetch(`https://www.omdbapi.com/?apikey=90353081&t=${movieData}`)
        .then(response => response.json())
        .then(data => {
            groupoFmOVIES.push(data)
            buildResults(data)
        })
    })
    function buildResults(data){
        Object.assign(this, data)
        const {Ratings, Poster, Title, Runtime, Genre, Plot} = this;
        const imdbRating = Ratings.length > 0 ? Ratings[0].Value.slice(0,3) : 'N/A';
        if(data.Response !== 'False'){
            movieResults.innerHTML = `
            <section class = "movie show">
                <div class = "poster">
                    <img src = "${Poster}" alt = "movie-poster">
                </div>
                <div class = "movie-info">
                    <h2>${Title} <span class = "rating-score">🌟${imdbRating}</span></h2>
                    <div class = "movie-details">
                        <p>${Runtime}</p>
                        <p>${Genre}</p>
                        <button class = "watch-list-btn add-btn-light" data-title = "${Title}">Watchlist</button>
                    </div>
                    <div class = "plot">
                        <p class = "expand-text">${Plot}</p>
                        <button class = "read-more">Read More</button>
                    </div>
                </div>
            </section>                    
            `;
            const expandText = document.querySelectorAll('.read-more')
            expandText.forEach((plot) => {
                plot.addEventListener('click', (e) =>{
                    let clicked = e.target.previousElementSibling;
                    if(clicked.classList.contains('expand-text')){
                        clicked.classList.toggle('expand-text')
                        e.target.innerText = "Read Less"
                    }else if(!clicked.classList.contains('expan-text')){
                        clicked.classList.toggle('expand-text')
                        e.target.innerText = "Read More"
                    }
                })
            })
        }
    }
    // Feature to add or remove movies from watchlist directly from search results
    const addToWatchList = document.querySelectorAll('.watch-list-btn');
    addToWatchList.forEach((wlBtn) =>{
        let currentStorage = localStorage.getItem('Watchlist')
        let storedMovies = JSON.parse(currentStorage);
        let verifyMovie = storedMovies.indexOf(wlBtn.CDATA_SECTION_NODE.title);
        if(verifyMovie > -1){
            wlBtn.classList.remove('add-btn-light')
            wlBtn.classList.add('remove-btn-light')
        }
        wlBtn.addEventListener('click', (e) =>{
            const addMovie = e.target.dataset.title;
            const papa = (((e.target.parentElement).parentElement).parentElement)
            if(!localStorage.getItem('Watchlist')){
                localStorage.setItem('Watchlist', JSON.stringify([addMovie]))
                e.target.classList.remove('add-btn-light')
                e.target.classList.add('remove-btn-light')
            }else {
                currentStorage = localStorage.getItem('WatchList');
                storedMovies = JSON.parse(currentStorage)
                verifyMovie = storedMovies.indexOf(addMovie);
                if(verifyMovie > -1){
                    storedMovies.splice(verifyMovie, 1)
                    localStorage.setItem('Watchlist', JSON.stringify(storedMovies))
                    const moviesRemaining = document.querySelectorAll('.movie')
                    if(moviesRemaining.length <= 1){
                        localStorage.removeItem('Watchlist')
                        document.querySelector('.watchlist-empty').classList.toggle('.hidden')
                        document.querySelector('.main').classList.add('rwfl')
                    }
                    papa.remove()
    
                }
            }
        })
        
        
    })

}