"use strict";

const heroImg = document.querySelector(".hero-img");
const tagline = document.querySelector(".tagline");
const countdown = document.querySelector(".countdown");
const countdownNodes = countdown.children;
const slidesList = document.querySelectorAll(".slide");
const slides = Array.from(slidesList);
const taskBar = document.querySelector(".task-bar");
const progress = document.querySelector(".progress");
const closeBtn = document.querySelector(".close");

const learnMore = document.querySelector(".learn-more");
const discoverBtn = document.querySelector(".learn-more-text");
const beginStoryBtn = document.querySelector(".begin-story");
const playPauseBtn = document.querySelector(".play-pause-btn");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const replayBtn = document.querySelector(".replay-btn");

let slideshowStarted = false; //set initial controls to not display until slideshow starts
let current = 1; //keeps track of current slide displayed
let playPauseBool = false; //keeps track of whether the slideshow is paused or not
let timer; //keep track of delay in case of pause and restart
let timerStart; //check if there is a running timer
let autoStartTimer; //autoplay timer
let remainingTime = 7000; //default display time for 1 slide

const heroOverlays = ["kitchen", "wardrobe", "bedroom", "none"]; //overlays to be changed with slide change

let forward = true; //changes to false if prev button clicked


//set a delay for initial effects to load
document.addEventListener("DOMContentLoaded", () => {
  // 3. Set a timer to execute after 2000 milliseconds (2 seconds)
  tagline.classList.remove("init");
  discoverBtn.style.display = "none";
  heroImg.classList.remove("initial");

  const skipAutoPlay = sessionStorage.getItem("skipAutoPlay");

  if (skipAutoPlay !== "true") {
    let count = 0;
    const loadingInterval = setInterval(() => {
      if (count < countdownNodes.length) {
        countdownNodes[count].classList.add("current-span");
        count++;
      }
    }, 1000);
    autoStartTimer = setTimeout(() => {
      prepareSlideshow();
    }, 7000);
  } else {
    discoverBtn.style.display = "block";
    tagline.style.display = "none";
    countdown.style.display = "none";
    stopSlideshow();
  }

  sessionStorage.removeItem("skipAutoPlay");

  // Navigation links
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (link) {
      sessionStorage.setItem("skipAutoPlay", "true");
    }
  });
});

discoverBtn.addEventListener("click", () => {
  prepareSlideshow();
});

const changeSlides = () => {
  slides.forEach((slide) => {
    if (slide.dataset.slideNum * 1 === current) {
      slide.classList.add("active");
      heroImg.classList.add(heroOverlays[current - 1]);
      progress.innerText = `${slide.dataset.slideNum}/${slidesList.length}`;
    } else if (slide.classList.contains("active")) {
      slide.classList.remove("active");
      changeHighlight(forward);
    }
  });
};

const prepareSlideshow = () => {
  if (!slideshowStarted) {
    slideshowStarted = true;
    tagline.style.display = "none";
    countdown.style.display = "none";

    taskBar.style.visibility = "hidden";
    changeSlides();
    progress.style.display = "block";
    closeBtn.style.display = "block";
    playPauseBtn.style.display = "block";
    prev.style.display = "block";
    next.style.display = "block";
    playPauseBtn.classList.add("is-playing");
    playPauseBool = true;
    remainingTime = 7000;
    startTimer();
  }
};
learnMore.addEventListener("click", () => {
  prepareSlideshow();
});

closeBtn.addEventListener("click", () => stopSlideshow());

playPauseBtn.addEventListener("click", () => {
  playPauseBool = !playPauseBool;
  playPauseBtn.classList.toggle("is-playing");

  if (playPauseBool) {
    startTimer();
  } else {
    clearTimeout(timer);
    remainingTime = 1000;
  }
});

next.addEventListener("click", () => {
  if (current < slides.length) {
    // stop autoplay
    playPauseBool = false;
    clearTimeout(timer);
    remainingTime = 1000;
    forward = true;
    current++;
    changeSlides();

    playPauseBtn.classList.remove("is-playing");
  } else {
    stopSlideshow();
  }
});

prev.addEventListener("click", () => {
  if (current > 1) {
    // stop autoplay
    playPauseBool = false;
    clearTimeout(timer);
    remainingTime = 1000;
    forward = false;
    current--;
    changeSlides();
    playPauseBtn.classList.remove("is-playing");
  } else {
    stopSlideshow();
  }
});



const changeHighlight = (forward) => {
  if (forward) {
    if (heroOverlays[current - 1] !== heroOverlays[current]) {
      heroImg.classList.forEach((item) => {
        if (item !== "hero-img") {
          heroImg.classList.remove(item);
        }
        if (current === 1) {
          heroImg.classList.add(heroOverlays[current - 1]);
        }
      });
    }
  } else {
    if (heroOverlays[current] !== heroOverlays[current - 1]) {
      heroImg.classList.forEach((item) => {
        if (item !== "hero-img") {
          heroImg.classList.remove(item);
        }
      });
    }
  }
};

const startTimer = () => {
  clearTimeout(timer);

  timerStart = Date.now();

  forward = true;
  timer = setTimeout(() => {
    current++;

    if (current > slides.length) {
      stopSlideshow();
      return;
    }

    changeSlides();

    remainingTime = 7000;
    startTimer();
    if (current === slidesList.length) {
      setTimeout(() => stopSlideshow(), 3000);
    }
  }, remainingTime);
};

const stopSlideshow = () => {
  clearTimeout(autoStartTimer);
  clearTimeout(timer);
  slideshowStarted = false;
  current = 1;
  remainingTime = 7000;
  slides.forEach((slide) => {
    slide.classList.remove("active");
  });

  slides[slides.length - 1].classList.add("active");
  heroImg.classList.forEach((item) => {
    if (item !== "hero-img") {
      heroImg.classList.remove(item);
    }
  });
  playPauseBtn.classList.remove("is-playing");
  playPauseBtn.style.display = "none";
  progress.style.display = "none";
  closeBtn.style.display = "none";
  prev.style.display = "none";
  next.style.display = "none";
  taskBar.style.visibility = "visible";
  discoverBtn.style.display = "none";
  setTimeout(() => {
    beginStoryBtn.style.display = "block";
    replayBtn.style.display = "block";
  }, 1000);
};

replayBtn.addEventListener("click", () => {
  replay();
});

function replay() {
  forward = true; //
  replayBtn.style.display = "none"; //
  prepareSlideshow();
}

// kitchens-page scripts
