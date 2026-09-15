// ================================
// DATA
// ================================

let profile = JSON.parse(localStorage.getItem("profile")) || {
    name: "Your Name",
    avatar: "👤",
    bio: "I love music!"
};

let playlists =
    JSON.parse(localStorage.getItem("playlists")) || [];


// ================================
// PAGE NAVIGATION
// ================================

function showPage(pageName) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.add("hidden");
    });

    document.getElementById(pageName)
        .classList.remove("hidden");

    if (pageName === "home") {
        displayPlaylists();
    }

    if (pageName === "profile") {
        displayProfile();
    }
}


// ================================
// CREATE PLAYLIST POST
// ================================

function createPost() {

    const title =
        document.getElementById("playlistTitle").value.trim();

    const link =
        document.getElementById("playlistLink").value.trim();

    const description =
        document.getElementById("playlistDescription").value.trim();


    if (!title || !link) {
        alert("Please enter a title and Spotify link.");
        return;
    }


    if (!link.includes("spotify.com")) {
        alert("Please enter a valid Spotify link.");
        return;
    }


    const playlist = {

        id: Date.now(),

        title: title,

        link: link,

        description: description,

        author: profile.name,

        ratingTotal: 0,

        ratingCount: 0

    };


    playlists.unshift(playlist);

    saveData();


    document.getElementById("playlistTitle").value = "";
    document.getElementById("playlistLink").value = "";
    document.getElementById("playlistDescription").value = "";


    alert("Playlist posted! 🎵");

    showPage("home");
}


// ================================
// DISPLAY PLAYLISTS
// ================================

function displayPlaylists() {

    const container =
        document.getElementById("playlistContainer");

    container.innerHTML = "";


    if (playlists.length === 0) {

        container.innerHTML = `
            <p style="color:#aaa">
                No playlists yet. Be the first to post one!
            </p>
        `;

        return;
    }


    playlists.forEach(playlist => {

        const average =
            playlist.ratingCount === 0
                ? "No ratings"
                : (
                    playlist.ratingTotal /
                    playlist.ratingCount
                ).toFixed(1);


        const card = document.createElement("div");

        card.className = "playlist-card";


        card.innerHTML = `

            <h3>${escapeHTML(playlist.title)}</h3>

            <p class="author">
                👤 ${escapeHTML(playlist.author)}
            </p>

            <p>
                ${escapeHTML(playlist.description)}
            </p>

            <div class="rating">

                ⭐ <strong>${average}</strong>

                ${
                    playlist.ratingCount > 0
                    ? `(${playlist.ratingCount} ratings)`
                    : ""
                }

            </div>

            <div>

                ${createStars(playlist.id)}

            </div>

            <br>

            <a
                class="spotify-button"
                href="${playlist.link}"
                target="_blank"
                rel="noopener noreferrer"
            >
                🎵 Open Spotify
            </a>

        `;


        container.appendChild(card);

    });

}


// ================================
// STAR RATING
// ================================

function createStars(id) {

    let html = "";

    for (let i = 1; i <= 5; i++) {

        html += `
            <span
                class="star"
                onclick="ratePlaylist(${id}, ${i})"
            >
                ★
            </span>
        `;

    }

    return html;
}


function ratePlaylist(id, rating) {

    const playlist =
        playlists.find(p => p.id === id);

    if (!playlist) return;


    playlist.ratingTotal += rating;

    playlist.ratingCount++;


    saveData();

    displayPlaylists();


    alert(`You rated this playlist ${rating}/5 ⭐`);

}


// ================================
// PROFILE
// ================================

function displayProfile() {

    document.getElementById("profileName")
        .textContent = profile.name;

    document.getElementById("profileAvatar")
        .textContent = profile.avatar;

    document.getElementById("profileBio")
        .textContent = profile.bio;


    const container =
        document.getElementById("myPlaylists");

    container.innerHTML = "";


    const mine =
        playlists.filter(
            playlist =>
                playlist.author === profile.name
        );


    if (mine.length === 0) {

        container.innerHTML = `
            <p style="color:#aaa">
                You haven't posted any playlists yet.
            </p>
        `;

        return;
    }


    mine.forEach(playlist => {

        const average =
            playlist.ratingCount === 0
                ? "No ratings"
                : (
                    playlist.ratingTotal /
                    playlist.ratingCount
                ).toFixed(1);


        container.innerHTML += `

            <div class="playlist-card">

                <h3>
                    ${escapeHTML(playlist.title)}
                </h3>

                <p>
                    ${escapeHTML(playlist.description)}
                </p>

                <div class="rating">
                    ⭐ ${average}
                </div>

                <a
                    class="spotify-button"
                    href="${playlist.link}"
                    target="_blank"
                >
                    Open Spotify
                </a>

            </div>

        `;

    });

}


// ================================
// EDIT PROFILE
// ================================

function editProfile() {

    document.getElementById("newName").value =
        profile.name;

    document.getElementById("newAvatar").value =
        profile.avatar;

    document.getElementById("newBio").value =
        profile.bio;


    document.getElementById("profileModal")
        .classList.remove("hidden");
}


function saveProfile() {

    const newName =
        document.getElementById("newName").value.trim();

    const newAvatar =
        document.getElementById("newAvatar").value.trim();

    const newBio =
        document.getElementById("newBio").value.trim();


    if (!newName) {
        alert("Please enter a username.");
        return;
    }


    const oldName = profile.name;


    profile.name = newName;
    profile.avatar = newAvatar || "👤";
    profile.bio = newBio;


    // Update author's name on existing posts
    playlists.forEach(playlist => {

        if (playlist.author === oldName) {
            playlist.author = newName;
        }

    });


    saveData();

    closeModal();

    displayProfile();
}


function closeModal() {

    document.getElementById("profileModal")
        .classList.add("hidden");
}


// ================================
// SAVE DATA
// ================================

function saveData() {

    localStorage.setItem(
        "profile",
        JSON.stringify(profile)
    );

    localStorage.setItem(
        "playlists",
        JSON.stringify(playlists)
    );

}


// ================================
// SECURITY
// ================================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ================================
// START WEBSITE
// ================================

displayPlaylists();
displayProfile();