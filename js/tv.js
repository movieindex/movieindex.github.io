if (!params.hasOwnProperty("id")){
    document.querySelector(".brand-logo").click()
}

axios({
    method: "GET",
    url: `https://api.themoviedb.org/3/tv/${params.id}?api_key=${API_KEY}&language=en-US&append_to_response=episode_groups`
}).then((response) => {
    let data = response.data

    document.querySelector("#backdrop").src = `https://www.themoviedb.org/t/p/original/${data.backdrop_path}`
    document.querySelector("#tagline").innerHTML = data.tagline
    document.querySelector("#title").innerHTML = data.name
    document.querySelector("#release").innerHTML = `${data.first_air_date} - ${data.last_air_date}`

    axios({
        method: "GET",
        url: `https://api.themoviedb.org/3/tv/${params.id}/external_ids?api_key=${API_KEY}&language=en-US`
    }).then((response) => {
        let data = response.data

        document.querySelector("#imdb").href = `https://www.imdb.com/title/${data.imdb_id}`
        document.querySelector("#themoviedb").href = `https://www.themoviedb.org/tv/${params.id}`
    })

    let genres = []

    data.genres.forEach((genre) => {
        genres.push(genre.name)
    })

    document.querySelector("#genres").innerHTML = genres.join(", ")

    if (data.episode_run_time.length !== 0){
        let hours = Math.floor(data.episode_run_time[0] / 60)
        let minutes = Math.floor(data.episode_run_time[0] % 60)

        let hoursCaption = "hours"
        if (hours == 1) hoursCaption = "hour"

        let minutesCaption = "minutes"
        if (minutes == 1) minutesCaption = "minute"

        if (minutes != 0 && hours != 0){
            document.querySelector("#runtime").innerHTML = `${hours} ${hoursCaption} and ${minutes} ${minutesCaption}`
        } else if (hours != 0 && minutes == 0) {
            document.querySelector("#runtime").innerHTML = `${hours} ${hoursCaption}`
        } else if (minutes != 0 && hours == 0){
            document.querySelector("#runtime").innerHTML = `${minutes} ${minutesCaption}`
        }
    } else {
        document.querySelector("#runtime").innerHTML = "Unknown Runtime"
    }

    document.querySelector("#rating").innerHTML = Math.round(data.vote_average * 10) / 10
    document.querySelector("#vote-count").innerHTML = data.vote_count

    document.querySelector("#overview").innerHTML = data.overview

    document.querySelector("#status").innerHTML = data.status
    document.querySelector("#website").innerHTML = `<a href="${data.homepage}" target="_blank">${data.homepage}</a>`

    axios({
        method: "GET",
        url: `https://api.themoviedb.org/3/tv/${params.id}/credits?api_key=${API_KEY}&language=en-US`
    }).then((response) => {
        let data = response.data

        data.cast.forEach((person) => {
            document.querySelector("#cast").innerHTML += `
            <a class="movie-card movie-card-small tooltipped" href="person.html?id=${person.id}" data-position="bottom" data-tooltip="${person.name}<br>${person.character}">
                <div class="card grey darken-3">
                    <div class="card-image">
                        <img src="https://image.tmdb.org/t/p/w276_and_h350_face/${person.profile_path}" onerror="this.src = 'img/person.png'">
                    </div>
                    <div class="card-content">
                        <p class="movie-card-title"><b>${person.name}</b></p>
                        <p class="job">as ${person.character}</p>
                    </div>
                </div>
            </a>
            `
        })

        let featured = []

        data.crew.forEach((person) => {
            document.querySelector("#crew").innerHTML += `
            <a class="movie-card movie-card-small tooltipped" href="person.html?id=${person.id}" data-position="bottom" data-tooltip="${person.name}<br>${person.job}">
                <div class="card grey darken-3">
                    <div class="card-image">
                        <img src="https://image.tmdb.org/t/p/w276_and_h350_face/${person.profile_path}" onerror="this.src = 'img/person.png'">
                    </div>
                    <div class="card-content">
                        <p class="movie-card-title"><b>${person.name}</b></p>
                        <p class="job">${person.job}</p>
                    </div>
                </div>
            </a>
            `

            if (person.job == "Director" || person.job == "Screenplay" || person.job == "Writer" || person.job == "Creator") featured.push(person)
        })

        featured.forEach((person) => {
            document.querySelector("#featured").innerHTML += `
            <a class="movie-card movie-card-medium tooltipped" href="person.html?id=${person.id}" data-position="bottom" data-tooltip="${person.name}<br>${person.job}">
                <div class="card grey darken-3">
                    <div class="card-image">
                        <img src="https://image.tmdb.org/t/p/w276_and_h350_face/${person.profile_path}" onerror="this.src = 'img/person.png'">
                    </div>
                    <div class="card-content">
                        <p class="movie-card-title"><b>${person.name}</b></p>
                        <p class="job">${person.job}</p>
                    </div>
                </div>
            </a>
            `
        })
    })

    data.seasons.forEach((season) => {
        document.querySelector("#seasons").innerHTML += `
        <li>
            <div class="collapsible-header grey darken-3"><i class="material-icons">playlist_play</i>${season.name}</div>
            <div class="collapsible-body season-episode" id="season-${season.id}"></div>
        </li>
        `

        axios({
            method: "GET",
            url: `https://api.themoviedb.org/3/tv/${params.id}/season/${season.season_number}?api_key=${API_KEY}&language=en-US`
        }).then((response) => {
            let data = response.data

            console.log(data)

            data.episodes.forEach((episode) => {
                let runtime = "Unknown Runtime"

                let hours = Math.floor(episode.runtime / 60)
                let minutes = Math.floor(episode.runtime % 60)
        
                let hoursCaption = "hours"
                if (hours == 1) hoursCaption = "hour"
        
                let minutesCaption = "minutes"
                if (minutes == 1) minutesCaption = "minute"
        
                if (minutes != 0 && hours != 0){
                    runtime = `${hours} ${hoursCaption} and ${minutes} ${minutesCaption}`
                } else if (hours != 0 && minutes == 0) {
                    runtime = `${hours} ${hoursCaption}`
                } else if (minutes != 0 && hours == 0){
                    runtime = `${minutes} ${minutesCaption}`
                }

                document.querySelector(`#season-${data.id}`).innerHTML += `
                <img class="episode-still" onerror="this.src = 'img/still.png'" src="https://www.themoviedb.org/t/p/original/${episode.still_path}">
                <div class="episode-info">
                    <h3>${episode.episode_number}. ${episode.name}</h3>
                    <p>Aired ${episode.air_date} &bull; ${runtime}</p>
                    <p>${episode.overview}</p>
                    <p><i class="tiny material-icons">star</i> ${Math.round(episode.vote_average * 10) / 10}</p>
                </div>
                <br>
                `
            })
        })
    })

    $("#seasons").collapsible()

    axios({
        method: "GET",
        url: `https://api.themoviedb.org/3/tv/${params.id}/videos?api_key=${API_KEY}&language=en-US`
    }).then((response) => {
        let data = response.data

        data.results.forEach((video) => {
            if (video.site == "YouTube"){
                document.querySelector("#videos").innerHTML += `
                <li>
                    <div class="collapsible-header grey darken-3"><i class="material-icons">video_library</i>${video.type}</div>
                    <div class="collapsible-body">
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/${video.key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                </li>
                `
            }
        })

        $("#videos").collapsible()
    })

    axios({
        method: "GET",
        url: `https://api.themoviedb.org/3/tv/${params.id}/recommendations?api_key=${API_KEY}&language=en-US&page=1`
    }).then((response) => {
        let data = response.data

        if (data.results.length === 0){
            document.querySelector("#recommended").innerHTML = `<h5>No results</h5>`
        }

        data.results.forEach((movie) => {
            if (movie.poster_path == undefined) return
    
            document.querySelector("#recommended").innerHTML += `
            <a class="movie-card movie-card-medium tooltipped" href="${movie.media_type}.html?id=${movie.id}" data-tooltip="${movie.title || movie.name}">
                <div class="card grey darken-3">
                    <div class="card-image">
                        <img src="https://image.tmdb.org/t/p/w440_and_h660_face/${movie.poster_path}">
                    </div>
                    <div class="card-content">
                        <p class="movie-card-title"><b>${movie.title || movie.name}</b></p>
                        <p>${movie.release_date || movie.first_air_date}</p>
                        <p><i class="tiny material-icons">star</i> ${Math.round(movie.vote_average * 10) / 10}</p>
                    </div>
                </div>
            </a>
            `
        })
    })

    axios({
        method: "GET",
        url: `https://api.themoviedb.org/3/tv/${params.id}/similar?api_key=${API_KEY}&language=en-US&page=1`
    }).then((response) => {
        let data = response.data

        data.results.forEach((movie) => {
            if (movie.poster_path == undefined) return
    
            document.querySelector("#similar").innerHTML += `
            <a class="movie-card movie-card-medium tooltipped" href="movie.html?id=${movie.id}" data-tooltip="${movie.title || movie.name}">
                <div class="card grey darken-3">
                    <div class="card-image">
                        <img src="https://image.tmdb.org/t/p/w440_and_h660_face/${movie.poster_path}">
                    </div>
                    <div class="card-content">
                        <p class="movie-card-title"><b>${movie.title || movie.name}</b></p>
                        <p>${movie.release_date || movie.first_air_date}</p>
                        <p><i class="tiny material-icons">star</i> ${Math.round(movie.vote_average * 10) / 10}</p>
                    </div>
                </div>
            </a>
            `
        })

        $(".tooltipped").tooltip()
    })
})

document.addEventListener("DOMContentLoaded", () => {
    $("#castcrew-tabs").tabs()
})