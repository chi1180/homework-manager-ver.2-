
const nav = document.querySelector("nav");

nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
        nav.querySelectorAll("a").forEach(a => {
            if (a.classList.contains("active")) {
                a.classList.remove("active");
            }
        });
        a.classList.add("active");
    });

    a.addEventListener("mouseover", () => {
        if (!nav.classList.contains("show-all")) {
            nav.classList.add("show-all");
        }
    });
});

nav.addEventListener("mouseleave", () => {
    if (nav.classList.contains("show-all")) {
        nav.classList.remove("show-all");
    }
});

window.addEventListener("load", () => {
    nav.querySelectorAll("a").forEach(a => {
        if (a.href.split("#")[1] === location.href.split("#")[1]) {
            a.classList.add("active");
        } else if (a.classList.contains("active")) {
            a.classList.remove("active");
        }
    });

    if (!location.href.includes("#")) {
        nav.querySelector("a").classList.add("active");
    }
});


let year = 0;
let month = 0;
let date = 0;
let day = 0;

let afterToday = false;
let nearDate = 0;

let lookByWeek = false;
const btn = document.getElementById("viewBtn");
btn.parentElement.addEventListener("click", () => {
    let props = {
        target: ".week.by-week",
        animation: "changeByWeek 0.5s linear"
    };
    lookByWeek = !lookByWeek;
    if (btn.innerText === "M") {
        btn.innerText = "W";
        btn.style.left = "61px";
        btn.style.animation = "lookByWeek 0.5s linear";
    } else {
        btn.innerText = "M";
        btn.style.left = "0";
        btn.style.animation = "lookByMonth 0.5s linear";
        props.target = ".week";
        props.animation = "changeByMonth 0.5s linear";
    }
    createCalender();
    document.querySelectorAll(props.target).forEach((week) => { week.style.animation = props.animation });
});


init();

function init() {
    deleteMoreLastMonthData();

    const homework_data = JSON.parse(localStorage.getItem("homework_data"));
    if (homework_data) {
        homework_data.forEach((homework) => {
            document.getElementById("homework").querySelector("main").querySelector("ul").appendChild(createHomework(homework.date, homework.title, homework.about, homework.color, true));
        });
    }
    upHomeworkData();

    dateInit();
    createCalender();
}

function dateInit() {
    const toDate = new Date();
    year = toDate.getFullYear();
    month = toDate.getMonth();
    date = toDate.getDate();
    day = toDate.getDay();
}

function putCalenderInputDate(year, month, date) {
    year = year.toString();
    month = (month + 1).toString();
    date = date.toString();
    if (year.length < 4) {
        let sent = "";
        for (let i = 0; i < 4 - year.length; i++) {
            sent += "0";
        }
        year = sent + year;
    }
    if (month.length === 1) {
        month = "0" + month;
    }
    if (date.length === 1) {
        date = "0" + date;
    }

    document.getElementById("calenderInput").value = year + "-" + month + "-" + date;
}

document.getElementById("calenderInput").addEventListener("change", () => {
    if (document.getElementById("calenderInput").value) {
        const splitDate = document.getElementById("calenderInput").value.split("-");
        year = parseInt(splitDate[0]);
        month = parseInt(splitDate[1]) - 1;
        date = parseInt(splitDate[2]);
    } else {
        dateInit();
    }

    createCalender();
});

function changeMonth(num) {
    if (month + num === 12) {
        month = 0;
        year++;
    } else if (month + num === -1) {
        month = 11;
        year--;
    } else {
        month += num;
    }

    if (!isToday(year, month, date)) {
        date = 1;
    }

    createCalender();
}

