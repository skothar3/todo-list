import "./sidebar.css"

const sidebarSection = document.querySelector("section.sidebar");

// SIDEBAR ELEMENTS {{{

const menuContainerDiv = document.createElement("div");
menuContainerDiv.classList.add("menu-container");

const allP = document.createElement("p");
allP.classList.add("subsection");
allP.textContent = "All To-Dos";

const dueTodayP = document.createElement("p");
dueTodayP.classList.add("subsection");
dueTodayP.textContent = "Due Today";

const dueThisWeekP = document.createElement("p");
dueThisWeekP.classList.add("subsection");
dueThisWeekP.textContent = "Due This Week";

const projectsContainerDiv = document.createElement("div");
projectsContainerDiv.classList.add("project-container");

const projectsH2 = document.createElement("h2");
projectsH2.textContent = "Projects";

const houseRenoProjectP = document.createElement("p");
houseRenoProjectP.classList.add("project");
houseRenoProjectP.textContent = "House Reno";

const exerciseProjectP = document.createElement("p");
exerciseProjectP.classList.add("project");
exerciseProjectP.textContent = "Exercise Plan";

const wishlistProjectP = document.createElement("p");
wishlistProjectP.classList.add("project");
wishlistProjectP.textContent = "Wishlist";

const addItemBtn = document.createElement("button");
addItemBtn.id = "add-item";
addItemBtn.textContent = "+"
// }}}

projectsContainerDiv.append(houseRenoProjectP, exerciseProjectP, wishlistProjectP);
menuContainerDiv.append(allP, dueTodayP, dueThisWeekP, projectsH2, projectsContainerDiv);

function insertSidebar() {
  sidebarSection.append(menuContainerDiv, addItemBtn);
}

export default insertSidebar;
