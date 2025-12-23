import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

function loadTweetsFromLocalStorage() {
  const savedStates = localStorage.getItem("tweetStates");

  if (savedStates) {
    const tweetStates = JSON.parse(savedStates);

    tweetsData.forEach(function (tweet) {
      if (tweetStates[tweet.uuid]) {
        tweet.likes = tweetStates[tweet.uuid].likes;
        tweet.isLiked = tweetStates[tweet.uuid].isLiked;
        tweet.reposts = tweetStates[tweet.uuid].reposts;
        tweet.isReposted = tweetStates[tweet.uuid].isReposted;
      }
    });
  }
}

function saveTweetsToLocalStorage() {
  const tweetStates = {};

  tweetsData.forEach(function (tweet) {
    tweetStates[tweet.uuid] = {
      likes: tweet.likes,
      isLiked: tweet.isLiked,
      reposts: tweet.reposts,
      isReposted: tweet.isReposted,
    };
  });

  localStorage.setItem("tweetStates", JSON.stringify(tweetStates));
}

document.addEventListener("click", function (e) {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.repost) {
    handleRepostClick(e.target.dataset.repost);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtnClick();
  }
});

function handleLikeClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--;
  } else {
    targetTweetObj.likes++;
  }
  targetTweetObj.isLiked = !targetTweetObj.isLiked;
  render();
  saveTweetsToLocalStorage();
}

function handleRepostClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isReposted) {
    targetTweetObj.reposts--;
  } else {
    targetTweetObj.reposts++;
  }
  targetTweetObj.isReposted = !targetTweetObj.isReposted;
  render();
  saveTweetsToLocalStorage();
}

function handleReplyClick(replyId) {
  document.getElementById(`replies-${replyId}`).classList.toggle("hidden");
}

function handleTweetBtnClick() {
  const tweetInput = document.getElementById("tweet-input");
  const emptyMessage = document.getElementById("empty-message");

  if (tweetInput.value) {
    tweetsData.unshift({
      handle: `@Scrimba`,
      profilePic: `assets/scrimbalogo.png`,
      likes: 0,
      reposts: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isReposted: false,
      uuid: uuidv4(),
    });
    render();
    tweetInput.value = "";
    emptyMessage.textContent = ""; // Clear the error message on success
  } else {
    emptyMessage.textContent =
      "Message is empty. Write something first and try again.";
  }
}

function getFeedHtml() {
  let feedHtml = ``;

  tweetsData.forEach(function (tweet) {
    const likeIconClass = tweet.isLiked ? "liked" : "";
    const repostIconClass = tweet.isReposted ? "reposted" : "";

    let repliesHtml = "";

    if (tweet.replies.length > 0) {
      tweet.replies.forEach(function (reply) {
        repliesHtml += `
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`;
      });
    }

    feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-message"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
 
                <span class="tweet-detail">
                    <i class="fa-solid fa-repeat ${repostIconClass}"
                    data-repost="${tweet.uuid}"
                    ></i>
                    ${tweet.reposts}
                </span>

                               <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`;
  });
  return feedHtml;
}

function render() {
  document.getElementById("feed").innerHTML = getFeedHtml();
}

// Dark Mode

document.getElementById("theme-toggle").addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
}

loadTweetsFromLocalStorage();
render();