function createCalender() {
    clearCalender();
    if (year === new Date().getFullYear() && month === new Date().getMonth()) {
        date = new Date().getDate();
    }

    putCalenderInputDate(year, month, date);

    let is_start = false;
    let date_count = 0;
    const homework_data = JSON.parse(localStorage.getItem("homework_data"));

    const todayContainer = document.getElementById("today-homework-container");
    if (todayContainer.querySelector("li")) {
        todayContainer.querySelectorAll("li").forEach((list) => {
            list.remove();
        });
    }
    const nearContainer = document.getElementById("near-homework-container");
    if (nearContainer.querySelector("li")) {
        nearContainer.querySelectorAll("li").forEach((list) => {
            list.remove();
        });
    }

    for (let w = 0; w < 6; w++) {
        const week = document.createElement("div");
        week.classList.add("week");
        if (lookByWeek) {
            week.classList.add("by-week");
        }
        for (let d = 0; d < 7; d++) {
            const dateBox = document.createElement("div");
            dateBox.classList.add("date-box");

            if (!w && d === getFirstLastDate()["first-day"]) {
                is_start = true;
            }

            if (is_start) {
                date_count++;
                dateBox.innerText = date_count;

                if (isToday(year, month, date_count)) {
                    const toDayLabel = document.createElement("label");
                    toDayLabel.className = "label label-today";
                    toDayLabel.innerText = "Today";
                    dateBox.appendChild(toDayLabel);
                    afterToday = true;
                }

                if (homework_data) {
                    homework_data.forEach((homework) => {
                        let check_year = year.toString();
                        let check_month = (month + 1).toString();
                        let check_date = date_count.toString();
                        if (check_year.length < 4) {
                            let sent = "";
                            for (let i = 0; i < 4 - check_year.length; i++) {
                                sent += "0";
                            }
                            check_year = sent + check_year;
                        }
                        if (check_month.length === 1) {
                            check_month = "0" + check_month;
                        }
                        if (check_date.length === 1) {
                            check_date = "0" + check_date;
                        }

                        if (check_year + "-" + check_month + "-" + check_date === homework.date) {
                            const label = document.createElement("li");
                            label.classList.add("label");
                            label.style.borderColor = homework.color;
                            label.innerText = homework.title;

                            label.dataset.date = homework.date;
                            label.dataset.about = homework.about;
                            label.dataset.color = homework.color;

                            dateBox.appendChild(label);
                            dateBox.classList.add("hover-box");

                            if (isToday(year, month, date_count)) {
                                todayContainer.appendChild(createHomework(
                                    homework.date,
                                    homework.title,
                                    homework.about,
                                    homework.color,
                                    false
                                ));
                            } else if (afterToday) {
                                if (!nearDate) {
                                    nearDate = date_count;
                                }

                                if (date_count === nearDate) {
                                    nearContainer.appendChild(createHomework(
                                        homework.date,
                                        homework.title,
                                        homework.about,
                                        homework.color,
                                        false
                                    ));
                                } else {
                                    afterToday = false;
                                }
                            }
                        }
                    });

                    if (dateBox.classList.contains("hover-box")) {
                        dateBox.onclick = () => {
                            const calenderSection = document.getElementById("calender");
                            const listContainer = document.querySelector(".homework-list-container");

                            dateBox.querySelectorAll("li").forEach((homework) => {
                                listContainer.appendChild(createHomework(
                                    homework.dataset.date,
                                    homework.innerText,
                                    homework.dataset.about,
                                    homework.dataset.color,
                                    true
                                ));
                            });

                            calenderSection.classList.add("fixed-board");

                            setTimeout(() => {
                                calenderSection.onclick = () => {
                                    listContainer.style.right = "-760px";
                                    listContainer.style.animation = "hiddenHomeworkListContainer 0.5s ease-in-out";
                                    listContainer.querySelectorAll("li").forEach((homework) => {
                                        homework.remove();
                                    });
                                    calenderSection.classList.remove("fixed-board");
                                    calenderSection.onclick = () => { };
                                }
                            }, 250);

                            listContainer.style.right = "0";
                            listContainer.style.animation = "showHomeworkListContainer 0.5s ease-in-out";
                        }
                    }
                }

                if (date_count === getFirstLastDate()["last-date"]) {
                    is_start = false;
                }
            }
            week.appendChild(dateBox);
        }
        document.querySelector(".calender").appendChild(week);
    }
}

