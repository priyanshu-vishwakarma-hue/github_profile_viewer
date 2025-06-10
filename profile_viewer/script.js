let userData="";
document.getElementById("search").addEventListener("click", function(){
    userData =document.getElementById("input").value;
    if(userData === ""){
        alert("Please enter a GitHub username");
        location.reload();
        return;
    }

    document.getElementsByClassName("seconddiv")[0].style.display = "flex";
    document.getElementsByClassName("seconddiv")[0].innerHTML = `<span class="loader"></span>`;

    async function apiCall(){
        const response = await fetch(`https://api.github.com/users/${userData}`);
        const data = await response.json();
        if(data.login === undefined){
            alert("User not found. Please enter a valid GitHub username.");
            location.reload();
            return;
        }
        displayuser(data);

    }

    apiCall();
});

function displayuser(data){
    const { login, avatar_url, bio, followers, following, public_repos } = data; // Destructuring the data object
    if(bio === null){
        data.bio = "  ";
    }
    document.getElementsByClassName("seconddiv")[0].innerHTML = 
            `<div class="personal_info">
                <img src=${data.avatar_url} alt="" class="profile_image">
                <div>
                    <p style="font-size: 25px ;" id="name">${data.login}</p>
                    <p id="skill"> ${data.bio}</p>
                </div>
            </div>
            <div class="follow_box">
                <div class="follow">
                    <div>
                        <p>Follower</p>
                        <p id="followers">${data.followers}</p>
                    </div>
                    <div>
                        <p>Following</p>
                        <p id="following">${data.following}</p>
                    </div>
                    <div>
                        <p>repository</p>
                        <p id="public_repos">${data.public_repos}</p>
                    </div>
                </div>
                <div  >
                    <a href=${data.html_url} target="_blank"> <button class="visit">VISIT PROFILE</button> </a>
                </div>
            </div>` 
}


