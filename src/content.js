import insertFooter from "./footer.js";
import { format, isSameDay, isSameWeek } from "date-fns";
import "./content.css";
import "./sidebar.css";
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons/faPenToSquare";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons/faTrashCan";

function displayController() {
  // {{{

  library.add(faPenToSquare);
  library.add(faTrashCan);
  library.add(faCheck);
  dom.watch();

  const sidebarItems = ["All ToDos", "Due Today", "Due This Week"];

  const sidebarSection = document.querySelector("section.sidebar");
  const listContainer = document.querySelector("div#list-container");
  const footerEl = document.querySelector("footer");

  // PRIVATE METHODS {{{

  const createListItemDOM = (listItem) => {
    // {{{

    const itemContainer = document.createElement("div");
    itemContainer.classList.add("item-container");
    itemContainer.classList.add(`${listItem.priority}`);

    const leftSideListContainer = document.createElement("div");
    leftSideListContainer.classList.add("left-side-list-container");

    const rightSideListContainer = document.createElement("div");
    rightSideListContainer.classList.add("right-side-list-container");

    const checkbox = document.createElement("div");
    checkbox.classList.add("checkbox");

    const check = document.createElement("i");
    check.classList.add("fas", "fa-check", `${listItem.isComplete}`);

    const itemTitle = document.createElement("span");
    itemTitle.classList.add("item-title");
    itemTitle.textContent = listItem.title;

    const itemDate = document.createElement("span");
    itemDate.classList.add("item-date");
    itemDate.textContent = format(listItem.date, "MMM dd");

    const itemEdit = document.createElement("i");
    itemEdit.classList.add("far", "fa-pen-to-square");

    const itemTrash = document.createElement("i");
    itemTrash.classList.add("far", "fa-trash-can");

    checkbox.append(check);
    leftSideListContainer.append(checkbox, itemTitle);
    rightSideListContainer.append(itemDate, itemEdit, itemTrash);
    itemContainer.append(leftSideListContainer, rightSideListContainer);

    return itemContainer;
  }; // }}}

  const updateSidebar = (todoListTags) => {
    // {{{

    const menuContainerDiv = document.createElement("div");
    menuContainerDiv.classList.add("menu-container");

    const projectsContainerDiv = document.createElement("div");
    projectsContainerDiv.classList.add("project-container");

    const projectsH2 = document.createElement("h2");
    projectsH2.textContent = "Projects";

    const addItemBtn = document.createElement("button");
    addItemBtn.id = "add-item";
    addItemBtn.textContent = "+";

    projectsContainerDiv.appendChild(projectsH2);

    sidebarItems.forEach((item) => {
      const itemP = document.createElement("p");
      itemP.classList.add("subsection");
      itemP.dataset.subsection = `${item}`;
      itemP.textContent = `${item}`;

      menuContainerDiv.appendChild(itemP);
    });

    todoListTags.forEach((tag) => {
      const projectItemP = document.createElement("p");
      projectItemP.classList.add("project");
      projectItemP.dataset.project = `${tag}`;
      projectItemP.textContent = `${tag}`;

      projectsContainerDiv.appendChild(projectItemP);
    });

    menuContainerDiv.append(projectsContainerDiv, addItemBtn);
    sidebarSection.replaceChildren(menuContainerDiv);
  }; // }}}

  const init = (listItemsArr, tags) => {
    updateSidebar(tags);
    updateList(listItemsArr);
    insertFooter(footerEl);
  };
  // }}}

  // PUBLIC METHODS {{{
  const getListNodes = () => {
    return listContainer.querySelectorAll("div.item-container");
  };

  const getSidebarNodes = () => {
    return sidebarSection.querySelectorAll("p.subsection, p.project");
  };

  const updateList = (listItemsArr) => {
    const newList = [];
    listItemsArr.forEach((item) => {
      const listItemDOM = createListItemDOM(item);
      newList.push(listItemDOM);
    });

    listContainer.replaceChildren(...newList);
  };
  // }}}

  return {
    init,
    getListNodes,
    getSidebarNodes,
    updateList,
  };
} // }}}

