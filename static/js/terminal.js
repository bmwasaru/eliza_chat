const terminalOutput =
    document.getElementById("terminalOutput");

const chatForm =
    document.getElementById("chatForm");

const messageInput =
    document.getElementById("messageInput");

let terminalReady = false;
let sendingMessage = false;

const TYPE_SPEED = 22;
const BOOT_LINE_PAUSE = 220;

const bootSequence = [
    {
        text: "MIT ARTIFICIAL INTELLIGENCE LABORATORY",
        className: "system-important",
        delay: 500
    },
    {
        text: "MAC TIME-SHARING SYSTEM",
        className: "system-line",
        delay: 250
    },
    {
        text: "",
        className: "system-line",
        delay: 180
    },
    {
        text: "MEMORY CHECK ................. OK",
        className: "system-line",
        delay: 350
    },
    {
        text: "TERMINAL INTERFACE ........... ONLINE",
        className: "system-line",
        delay: 300
    },
    {
        text: "LISP ENVIRONMENT ............. READY",
        className: "system-line",
        delay: 300
    },
    {
        text: "",
        className: "system-line",
        delay: 150
    },
    {
        text: "LOADING ELIZA",
        className: "system-important",
        delay: 350
    },
    {
        text: "LOADING DOCTOR SCRIPT ........ DONE",
        className: "system-line",
        delay: 450
    },
    {
        text: "INITIALIZING PATTERN MATCHER . DONE",
        className: "system-line",
        delay: 350
    },
    {
        text: "",
        className: "system-line",
        delay: 300
    },
    {
        text: "ELIZA SYSTEM READY.",
        className: "system-important",
        delay: 500
    },
    {
        text: "",
        className: "system-line",
        delay: 250
    }
];

function sleep(milliseconds) {
    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                milliseconds
            )
    );
}

function scrollToBottom() {
    terminalOutput.scrollTop =
        terminalOutput.scrollHeight;
}

function createLine(className = "") {
    const line =
        document.createElement("div");

    line.classList.add("line");

    if (className) {
        line.classList.add(className);
    }

    terminalOutput.appendChild(line);

    scrollToBottom();

    return line;
}

async function typeText(
    element,
    text,
    speed = TYPE_SPEED
) {
    for (
        let index = 0;
        index < text.length;
        index++
    ) {
        element.textContent +=
            text[index];

        scrollToBottom();

        await sleep(speed);
    }
}

async function typeLine(
    text,
    className = "",
    speed = TYPE_SPEED
) {
    const line =
        createLine(className);

    await typeText(
        line,
        text,
        speed
    );

    return line;
}

async function runBootSequence() {
    chatForm.classList.add("hidden");

    for (
        const item of bootSequence
    ) {
        const line =
            createLine(
                item.className
            );

        if (item.text) {
            await typeText(
                line,
                item.text
            );
        }

        await sleep(
            item.delay ??
            BOOT_LINE_PAUSE
        );
    }

    await typeLine(
        "ELIZA> HELLO. PLEASE TELL ME YOUR PROBLEM.",
        "eliza-line",
        28
    );

    await sleep(300);

    terminalReady = true;

    chatForm.classList.remove("hidden");

    messageInput.focus();

    scrollToBottom();
}

function addUserMessage(text) {
    const line =
        createLine("user-line");

    line.textContent =
        `YOU> ${text}`;
}

async function addElizaMessage(text) {
    await typeLine(
        `ELIZA> ${text}`,
        "eliza-line",
        20
    );
}

async function showProcessing() {
    const line =
        createLine(
            "system-line"
        );

    line.id =
        "processingLine";

    await typeText(
        line,
        "ELIZA> ..."
    );
}

function removeProcessing() {
    document
        .getElementById(
            "processingLine"
        )
        ?.remove();
}

function resizeInput() {
    messageInput.style.height =
        "auto";

    messageInput.style.height =
        `${Math.min(
            messageInput.scrollHeight,
            130
        )}px`;
}

messageInput.addEventListener(
    "input",
    resizeInput
);

messageInput.addEventListener(
    "keydown",
    event => {
        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {
            event.preventDefault();

            chatForm.requestSubmit();
        }
    }
);

chatForm.addEventListener(
    "submit",
    async event => {
        event.preventDefault();

        if (
            !terminalReady ||
            sendingMessage
        ) {
            return;
        }

        const message =
            messageInput
                .value
                .trim();

        if (!message) {
            return;
        }

        sendingMessage = true;

        addUserMessage(
            message
        );

        messageInput.value = "";

        resizeInput();

        messageInput.disabled =
            true;

        await showProcessing();

        try {
            const response =
                await fetch(
                    "/chat",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                message
                            })
                    }
                );

            const data =
                await response.json();

            removeProcessing();

            if (!response.ok) {
                await addElizaMessage(
                    data.error ??
                    "TERMINAL COMMUNICATION ERROR."
                );

                return;
            }

            await addElizaMessage(
                data.response
            );
        } catch (error) {
            removeProcessing();

            await addElizaMessage(
                "COMMUNICATION CHANNEL FAILURE."
            );

            console.error(
                error
            );
        } finally {
            sendingMessage = false;

            messageInput.disabled =
                false;

            messageInput.focus();
        }
    }
);

window.addEventListener(
    "load",
    runBootSequence
);