function clearCalender() {
    const weeks = document.querySelector(".calender").querySelectorAll(".week");
    if (weeks) {
        weeks.forEach((week) => {
            week.remove();
        });
    }
}

function getFirstLastDate() {
    const firstDay = new Date(year, month, 1).getDay();
    let next_month = month;
    let next_year = year;
    if (month === 11) {
        next_month = 0;
        next_year++;
    } else {
        next_month++;
    }
    const lastDate = new Date(next_year, next_month, 0).getDate();

    return ({
        "first-day": firstDay,
        "last-date": lastDate
    });
}

function isToday(year, month, date) {
    const newDate = new Date();
    const toYear = newDate.getFullYear();
    const toMonth = newDate.getMonth();
    const toDate = newDate.getDate();
    if (year === toYear && month === toMonth && date === toDate) {
        return true;
    }
    return false;
}

function addHomework(date, title, about, color) {
    const backBoard = document.createElement("div");
    backBoard.classList.add("back-board");

    const dateInput = document.createElement("input");
    dateInput.type = "date";
    if (date) dateInput.value = date;

    const titleInput = document.createElement("input");
    titleInput.placeholder = "Enter homework title here";
    if (title) titleInput.value = title;

    const aboutTextarea = document.createElement("textarea");
    aboutTextarea.placeholder = "Enter about homework here";
    if (about) aboutTextarea.value = about;

    const colorSelector = document.createElement("select");

    colorSelector.addEventListener("change", () => {
        colorSelector.style.borderColor = colorSelector.value;
    });

    ["black", "gray", "purple", "red", "blue", "green", "yellow", "orange"].forEach((color) => {
        const option = document.createElement("option");
        option.innerText = color;
        colorSelector.appendChild(option);
    });

    if (color) {
        colorSelector.value = color;
        colorSelector.style.borderColor = color;
    }

    const buttonContainer = document.createElement("div");

    const cancelButton = document.createElement("button");
    cancelButton.innerText = "cancel";
    cancelButton.onclick = () => {
        hiddenHomeworkEditor();
    }

    const createButton = document.createElement("button");
    createButton.innerText = "add homework";
    if (color) createButton.innerText = "update homework";
    createButton.onclick = () => {
        const isEntered = dateInput.value && titleInput.value.trim() && aboutTextarea.value.trim();
        if (isEntered) {
            if (isTitleUsed(date, title, dateInput.value, titleInput.value, aboutTextarea.value, colorSelector.value)) {
                alert("This title was used for other homework\nPlease use another title");
            } else {
                document.getElementById("homework").querySelector("main").querySelector("ul").appendChild(createHomework(dateInput.value, titleInput.value, aboutTextarea.value, colorSelector.value, true));
                hiddenHomeworkEditor();
                upHomeworkData();
                createCalender();
                createCalender(); // set today homework list and near day homework list by get data from local-storage

                // checking to we show list container in calender section
                const listContainerLists = document.querySelector(".homework-list-container").querySelectorAll("li");
                if (listContainerLists.length) {
                    const selectedDate = listContainerLists[0].dataset.date;

                    listContainerLists.forEach((homework) => {
                        homework.remove();
                    });

                    document.getElementById("homework").querySelector("main").querySelector("ul").querySelectorAll("li").forEach((homework) => {
                        if (homework.dataset.date == selectedDate) {
                            document.querySelector(".homework-list-container").appendChild(createHomework(
                                homework.dataset.date,
                                homework.innerText,
                                homework.dataset.about,
                                homework.dataset.color,
                                true
                            ));
                        }
                    });
                }
            }
        } else {
            alert("Please fill in all fields about your homework");
        }
    }

    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(createButton);

    backBoard.appendChild(dateInput);
    backBoard.appendChild(titleInput);
    backBoard.appendChild(aboutTextarea);
    backBoard.appendChild(colorSelector);
    backBoard.appendChild(buttonContainer);
    document.querySelector("body").appendChild(backBoard);
}