function listController() {
  // {{{
  let listID = 0;
  let listFilter = "All ToDos";
  let currentTag = "";
  let sortStyle = "Priority";

  function listItem(title, date, priority, notes, tags, isComplete) { // {{{
    priority = priority.toLowerCase();
    const ID = listID;
    listID++;

    const getID = () => ID;

    return {
      title,
      date,
      priority,
      notes,
      tags,
      isComplete,
      getID,
    };
  } // }}}

  // LIST ITEM ARRAY {{{
  const listItemsArr = [
    listItem(
      "Contact Shopify Support",
      new Date(2024, 9, 31),
      "High",
      "Shopify payments are down. Support ticket has been generated and we are waiting for an update.",
      ["Shopify", "Phone Calls"],
      true,
    ),
    listItem(
      "Contact BMW",
      new Date(2024, 10, 3),
      "Medium",
      "Want to trade in two cars and buy-out dad's lease. Dad needs a lease and is checking prices.",
      ["Vehicle", "Phone Calls"],
      true,
    ),
    listItem(
      "Discuss Melissa's Schedule",
      new Date(2024, 9, 5),
      "Medium",
      "We will reduce her days to twice a week. Either do a 3 hour split both days, or house cleaning \
      on one day and kitchen prep on the other.",
      ["Home"],
      false,
    ),
    listItem(
      "Finish To-Do List App",
      new Date(2024, 10, 2),
      "High",
      "Deadline set for Wednesday evening. Need to incorporate list content and all interactive capabilities.",
      ["Job Hunt"],
      false,
    ),
  ];
  // }}}

  // PRIVATE METHODS {{{
const getCurrentList = () => {// {{{
    let currentList;
    switch (listFilter) {
      case "All ToDos":
        currentList = [...listItemsArr];
        break;
      case "Due Today":
        currentList = [
          ...listItemsArr.filter((item) => isSameDay(item.date, Date.now())),
        ];
        break;
      case "Due This Week":
        currentList = [
          ...listItemsArr.filter((item) => isSameWeek(item.date, Date.now())),
        ];
        break;
      case "Project":
        currentList = [
          ...listItemsArr.filter((item) => item.tags.includes(currentTag)),
        ];
        break;
    }

    switch (sortStyle) {
      case "Date":
        currentList.sort((a, b) => a.date - b.date);
        break;
      case "Priority":
        currentList.sort((a, b) => {
          if (a.priority == "high" || b.priority == "low") {
            return -1;
          } else if ((b.priority = "high" || a.priority == "low")) {
            return 1;
          } else return 0;
        });
        break;
      case "isComplete":
        currentList.sort((a, b) => a.isComplete - b.isComplete);
        break;
    }
    return currentList;
  };// }}}
  // }}}

  // PUBLIC METHODS {{{
  const getTags = () => {
    const tagsList = [];
    listItemsArr.forEach((item) => {
      item.tags.forEach((tag) => {
        if (!tagsList.includes(tag)) {
          tagsList.push(tag);
        }
      });
    });
    return tagsList.sort();
  };

  const getList = (filterType, tag = "", sortType = "Priority") => {
    listFilter = filterType;
    currentTag = tag;
    sortStyle = sortType;

    return getCurrentList();
  };

  const editListItem = (
    listID,
    title,
    date,
    priority,
    notes,
    tags,
    isComplete,
  ) => {
    const itemIndex = listItemsArr.findIndex((item) => item.getID() == itemID);
    listItemsArr[itemIndex].title = title;
    listItemsArr[itemIndex].date = date;
    listItemsArr[itemIndex].priority = priority.toLowerCase();
    iistItemsArr[itemIndex].notes = notes;
    listItemsArr[itemIndex].tags = tags;
    listItemsArr[itemIndex].isComplete = isComplete;

    return getCurrentList();
  };

  const addListItem = (title, date, priority, notes, tags, isComplete) => {
    newListItem = listItem(title, date, priority, notes, tags, isComplete);
    listItemsArr.push(newListItem);

    return getCurrentList();
  };

  const removeListItem = (itemID) => {
    listItemsArr.splice(
      listItemsArr.findIndex((item) => item.getID() == itemID),
      1,
    );

    return getCurrentList();
  };
  // }}}

  return {
    getTags,
    getList,
    editListItem,
    addListItem,
    removeListItem,
  };
} // }}}

function mainController() {
  const displayControl = displayController();
  const listControl = listController();

  const initDisplay = () => {
    displayControl.init(
      listControl.getList("All ToDos"),
      listControl.getTags(),
    );
    const sidebarNodes = displayControl.getSidebarNodes();
    const listNodes = displayControl.getListNodes();

    sidebarNodes.forEach((node) => {
      if (node.classList.contains("subsection")) {
        node.addEventListener("click", () => {
          displayControl.updateList(
            listControl.getList(node.dataset.subsection),
          );
        });
      } else if (node.classList.contains("project")) {
        node.addEventListener("click", () => {
          displayControl.updateList(
            listControl.getList("Project", node.dataset.project),
          );
        });
      }
    });

    listNodes.forEach((node) => {});
  };
  const init = () => {
    initDisplay();
  };

  return {
    init,
  };
}

export default mainController;
