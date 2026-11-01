"use strict";

const toast = document.querySelector("#toast");
let toastTimer;
function showMessage(text) {
  toast.textContent = text;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 5000);
}

document.querySelectorAll('[role="tablist"]').forEach((tablist) => {
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  function activate(tab) {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute("aria-controls")).hidden = !selected;
    });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activate(tab));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let next = event.key === "ArrowRight" ? (index + 1) % tabs.length : (index + tabs.length - 1) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      activate(tabs[next]);
      tabs[next].focus();
    });
  });
});

document.querySelectorAll("[data-open-dialog]").forEach((button) => {
  button.addEventListener("click", () => document.getElementById(button.dataset.openDialog).showModal());
});
document.querySelectorAll("[data-close-dialog]").forEach((button) => {
  button.addEventListener("click", () => button.closest("dialog").close());
});

/* Браузер сам проверяет required, type=email и minlength до события submit.
   Пароли и остальные поля никуда не отправляются и не сохраняются. */
document.querySelectorAll("form[data-demo-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (form.dataset.redirect) {
      window.location.href = form.dataset.redirect;
      return;
    }
    form.querySelector('[role="status"]').textContent = "Форма заполнена корректно. В учебном макете данные не отправляются.";
  });
});
const confirmPassword = document.querySelector("#confirm-password");
if (confirmPassword) {
  const password = document.querySelector("#register-password");
  const validate = () => confirmPassword.setCustomValidity(confirmPassword.value === password.value ? "" : "Пароли должны совпадать");
  password.addEventListener("input", validate);
  confirmPassword.addEventListener("input", validate);
}
document.querySelectorAll("[data-message]").forEach((button) => {
  button.addEventListener("click", () => showMessage(button.dataset.message));
});
const profilePhoto = document.querySelector("#profile-photo");
if (profilePhoto) {
  profilePhoto.addEventListener("change", () => {
    const file = profilePhoto.files[0];
    profilePhoto.setCustomValidity(file && file.size > 5 * 1024 * 1024 ? "Размер изображения должен быть не больше 5 МБ" : "");
    profilePhoto.reportValidity();
  });
}
const subjectSearch = document.querySelector("#subject-search");
if (subjectSearch) {
  subjectSearch.addEventListener("input", () => {
    const query = subjectSearch.value.trim().toLocaleLowerCase("ru");
    document.querySelectorAll("#course-tasks .task-row").forEach((row) => { row.hidden = !row.textContent.toLocaleLowerCase("ru").includes(query); });
  });
}

const taskFilters = document.querySelector("#task-filters");
if (taskFilters) {
  const rows = [...document.querySelectorAll("#task-list tr")];
  taskFilters.addEventListener("submit", (event) => event.preventDefault());
  function filterTasks() {
    const data = new FormData(taskFilters);
    const query = String(data.get("search")).trim().toLocaleLowerCase("ru");
    rows.forEach((row) => {
      row.hidden = !row.textContent.toLocaleLowerCase("ru").includes(query) ||
        (data.get("course") !== "all" && row.dataset.course !== data.get("course")) ||
        (data.get("status") !== "all" && row.dataset.status !== data.get("status")) ||
        (data.get("priority") !== "all" && row.dataset.priority !== data.get("priority"));
    });
    const count = rows.filter((row) => !row.hidden).length;
    document.querySelector("#task-count").textContent = `Показано ${count} из ${rows.length} задач`;
    document.querySelector("#tasks-empty").hidden = count > 0;
  }
  taskFilters.addEventListener("input", filterTasks);
  taskFilters.addEventListener("change", filterTasks);
}

const courseSearch = document.querySelector("#course-search");
if (courseSearch) {
  let selectedStatus = "all";
  const cards = [...document.querySelectorAll(".course-card")];
  function filterCourses() {
    const query = courseSearch.value.trim().toLocaleLowerCase("ru");
    cards.forEach((card) => { card.hidden = !card.textContent.toLocaleLowerCase("ru").includes(query) || (selectedStatus !== "all" && card.dataset.status !== selectedStatus); });
    document.querySelector("#courses-empty").hidden = cards.some((card) => !card.hidden);
  }
  courseSearch.closest("form").addEventListener("submit", (event) => { event.preventDefault(); filterCourses(); });
  courseSearch.addEventListener("input", filterCourses);
  document.querySelectorAll("[data-course-status]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedStatus = button.dataset.courseStatus;
      document.querySelectorAll("[data-course-status]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      filterCourses();
    });
  });
}
