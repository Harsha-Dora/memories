// =========================================
// FIREBASE SETUP
// =========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyDXCA_o6ICRwxt_RRAV4PCawI363lOQI_g",
    authDomain: "friendship-wall.firebaseapp.com",
    projectId: "friendship-wall",
    storageBucket: "friendship-wall.firebasestorage.app",
    messagingSenderId: "1078363940207",
    appId: "1:1078363940207:web:9cdc6169d776543caff49a"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


/* =========================================
   SECRET PASSWORD LOCK
========================================= */

const lockScreen =
    document.getElementById("lockScreen");

const websiteContent =
    document.getElementById("websiteContent");

const passwordInput =
    document.getElementById("passwordInput");

const unlockButton =
    document.getElementById("unlockButton");

const passwordError =
    document.getElementById("passwordError");

const lockIcon =
    document.getElementById("lockIcon");


/*
    CHANGE YOUR PASSWORD HERE
*/

const SECRET_PASSWORD = "MJ0711Dora";


/* =========================================
   UNLOCK WEBSITE
========================================= */

function unlockWebsite() {

    const enteredPassword =
        passwordInput.value;


    /* Correct password */

    if (enteredPassword === SECRET_PASSWORD) {

        passwordError.classList.remove("show");

        /*
            Show the actual website.
        */

        websiteContent.classList.add("unlocked");


        /*
            Small delay gives the unlock
            animation time to begin.
        */

        setTimeout(async () => {

            lockScreen.classList.add("unlocking");


            /*
                MOST IMPORTANT PART:

                Background music starts ONLY
                after the password is correct.
            */

            backgroundMusic.volume = 0.38;

            try {

                await backgroundMusic.play();

                console.log(
                    "Background music started after unlock."
                );

            } catch (error) {

                console.log(
                    "Background music could not start:",
                    error
                );

            }

        }, 350);


        return;

    }


    /* =====================================
       WRONG PASSWORD
    ===================================== */

    passwordError.classList.add("show");

    lockScreen.classList.remove("shake");

    /*
        Force browser to restart animation.
    */

    void lockScreen.offsetWidth;

    lockScreen.classList.add("shake");

    passwordInput.value = "";

    passwordInput.focus();

}


/* =========================================
   UNLOCK BUTTON
========================================= */

unlockButton.addEventListener(
    "click",
    unlockWebsite
);


/* =========================================
   ENTER KEY
========================================= */

passwordInput.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {

            unlockWebsite();

        }

    }
);


/* =========================================
   ELEMENTS
========================================= */

const beginJourney =
    document.getElementById("beginJourney");

const storySection =
    document.getElementById("story");

const backgroundMusic =
    document.getElementById("backgroundMusic");

const birthdayAudio =
    document.getElementById("birthdayAudio");

const envelope =
    document.getElementById("envelope");

const envelopeInstruction =
    document.getElementById("envelopeInstruction");

const giftButton =
    document.getElementById("giftButton");

const openGiftText =
    document.getElementById("openGiftText");

const birthdayMessage =
    document.getElementById("birthdayMessage");


/* =========================================
   BACKGROUND MUSIC SETTINGS
========================================= */

backgroundMusic.volume = 0.5;

birthdayAudio.volume = 0.7;


/* =========================================
   BEGIN JOURNEY
========================================= */

beginJourney.addEventListener("click", () => {

    storySection.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

});


/* =========================================
   SCROLL REVEAL ANIMATION
========================================= */

const revealElements =
    document.querySelectorAll(".reveal");


const revealObserver =
    new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "visible"
                    );

                    /*
                        Once visible, it stays visible.
                        This helps the timeline feel
                        like completed scrapbook pages.
                    */

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },

        {

            threshold: 0.15,

            rootMargin:
                "0px 0px -70px 0px"

        }

    );


revealElements.forEach((element) => {

    revealObserver.observe(element);

});


/* =========================================
   ENVELOPE
========================================= */

function toggleEnvelope() {

    envelope.classList.toggle("open");


    if (
        envelope.classList.contains("open")
    ) {

        envelopeInstruction.textContent =
            "Click again to close";

    } else {

        envelopeInstruction.textContent =
            "Click the envelope to open";

    }

}


envelope.addEventListener(
    "click",
    toggleEnvelope
);


envelopeInstruction.addEventListener(
    "click",
    toggleEnvelope
);


/* =========================================
   GIFT
========================================= */

let giftOpened = false;

