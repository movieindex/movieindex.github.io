function search_full(query){
    document.querySelectorAll(".search-imdb").forEach((e) => {
        e.href = `https://www.imdb.com/find?q=${query}`
    })

    document.querySelectorAll(".search-themoviedb").forEach((e) => {
        e.href = `https://www.themoviedb.org/search?query=${query}`
    })

    document.querySelector("#search-results").innerHTML = ""

    axios({
        method: "GET",
        url: `https://api.themoviedb.org/3/search/multi?query=${query}&api_key=${API_KEY}&language=en-US&page=1`
    }).then((response) => {
        let results = response.data.results

        results.forEach((result) => {
            if (result.media_type == "movie" || result.media_type == "tv"){
                document.querySelector("#search-results").innerHTML += `
                <a class="movie-card movie-card-medium tooltipped" href="${result.media_type}.html?id=${result.id}" data-tooltip="${result.title || result.name}">
                    <div class="card grey darken-3">
                        <div class="card-image">
                            <img onerror="this.src = 'img/image.png'" src="https://image.tmdb.org/t/p/w440_and_h660_face/${result.poster_path}">
                        </div>
                        <div class="card-content">
                            <p class="movie-card-title"><b>${result.title || result.name}</b></p>
                            <p>${result.release_date || result.first_air_date || "Unknown Release Date"}</p>
                            <p><i class="tiny material-icons">star</i> ${Math.round(result.vote_average * 10) / 10}</p>
                        </div>
                    </div>
                </a>
                `
            } else if (result.media_type == "person"){
                let known_for = []

                result.known_for.forEach((movie) => {
                    known_for.push(movie.title || movie.name)
                })

                let known_for_text = known_for.slice(0, 2).join(", ")

                document.querySelector("#search-results").innerHTML += `
                <a class="movie-card movie-card-medium tooltipped" href="person.html?id=${result.id}" data-tooltip="${result.name}<br>Known for ${known_for_text}">
                    <div class="card grey darken-3">
                        <div class="card-image">
                            <img onerror="this.src = 'img/person.png'" src="https://image.tmdb.org/t/p/w440_and_h660_face/${result.profile_path}">
                        </div>
                        <div class="card-content">
                            <p class="movie-card-title"><b>${result.name}</b></p>
                            <p class="text-overflow">Known for ${known_for_text}</p>
                        </div>
                    </div>
                </a>
                `
            }
        })

        $(".tooltipped").tooltip()
    })
}

if (params.hasOwnProperty("q")){
    search_full(params.q)
    searchBar.value = params.q
    M.updateTextFields()
}

searchBar.oninput = () => {
    setTimeout(() => {
        search_full(searchBar.value)
    }, 1000)
}