function isTitleUsed(date, title, dateInpValue, titleInpValue, aboutInpValue, colorSelectValue) {
    const homework_data = document.getElementById("homework").querySelector("main").querySelector("ul").querySelectorAll("li");

    if (date) {
        homework_data.forEach((homework) => {
            if (homework.dataset.date === date && homework.dataset.title === title) {
                homework.remove();
            }
        });
        return isTitleUsed(undefined, undefined, dateInpValue, titleInpValue);
    } else {
        let isUsed = false;
        homework_data.forEach((homework) => {
            if (homework.dataset.date === dateInpValue && homework.dataset.title === titleInpValue) {
                isUsed = true;
            }
        });

        return isUsed;
    }
}

function hiddenHomeworkEditor() {
    document.querySelector(".back-board").style.animation = "hiddenBoard 0.3s linear";
    setTimeout(() => {
        document.querySelector(".back-board").remove();
    }, 300);
}

// if we has a parameter[hasAction], can create action buttons(edit, remove)
// that is use in manager section and homework section
function createHomework(date, title, about, color, hasAction) {
    const list = document.createElement("li");

    list.dataset.date = date;
    list.dataset.title = title;
    list.dataset.about = about;
    list.dataset.color = color;
    list.style.borderColor = color;

    const text = document.createElement("p");
    text.innerText = title;
    list.addEventListener("dblclick", () => {
        if (text.innerText.includes(about) && text.innerText !== about) {
            text.innerText = title;
        } else {
            text.innerText += "\n\n" + about + "\n\n" + list.dataset.date;
        }
    });

    if (hasAction) {
        const actionContainer = document.createElement("div");
        const edit = document.createElement("img");
        edit.src = "assets/edit.png";
        edit.alt = "Edit homework";
        edit.onclick = () => {
            addHomework(date, title, about, color);
        }

        const remove = document.createElement("img");
        remove.src = "assets/delete.png";
        remove.alt = "Remove homework";
        remove.onclick = () => {
            removeHomework(date, title);
        }

        actionContainer.appendChild(edit);
        actionContainer.appendChild(remove);

        list.appendChild(actionContainer);
    }
    list.appendChild(text);
    return list;
}

function removeHomework(date, title, isEdit) {
    const homeworks = document.getElementById("homework").querySelector("main").querySelector("ul").querySelectorAll("li");
    homeworks.forEach((homework) => {
        if (homework.dataset.date === date && homework.dataset.title === title) {
            if (isEdit) {
                homework.remove();
                upHomeworkData();
                createCalender();
            } else if (confirm("Do you want to delete this homework?")) {
                homework.remove();

                const listContainerLists = document.querySelector(".homework-list-container").querySelectorAll("li");
                if (listContainerLists.length) {
                    const selectedDate = listContainerLists[0].dataset.date;

                    listContainerLists.forEach((homework) => {
                        homework.remove();
                    });

                    document.getElementById("homework").querySelector("main").querySelector("ul").querySelectorAll("li").forEach((homework) => {
                        if (homework.dataset.date == selectedDate) {
                            document.querySelector(".homework-list-container").appendChild(createHomework(
                                homework.dataset.date,
                                homework.innerText,
                                homework.dataset.about,
                                homework.dataset.color,
                                true
                            ));
                        }
                    });
                }
                upHomeworkData();
                createCalender();
            }
        }
    });
}

function upHomeworkData() {
    document.getElementById("homework-much").innerText = countHomework();
    saveHomework();
}

function countHomework() {
    return document.getElementById("homework").querySelector("main").querySelector("ul").querySelectorAll("li").length;
}