let savedBackgroundTime = 0;


/*
    Both clicking the gift itself
    and the text underneath open it.
*/

giftButton.addEventListener(
    "click",
    openGift
);


openGiftText.addEventListener(
    "click",
    openGift
);


async function openGift() {

    /*
        Prevent multiple birthday audios
        playing at once.
    */

    if (giftOpened) {

        return;

    }


    giftOpened = true;


    giftButton.classList.add("open");

    birthdayMessage.classList.add("show");

    openGiftText.textContent =
        "A little birthday message for you (JK) ❤️";


    /*
        Launch confetti.
    */

    startConfetti();


    /*
        Save the exact position of
        the background song.
    */

    savedBackgroundTime =
        backgroundMusic.currentTime;


    /*
        Fade background music out.
    */

    await fadeOutAudio(
        backgroundMusic,
        900
    );


    /*
        Pause it but DO NOT reset
        currentTime.
    */

    backgroundMusic.pause();


    /*
        Start birthday audio.
    */

    birthdayAudio.currentTime = 0;


    try {

        await birthdayAudio.play();

    } catch (error) {

        console.log(
            "Birthday audio could not play:",
            error
        );

    }

}


/* =========================================
   AFTER BIRTHDAY AUDIO FINISHES
========================================= */

birthdayAudio.addEventListener(
    "ended",

    async () => {

        /*
            Return background song to
            the exact position it had
            before the gift was opened.
        */

        backgroundMusic.currentTime =
            savedBackgroundTime;


        /*
            Start nearly silent.
        */

        backgroundMusic.volume = 0;


        try {

            await backgroundMusic.play();

            /*
                Fade background song
                gently back in.
            */

            fadeInAudio(
                backgroundMusic,
                0.38,
                1200
            );

        } catch (error) {

            console.log(
                "Background music could not resume:",
                error
            );

        }

    }

);


/* =========================================
   AUDIO FADE OUT
========================================= */

function fadeOutAudio(
    audio,
    duration = 1000
) {

    return new Promise((resolve) => {

        const startingVolume =
            audio.volume;

        const steps = 30;

        const intervalTime =
            duration / steps;

        let step = 0;


        const fadeInterval =
            setInterval(() => {

                step++;


                const percentage =
                    step / steps;


                audio.volume =
                    Math.max(
                        0,
                        startingVolume *
                        (1 - percentage)
                    );


                if (step >= steps) {

                    clearInterval(
                        fadeInterval
                    );

                    audio.volume = 0;

                    resolve();

                }

            }, intervalTime);

    });

}


/* =========================================
   AUDIO FADE IN
========================================= */

function fadeInAudio(
    audio,
    targetVolume = 0.38,
    duration = 1000
) {

    const steps = 30;

    const intervalTime =
        duration / steps;

    let step = 0;


    audio.volume = 0;


    const fadeInterval =
        setInterval(() => {

            step++;


            const percentage =
                step / steps;


            audio.volume =
                Math.min(
                    targetVolume,
                    targetVolume *
                    percentage
                );


            if (step >= steps) {

                clearInterval(
                    fadeInterval
                );

                audio.volume =
                    targetVolume;

            }

        }, intervalTime);

}


/* =========================================
   CONFETTI
========================================= */

const canvas =
    document.getElementById(
        "confettiCanvas"
    );


const ctx =
    canvas.getContext("2d");


let particles = [];

let confettiAnimation;


/*
    Resize canvas to fill screen.
*/

function resizeCanvas() {

    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight;

}


resizeCanvas();


window.addEventListener(
    "resize",
    resizeCanvas
);


/* =========================================
   CREATE CONFETTI
========================================= */

function createConfetti() {

    particles = [];


    const colors = [

        "#d88f91",

        "#efc4c3",

        "#c88386",

        "#f1d3bd",

        "#d8a7b1",

        "#ffffff",

        "#e9b8b7"

    ];


    for (let i = 0; i < 130; i++) {

        particles.push({

            x:
                Math.random() *
                canvas.width,

            y:
                Math.random() *
                -canvas.height,

            width:
                Math.random() *
                7 + 4,

            height:
                Math.random() *
                10 + 5,

            speed:
                Math.random() *
                3 + 2,

            drift:
                Math.random() *
                2 - 1,

            rotation:
                Math.random() *
                Math.PI,

            rotationSpeed:
                Math.random() *
                0.08 - 0.04,

            color:
                colors[
                    Math.floor(
                        Math.random() *
                        colors.length
                    )
                ]

        });

    }

}


