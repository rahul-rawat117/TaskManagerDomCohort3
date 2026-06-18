const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const category = document.getElementById("category");
const taskContainer = document.getElementById("taskContainer");
const taskCount = document.querySelector(".task-count");
const themeToggle = document.getElementById("themeToggle");

let taskId = 1;

/*
====================================
ATTRIBUTES VS PROPERTIES DEMO
====================================

PROPERTY:
taskInput.value

ATTRIBUTE:
taskInput.getAttribute("value")

Difference:
.value => current value entered by user
getAttribute("value") => original HTML value
*/

updateTaskCount();

taskForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = taskInput.value.trim();
    const taskCategory = category.value;

    if (!title || !taskCategory) {
        alert("Please fill all fields");
        return;
    }

    createTask(title, taskCategory);

    taskInput.value = "";
    category.selectedIndex = 0;
});

function createTask(title, taskCategory) {

    const emptyState = document.querySelector(".empty-state");

    if (emptyState) {
        emptyState.remove();
    }

    const taskCard = document.createElement("div");
    taskCard.className = "task-card";

    taskCard.setAttribute("data-id", taskId);
    taskCard.setAttribute("data-status", "pending");
    taskCard.setAttribute("data-category", taskCategory);

    const taskContent = document.createElement("div");
    taskContent.className = "task-content";

    const heading = document.createElement("h3");

    const titleText = document.createTextNode(title);
    heading.append(titleText);

    const badge = document.createElement("span");
    badge.className =
        `badge ${taskCategory.toLowerCase()}`;

    badge.textContent = taskCategory;

    taskContent.append(heading);
    taskContent.append(badge);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";

    const completeBtn =
        document.createElement("button");
    completeBtn.className = "complete-btn";
    completeBtn.textContent = "Complete";

    const deleteBtn =
        document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";

    actions.append(
        editBtn,
        completeBtn,
        deleteBtn
    );

    taskCard.append(
        taskContent,
        actions
    );

    // prepend() requirement
    taskContainer.prepend(taskCard);

    taskId++;

    updateTaskCount();
}

/*
EVENT DELEGATION
Single listener on parent
*/

taskContainer.addEventListener(
    "click",
    function (e) {

        const taskCard =
            e.target.closest(".task-card");

        if (!taskCard) return;

        /*
        =====================
        DELETE TASK
        =====================
        */

        if (
            e.target.classList.contains(
                "delete-btn"
            )
        ) {

            // before() demo

            const message =
                document.createElement("p");

            message.textContent =
                "Task Deleted";

            taskCard.before(message);

            setTimeout(() => {
                message.remove();
            }, 1500);

            // remove() requirement

            taskCard.remove();

            checkEmptyState();
            updateTaskCount();
        }

        /*
        =====================
        COMPLETE TASK
        =====================
        */

        if (
            e.target.classList.contains(
                "complete-btn"
            )
        ) {

            // Once completed, keep it completed (no Undo)
            if (taskCard.dataset.status !== "pending") {
                return;
            }

            taskCard.classList.add("completed");
            taskCard.dataset.status = "completed";
            e.target.textContent = "Completed";

            // Disable completion actions for that task
            const completeButton =
                taskCard.querySelector(".complete-btn");

            if (completeButton) {
                completeButton.disabled = true;
                completeButton.style.opacity = "0.7";
                completeButton.style.cursor = "not-allowed";
            }
        }


        /*
        =====================
        EDIT TASK
        =====================
        */

        // IMPORTANT: check for save-mode BEFORE edit-btn,
        // because Save button has BOTH classes: "edit-btn save-mode".
        if (
            e.target.classList.contains(
                "save-mode"
            )
        ) {
            const input =
                taskCard.querySelector(".edit-input");

            if (!input) return;

            input.blur();
            input.style.outline = "";
            input.style.boxShadow = "";

            // Create a NEW <h3> and replace input
            const savedTitle = document.createElement("h3");
            savedTitle.textContent =
                input.value.trim() ||
                "Untitled Task";

            input.replaceWith(savedTitle);

            // Switch button back to Edit
            e.target.textContent = "Edit";
            e.target.classList.remove(
                "save-mode"
            );

            return;
        }

        if (
            e.target.classList.contains(
                "edit-btn"
            )
        ) {

            const titleElement =
                taskCard.querySelector("h3");

            // If already in edit mode, ignore.
            if (!titleElement || taskCard.querySelector(".edit-input")) {
                return;
            }

            const input =
                document.createElement("input");

            input.type = "text";
            input.value =
                titleElement.textContent;
            input.className = "edit-input";

            // replaceWith()
            titleElement.replaceWith(input);

            input.focus();

            e.target.textContent = "Save";
            e.target.classList.add(
                "save-mode"
            );
        }






    }
);

/*
====================================
THEME TOGGLE
====================================
*/

themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark"
        );

        if (
            document.body.classList.contains(
                "dark"
            )
        ) {

            document.body.setAttribute(
                "data-theme",
                "dark"
            );

            themeToggle.textContent =
                "☀️ Light Mode";

        } else {

            document.body.setAttribute(
                "data-theme",
                "light"
            );

            themeToggle.textContent =
                "🌙 Dark Mode";
        }
    }
);

/*
====================================
TASK COUNTER
====================================
*/

function updateTaskCount() {

    const totalTasks =
        document.querySelectorAll(
            ".task-card"
        ).length;

    taskCount.textContent =
        `${totalTasks} Task${totalTasks !== 1 ? "s" : ""}`;
}

/*
====================================
EMPTY STATE
====================================
*/

function checkEmptyState() {

    const tasks =
        document.querySelectorAll(
            ".task-card"
        );

    if (tasks.length === 0) {

        const emptyState =
            document.createElement("div");

        emptyState.className =
            "empty-state";

        emptyState.innerHTML = `
            <h3>No Tasks Yet</h3>
            <p>Add your first task to get started.</p>
        `;

        taskContainer.append(emptyState);
    }
}

/*

EVENT PROPAGATION DEMO


const grandparent =
document.createElement("div");

const parent =
document.createElement("div");

const child =
document.createElement("button");

grandparent.append(parent);
parent.append(child);

child.addEventListener("click", () => {
    console.log("Child");
});

parent.addEventListener("click", () => {
    console.log("Parent");
});

grandparent.addEventListener("click", () => {
    console.log("Grandparent");
});

BUBBLING:
Child -> Parent -> Grandparent

CAPTURING:

grandparent.addEventListener(
 "click",
 () => console.log("Grandparent"),
 true
);

parent.addEventListener(
 "click",
 () => console.log("Parent"),
 true
);

child.addEventListener(
 "click",
 () => console.log("Child"),
 true
);

Grandparent -> Parent -> Child
*/