function saveHomework() {
    const homeworks = document.getElementById("homework").querySelector("main").querySelectorAll("li");
    let homework_data = [];

    homeworks.forEach((homework) => {
        homework_data.push({
            "date": homework.dataset.date,
            "title": homework.dataset.title,
            "about": homework.dataset.about,
            "color": homework.dataset.color
        });
    });

    localStorage.setItem("homework_data", JSON.stringify(homework_data));
}

function exportHomeworkDataCsvFile() {
    const homeworks = document.getElementById("homework").querySelector("main").querySelectorAll("li");
    let homework_data = [];

    homeworks.forEach((homework) => {
        homework_data.push({
            "date": homework.dataset.date,
            "title": homework.dataset.title,
            "about": homework.dataset.about,
            "color": homework.dataset.color
        });
    });

    if (homework_data.length) {
        const blob = new Blob([JSON.stringify(homework_data)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.download = "homework-data.json";
        a.href = url;
        a.click();
    } else {
        alert("No exportable data found")
    }
}

function importHomeworkDataCsvFile() {
    const input = document.getElementById("importFileInput");
    if (input.files[0].type === "application/json") {
        const reader = new FileReader();
        reader.onload = () => {
            localStorage.setItem("homework_data", JSON.stringify(checkDeferentHomeworkData(JSON.parse(localStorage.getItem("homework_data")), JSON.parse(reader.result))));
            window.location.reload();
        }
        reader.readAsText(input.files[0]);
    }
}

function checkDeferentHomeworkData(mine, current) {
    mine.forEach((mine_data) => {
        let count = 1;
        current.forEach((current_data) => {
            if (mine_data.date === current_data.date && mine_data.title === current_data.title) {
                count ++;
                current_data.title += " (" + count.toString() + ")";
            }
        });
    });
    for (let i = 0; i < current.length; i ++) {
        console.log(current[i]);
    }
    current.forEach((current_data) => {
        mine.push(current_data);
    });

    return mine;
}

function deleteMoreLastMonthData() {
    const homeworks = JSON.parse(localStorage.getItem("homework_data"));
    let save_homeworks = [];
    if (homeworks) {
        homeworks.forEach((homework) => {
            if (!isMoreLastMonthData(homework)) {
                save_homeworks.push(homework);
            }
        });
    }
    localStorage.setItem("homework_data", JSON.stringify(save_homeworks));
}

function isMoreLastMonthData(homework) {
    const toDate = new Date();
    let year = toDate.getFullYear();
    let month = toDate.getMonth() + 1;

    if (month - 2 === 0) {
        month = 12;
        year--;
    }

    let isTrue = false;

    for (let i = 1; i < 32; i++) {
        if (homework.date === year.toString() + "-" + month.toString() + "-" + i.toString()) {
            isTrue = true;
        }
    }

    return isTrue;
}



// --- code to push message working

if (!Push.Permission.has()) {
    Push.Permission.request();
}

// get and save last login in date

const lastLoginDate = JSON.parse(localStorage.getItem("last-login-at"));
const today = new Date();
const formattedToDate = today.getFullYear().toString() + (today.getMonth() + 1).toString().padStart(2, "0") + today.getDate().toString().padStart(2, "0");

let homeworks = "";
JSON.parse(localStorage.getItem("homework_data")).forEach((homework) => {
    if (homework.date.split("-").join("") === formattedToDate) {
        homeworks += " - " + homework.title + "\n";
    }
});
if (lastLoginDate && lastLoginDate.date < parseInt(formattedToDate) && Push.Permission.has() && homeworks !== "") {
    Push.create("Today's homeworks", {
        body: homeworks,
        icon: "assets/icon.ico",
        timeout: null,
        onClick: function () {
            window.focus(),
                this.close()
        }
    });
}

localStorage.setItem("last-login-at", JSON.stringify({ date: parseInt(formattedToDate) }));