/* =========================================
   DRAW CONFETTI
========================================= */

function drawConfetti() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    particles.forEach(
        (particle) => {

            particle.y +=
                particle.speed;

            particle.x +=
                particle.drift;

            particle.rotation +=
                particle.rotationSpeed;


            ctx.save();


            ctx.translate(
                particle.x,
                particle.y
            );


            ctx.rotate(
                particle.rotation
            );


            ctx.fillStyle =
                particle.color;


            ctx.fillRect(

                -particle.width / 2,

                -particle.height / 2,

                particle.width,

                particle.height

            );


            ctx.restore();


            /*
                Recycle particles that
                fall below the screen.
            */

            if (
                particle.y >
                canvas.height + 20
            ) {

                particle.y = -20;

                particle.x =
                    Math.random() *
                    canvas.width;

            }

        }
    );


    confettiAnimation =
        requestAnimationFrame(
            drawConfetti
        );

}


/* =========================================
   START CONFETTI
========================================= */

function startConfetti() {

    cancelAnimationFrame(
        confettiAnimation
    );


    createConfetti();

    drawConfetti();


    /*
        Stop after roughly 6 seconds.
    */

    setTimeout(() => {

        cancelAnimationFrame(
            confettiAnimation
        );


        ctx.clearRect(

            0,
            0,

            canvas.width,
            canvas.height

        );

    }, 6000);

}

// =========================================
// FRIENDSHIP WALL
// =========================================

const wallMessage = document.getElementById("wallMessage");
const postWallMessage = document.getElementById("postWallMessage");
const wallMessagesList = document.getElementById("wallMessagesList");
const wallStatus = document.getElementById("wallStatus");
const characterCount = document.getElementById("characterCount");

wallMessage.addEventListener("input", () => {
    characterCount.textContent =
        `${wallMessage.value.length} / 500`;
});

postWallMessage.addEventListener("click", async () => {

    const selectedAuthor = document.querySelector(
    'input[name="wallAuthor"]:checked'
    );

    const name = selectedAuthor.value;
    const message = wallMessage.value.trim();

    if (!message) {
        wallStatus.textContent = "Write something first. ❤️";
        wallMessage.focus();
        return;
    }

    postWallMessage.disabled = true;
    wallStatus.textContent = "Posting your message...";

    try {

        await addDoc(
            collection(db, "friendshipWall"),
            {
                name: name,
                message: message,
                createdAt: serverTimestamp()
            }
        );

        wallName.value = "";
        wallMessage.value = "";
        characterCount.textContent = "0 / 500";

        wallStatus.textContent =
            "Your message is on the wall. ❤️";

        setTimeout(() => {
            wallStatus.textContent = "";
        }, 3000);

    } catch (error) {

        console.error("Error posting message:", error);

        wallStatus.textContent =
            "Something went wrong. Please try again.";
    }

    postWallMessage.disabled = false;
});


// =========================================
// REAL-TIME WALL
// =========================================

const wallQuery = query(
    collection(db, "friendshipWall"),
    orderBy("createdAt", "desc")
);

onSnapshot(wallQuery, (snapshot) => {

    wallMessagesList.innerHTML = "";

    if (snapshot.empty) {

        wallMessagesList.innerHTML = `
            <div class="wall-empty">
                <span>♡</span>
                <p>
                    Our wall is waiting for its first memory...
                </p>
            </div>
        `;

        return;
    }

    snapshot.forEach((doc) => {

        const data = doc.data();

        const messageCard =
            document.createElement("div");

        messageCard.className =
            "wall-message-card";

        const nameElement =
            document.createElement("div");

        nameElement.className =
            "wall-message-name";

        nameElement.textContent =
            data.name;

        const messageElement =
            document.createElement("div");

        messageElement.className =
            "wall-message-text";

        messageElement.textContent =
            data.message;

        const dateElement =
            document.createElement("div");

        dateElement.className =
            "wall-message-date";

        if (data.createdAt) {

            const date =
                data.createdAt.toDate();

            dateElement.textContent =
                date.toLocaleDateString(
                    "en-IN",
                    {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    }
                );

        } else {

            dateElement.textContent =
                "Just now";
        }

        messageCard.appendChild(nameElement);
        messageCard.appendChild(messageElement);
        messageCard.appendChild(dateElement);

        wallMessagesList.appendChild(messageCard);
    });
});
