const containerElement = document.getElementById("container");
const targetElements = document.querySelectorAll(".target");

const INITIAL_TARGET_COLOR = "red";
const SELECTED_TARGET_COLOR = "blue";
const MOVABLE_TARGET_COLOR = "yellow";

const EVENT_LISTENER_OPTIONS = { once: true };

const TIMEOUT_LIMIT = 250;
let timeoutId;

let selectedTargetElement;
let x, y;

let movableTargetElement;
let moveAt;

let isTouch = false;
let isDoubleClickMode;

let width;
let height;
let distance;


function targetMovement(event, targetElement) {
    updateTargetCoordinates(targetElement);
    const shiftX = event.clientX - x;
    const shiftY = event.clientY - y;

    return (pageX, pageY) => {
        targetElement.style.left = pageX - shiftX + "px";
        targetElement.style.top = pageY - shiftY + "px";
    };
}

function updateTargetCoordinates(targetElement) {
    const rect = targetElement.getBoundingClientRect();
    x = rect.left;
    y = rect.top;
}

function computeDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}


function onTargetClickListener(event) {
    const targetElement = event.target;
    if (!isDoubleClickMode) {
        if (targetElement !== selectedTargetElement) {
            if (selectedTargetElement) {
                selectedTargetElement.style.backgroundColor = INITIAL_TARGET_COLOR;
            }
            targetElement.style.backgroundColor = SELECTED_TARGET_COLOR;
            selectedTargetElement = targetElement;
        }
    } else {
        selectedTargetElement.style.backgroundColor = INITIAL_TARGET_COLOR;

        selectedTargetElement = null;
        movableTargetElement = null;
        isDoubleClickMode = false;
    }
}

function onTargetMoveListener(event) {
    movableTargetElement = event.target;
    moveAt(event.pageX, event.pageY);
}

function onContainerTouchstartListener() {
    if (movableTargetElement) {
        containerElement.removeEventListener("touchstart", onContainerTouchstartListener);
        movableTargetElement.removeEventListener("touchmove", onTargetTouchmoveListener);

        movableTargetElement.style.left = x + "px";
        movableTargetElement.style.top = y + "px";

        movableTargetElement = null;
    }
}

function onTargetTouchmoveListener(event) {
    const touch = event.touches[0];
    if (!isDoubleClickMode) {
        if (event.touches.length === 2) {
            const touch0 = event.touches[0];
            const touch1 = event.touches[1];
            if (touch0.target === touch1.target) {
                const newDistance = computeDistance(touch0.pageX, touch0.pageY, touch1.pageX, touch1.pageY);
                const dif = newDistance - distance;

                touch0.target.style.width = width + dif / 2 + "px";
                touch0.target.style.height = height + dif / 2 + "px";
                touch0.target.style.left = x - dif / 4 + "px";
                touch0.target.style.top = y - dif / 4 + "px";
            }
        } else {
            onTargetMoveListener(touch);
        }
    } else {
        if (touch.target === selectedTargetElement) {
            onTargetMoveListener(touch);
        } else if (touch.target === event.currentTarget) {
            onTargetMoveListener({
                target: selectedTargetElement,
                pageX: touch.pageX,
                pageY: touch.pageY
            });
        }
    }
}

function onTargetTouchstartListener(event) {
    if (event.touches.length === 2) {
        containerElement.removeEventListener("touchstart", onTargetTouchstartListener);
        containerElement.removeEventListener("touchmove", onTargetTouchmoveListener);

        selectedTargetElement.style.left = x + "px";
        selectedTargetElement.style.top = y + "px";
        selectedTargetElement.style.backgroundColor = INITIAL_TARGET_COLOR;

        selectedTargetElement = null;
        isDoubleClickMode = false;
    }
}


containerElement.addEventListener("click", event => {
    if (!timeoutId && !isDoubleClickMode) {
        const targetElement = event.target;
                if (targetElement === event.currentTarget) {
            if (selectedTargetElement && !movableTargetElement) {
                selectedTargetElement.style.backgroundColor = INITIAL_TARGET_COLOR;
                selectedTargetElement.textContent = "Workspace";
                selectedTargetElement = null;
            } else {
                movableTargetElement = null;
            }
        }
    }
});

