if (!params.hasOwnProperty("id")){
    document.querySelector(".brand-logo").click()
}

axios({
    method: "GET",
    url: `https://api.themoviedb.org/3/person/${params.id}?api_key=${API_KEY}&language=en-US`
}).then((response) => {
    let data = response.data

    console.log(data)

    document.querySelector("#profile").src = `https://image.tmdb.org/t/p/w440_and_h660_face/${data.profile_path}`
    document.querySelector("#name").innerHTML = data.name
    document.querySelector("#born").innerHTML = `Born ${data.birthday}`
    if (data.deathday !== null) document.querySelector("#born").innerHTML = `Born ${data.birthday} &bull; Died ${data.deathday}`
    document.querySelector("#gender").innerHTML = (data.gender == 2) ? "Male" : (data.gender == 1) ? "Female" : "Not Specified"
    document.querySelector("#department").innerHTML = `Known for ${data.known_for_department.toLowerCase()}`

    document.querySelector("#imdb").href = `https://www.imdb.com/name/${data.imdb_id}`
    document.querySelector("#themoviedb").href = `https://www.themoviedb.org/person/${params.id}`
})

axios({
    method: "GET",
    url: `https://api.themoviedb.org/3/person/${params.id}/combined_credits?api_key=${API_KEY}&language=en-US`
}).then((response) => {
    let data = response.data

    console.log(data)

    data.cast.forEach((movie) => {
        document.querySelector("#filmography-cast").innerHTML += `
        <a class="movie-card tooltipped" href="${movie.media_type}.html?id=${movie.id}" data-tooltip="${movie.title || movie.name}">
            <div class="card grey darken-3">
                <div class="card-image">
                    <img onerror="this.src = 'img/image.png'" src="https://image.tmdb.org/t/p/w440_and_h660_face/${movie.poster_path}">
                </div>
                <div class="card-content">
                    <p class="movie-card-title"><b>${movie.title || movie.name}</b></p>
                    <p>${movie.release_date || movie.first_air_date || "Unknown Release Date"}</p>
                    <p>As ${movie.character}</p>
                    <p><i class="tiny material-icons">star</i> ${Math.round(movie.vote_average * 10) / 10}</p>
                </div>
            </div>
        </a>
        `
    })

    data.crew.forEach((movie) => {
        document.querySelector("#filmography-crew").innerHTML += `
        <a class="movie-card tooltipped" href="${movie.media_type}.html?id=${movie.id}" data-tooltip="${movie.title || movie.name}">
            <div class="card grey darken-3">
                <div class="card-image">
                    <img onerror="this.src = 'img/image.png'" src="https://image.tmdb.org/t/p/w440_and_h660_face/${movie.poster_path}">
                </div>
                <div class="card-content">
                    <p class="movie-card-title"><b>${movie.title || movie.name}</b></p>
                    <p>${movie.release_date || movie.first_air_date || "Unknown Release Date"}</p>
                    <p>${movie.job}</p>
                    <p><i class="tiny material-icons">star</i> ${Math.round(movie.vote_average * 10) / 10}</p>
                </div>
            </div>
        </a>
        `
    })
})

document.addEventListener("DOMContentLoaded", () => {
    $("#castcrew-tabs").tabs()
})