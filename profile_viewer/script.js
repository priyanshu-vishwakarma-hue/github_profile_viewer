const apiKey = "TEST_API_KEY_DO_NOT_USE";
const form = document.getElementById("searchForm");
const input = document.getElementById("input");
const statusText = document.getElementById("status");
const result = document.getElementById("result");
const searchButton = document.getElementById("search");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = input.value.trim();

    if (!username) {
        setStatus("Please enter a GitHub username.", true);
        input.focus();
        return;
    }

    showLoading();

    try {
        const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);

        if (!response.ok) {
            throw new Error(response.status === 404 ? "User not found." : "Unable to fetch profile right now.");
        }

        const data = await response.json();
        displayUser(data);
        setStatus(`Showing profile for ${data.login}.`, false);
    } catch (error) {
        result.style.display = "none";
        result.innerHTML = "";
        setStatus(error.message || "Something went wrong. Please try again.", true);
    } finally {
        setBusy(false);
    }
});

function setBusy(isBusy) {
    result.setAttribute("aria-busy", String(isBusy));
    searchButton.disabled = isBusy;
}

function setStatus(message, isError) {
    statusText.textContent = message;
    statusText.classList.toggle("error", Boolean(isError));
}

function showLoading() {
    setBusy(true);
    setStatus("Loading profile...", false);
    result.style.display = "block";
    result.innerHTML = `<div class="loader_wrap" aria-hidden="true"><span class="loader"></span></div>`;
}

function displayUser(data) {
    const bio = data.bio || "No bio available.";

    result.innerHTML = `
        <div class="personal_info">
            <img src="${data.avatar_url}" alt="${escapeAttribute(data.login)} profile avatar" class="profile_image">
            <div class="personal_info_text">
                <p id="name"></p>
                <p id="skill"></p>
            </div>
        </div>
        <div class="follow_box">
            <div class="follow">
                <div class="follow_stat">
                    <p class="follow_stat_label">Followers</p>
                    <p class="follow_stat_value" id="followers"></p>
                </div>
                <div class="follow_stat">
                    <p class="follow_stat_label">Following</p>
                    <p class="follow_stat_value" id="following"></p>
                </div>
                <div class="follow_stat">
                    <p class="follow_stat_label">Repositories</p>
                    <p class="follow_stat_value" id="public_repos"></p>
                </div>
            </div>
            <a id="profile_link" target="_blank" rel="noopener noreferrer">
                <button class="visit" type="button">Visit Profile</button>
            </a>
        </div>
    `;

    result.querySelector("#name").textContent = data.login;
    result.querySelector("#skill").textContent = bio;
    result.querySelector("#followers").textContent = String(data.followers);
    result.querySelector("#following").textContent = String(data.following);
    result.querySelector("#public_repos").textContent = String(data.public_repos);
    result.querySelector("#profile_link").href = data.html_url;
    result.style.display = "flex";
}

function escapeAttribute(value) {
    return String(value).replace(/["&'<>]/g, (char) => ({
        '"': "&quot;",
        "&": "&amp;",
        "'": "&#39;",
        "<": "&lt;",
        ">": "&gt;"
    }[char]));
}