targetElements.forEach(targetElement => {
    targetElement.addEventListener("mousedown", event => {
        if (!timeoutId && !isDoubleClickMode) {
            moveAt = targetMovement(event, targetElement);

            containerElement.addEventListener("mousemove", onTargetMoveListener);

            targetElement.addEventListener("mouseup", () => {
                containerElement.removeEventListener("mousemove", onTargetMoveListener);

                targetElement.addEventListener("click", event => {
                    event.stopPropagation();
                    if (!movableTargetElement) {
                        timeoutId = setTimeout(() => {
                            timeoutId = null;
                            onTargetClickListener(event);
                        }, TIMEOUT_LIMIT);
                    } else {
                        movableTargetElement = null;
                    }
                }, EVENT_LISTENER_OPTIONS);
            }, EVENT_LISTENER_OPTIONS);
        }
    });

    targetElement.addEventListener("dblclick", () => {
        if (!isDoubleClickMode) {
            clearTimeout(timeoutId);
            timeoutId = null;

            if (selectedTargetElement) {
                selectedTargetElement.style.backgroundColor = INITIAL_TARGET_COLOR;
            }
            selectedTargetElement = targetElement;
            selectedTargetElement.style.backgroundColor = MOVABLE_TARGET_COLOR;

            if (!isTouch) {
                containerElement.addEventListener("mousemove", onTargetMoveListener);

                targetElement.addEventListener("click", event => {
                    event.stopPropagation();

                    containerElement.removeEventListener("mousemove", onTargetMoveListener);
                    onTargetClickListener(event);

                    isDoubleClickMode = false;
                }, EVENT_LISTENER_OPTIONS);
            } else {
                containerElement.addEventListener("touchstart", onTargetTouchstartListener);
                containerElement.addEventListener("touchmove", onTargetTouchmoveListener);
            }
            isDoubleClickMode = true;
        }
    });

    targetElement.addEventListener("touchstart", event => {
        event.stopPropagation();

        const startTime = new Date();

        const touch = event.touches[0];
        if (!isDoubleClickMode) {
            if (event.target.classList.contains("target") && movableTargetElement &&
                event.target !== movableTargetElement) {
                return;
            }

            moveAt = targetMovement(touch, targetElement);

            if (event.touches.length === 2) {
                const rect = targetElement.getBoundingClientRect();
                width = rect.width;
                height = rect.height;

                const touch0 = event.touches[0];
                const touch1 = event.touches[1];

                distance = computeDistance(touch0.pageX, touch0.pageY, touch1.pageX, touch1.pageY);
            }

            containerElement.addEventListener("touchstart", onContainerTouchstartListener);
            targetElement.addEventListener("touchmove", onTargetTouchmoveListener);

            targetElement.addEventListener("touchend", () => {
                containerElement.removeEventListener("touchstart", onContainerTouchstartListener);
                targetElement.removeEventListener("touchmove", onTargetTouchmoveListener);
                movableTargetElement = null;
            }, EVENT_LISTENER_OPTIONS);
        } else {
            if (targetElement === selectedTargetElement) {
                moveAt = targetMovement(touch, targetElement);
            }

            targetElement.addEventListener("touchend", event => {
                const endTime = new Date();
                movableTargetElement = null;

                if (endTime - startTime < 100) {
                    event.preventDefault();

                    const touch = event.changedTouches[0];
                    if (touch.target === selectedTargetElement) {
                        containerElement.removeEventListener("touchstart", onTargetTouchstartListener);
                        containerElement.removeEventListener("touchmove", onTargetTouchmoveListener);

                        selectedTargetElement.style.backgroundColor = INITIAL_TARGET_COLOR;

                        selectedTargetElement = null;
                        isDoubleClickMode = false;
                    }
                }
            }, EVENT_LISTENER_OPTIONS);
        }

        isTouch = true;
    })
});

document.body.addEventListener("keydown", event => {
    if (event.code === "Escape" && movableTargetElement) {
        containerElement.removeEventListener("mousemove", onTargetMoveListener);

        movableTargetElement.style.left = x + "px";
        movableTargetElement.style.top = y + "px"

        if (isDoubleClickMode) {
            selectedTargetElement.style.backgroundColor = INITIAL_TARGET_COLOR;

            selectedTargetElement = null;
            movableTargetElement = null;
            isDoubleClickMode = false;
        }
    }
    // else {
    //     if (selectedTargetElement) {
    //         selectedTargetElement.textContent += event.key;
    //     }
    //     else {
    //         document.getElementById("inner").textContent += event.key;
              
    //     }
    // }
});


// secondElem = document.getElementById('second-shape');
// secondElem.addEventListener('keydown', textInput);
// function textInput(e) {
//     secondElem.textContent += e.key;
// }