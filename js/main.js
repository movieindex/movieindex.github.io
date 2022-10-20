axios({
    method: "GET",
    url: `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`
}).then((response) => {
    let data = response.data

    data.results.forEach((movie) => {
        document.querySelector("#trending-day").innerHTML += `
        <a class="movie-card tooltipped" href="${movie.media_type}.html?id=${movie.id}" data-tooltip="${movie.title || movie.name}">
            <div class="card grey darken-3">
                <div class="card-image">
                    <img onerror="this.src = 'img/image.png'" src="https://image.tmdb.org/t/p/w440_and_h660_face/${movie.poster_path}">
                </div>
                <div class="card-content">
                    <p class="movie-card-title"><b>${movie.title || movie.name}</b></p>
                    <p>${movie.release_date || movie.first_air_date || "Unknown Release Date"}</p>
                    <p><i class="tiny material-icons">star</i> ${Math.round(movie.vote_average * 10) / 10}</p>
                </div>
            </div>
        </a>
        `
    })
})

axios({
    method: "GET",
    url: `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}`
}).then((response) => {
    let data = response.data

    data.results.forEach((movie) => {
        document.querySelector("#trending-week").innerHTML += `
        <a class="movie-card tooltipped" href="${movie.media_type}.html?id=${movie.id}" data-position="bottom" data-tooltip="${movie.title || movie.name}">
            <div class="card grey darken-3">
                <div class="card-image">
                    <img onerror="this.src = 'img/image.png'" src="https://image.tmdb.org/t/p/w440_and_h660_face/${movie.poster_path}">
                </div>
                <div class="card-content">
                    <p class="movie-card-title"><b>${movie.title || movie.name}</b></p>
                    <p>${movie.release_date || movie.first_air_date || "Unknown Release Date"}</p>
                    <p><i class="tiny material-icons">star</i> ${Math.round(movie.vote_average * 10) / 10}</p>
                </div>
            </div>
        </a>
        `
    })

    $(".tooltipped").tooltip()
})

document.addEventListener("DOMContentLoaded", () => {
    $("#trending-tabs").tabs()
})