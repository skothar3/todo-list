import insertFooter from "./footer.js";
import { format, isSameDay, isSameWeek } from "date-fns";
import "./content.css";
import "./sidebar.css";
import { library, dom, config } from "@fortawesome/fontawesome-svg-core";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons/faPenToSquare";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons/faTrashCan";
// Update config so that svg elements nest within i elements instead of replacing them (JS and CSS can still access i elements) 
config.autoReplaceSvg = "nest";

function displayController() {
  // {{{
  library.add(faPenToSquare);
  library.add(faTrashCan);
  library.add(faCheck);
  dom.watch();

  const sidebarItems = ["All ToDos", "Due Today", "Due This Week"];
  const listSortStyles = ["Date", "Priority", "To Complete"];

  const sidebarSection = document.querySelector("section.sidebar");
  const contentSection = document.querySelector("section.content");
  const listContainer = contentSection.querySelector("div#list-container");
  const footerEl = document.querySelector("footer");

  // PRIVATE METHODS {{{
  const initSortSelect = () => {
    const selectContainer = document.createElement("div");
    selectContainer.classList.add("select-container");
    
    const selectLabel = document.createElement("label");
    selectLabel.htmlFor = "sort-select";
    selectLabel.textContent = "Sort by: ";

    const selectEl = document.createElement("select");
    selectEl.id = "sort-select";

    listSortStyles.forEach(sortStyle => {
      const option = document.createElement("option");
      option.value = sortStyle;
      option.textContent = sortStyle;
      selectEl.appendChild(option);
    });

    selectContainer.append(selectLabel, selectEl);
    contentSection.prepend(selectContainer);

  }
  const createListItemDOM = (listItem) => {
    // {{{

    const itemContainer = document.createElement("div");
    itemContainer.classList.add("item-container");
    itemContainer.classList.add(`${listItem.priority}`);
    itemContainer.dataset.id = `${listItem.getID()}`;

    const leftSideListContainer = document.createElement("div");
    leftSideListContainer.classList.add("left-side-list-container");

    const rightSideListContainer = document.createElement("div");
    rightSideListContainer.classList.add("right-side-list-container");

    const checkbox = document.createElement("div");
    checkbox.classList.add("checkbox");

    const checkmark = document.createElement("i");
    checkmark.classList.add("fas", "fa-check", "checkmark");
    if (listItem.getCompletion()) {
      itemContainer.classList.add("complete");
    }

    const itemTitle = document.createElement("span");
    itemTitle.classList.add("item-title");
    itemTitle.textContent = listItem.title;

    const itemDate = document.createElement("span");
    itemDate.classList.add("item-date");
    itemDate.textContent = format(listItem.date, "MMM dd");

    const itemEdit = document.createElement("i");
    itemEdit.classList.add("far", "fa-pen-to-square", "edit");

    const itemTrash = document.createElement("i");
    itemTrash.classList.add("far", "fa-trash-can", "trash");

    checkbox.append(checkmark);
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

    // projectsContainerDiv.appendChild(projectsH2);

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

    menuContainerDiv.append(projectsH2, projectsContainerDiv, addItemBtn);
    sidebarSection.replaceChildren(menuContainerDiv);
  }; // }}}
  // }}}

  // PUBLIC METHODS {{{
  const init = (listItemsArr, tags) => {
    initSortSelect();
    updateSidebar(tags);
    updateList(listItemsArr);
    insertFooter(footerEl);
  };

  const getListNodes = () => {
    return listContainer.querySelectorAll("div.item-container");
  };

  const getSidebarNodes = () => {
    return sidebarSection.querySelectorAll("p.subsection, p.project");
  };

  const getSortSelectNode = () => {
    return contentSection.querySelector("select#sort-select");
  }

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
    getSortSelectNode,
    updateList,
  };
} // }}}

function listController() {
  // {{{
  let itemID = 0;
  let listFilter = "All ToDos";
  let currentTag = "";
  let sortStyle = "Date";

  function listItem(title, date, priority, notes, tags, isComplete) {
    // {{{ 
    priority = priority.toLowerCase();
    const ID = itemID;
    let complete = isComplete;

    const getID = () => ID;

    const getCompletion = () => complete;
    const flipCompletion = () => {
      complete = complete ? false : true;
    };

    itemID++;

    return {
      title,
      date,
      priority,
      notes,
      tags,
      getID,
      getCompletion,
      flipCompletion,
    };
  } // }}}

  // LIST ITEM ARRAY {{{
  const listItemsArr = [
    listItem(
      "Get groceries",
      new Date(2024, 11, 31),
      "Medium",
      "List TBD",
      ["Condo"],
      false
    ),
    listItem(
      "Finish Hawaii booking",
      new Date(2024, 11, 31),
      "Medium",
      "Looking at Feb 2-12, 2025 w the D. Kotharis",
      ["Leisure", "Travel"],
      false
    ),
    listItem(
      "Get skates from crawlspace",
      new Date(2024, 11, 29),
      "Low",
      "Need to get them sharpened before taking them to Toronto",
      ["Home", "Leisure"],
      false,
    ),
    listItem(
      "Call Charumasi",
      new Date(2024, 11, 29),
      "Low",
      "Check in with your dear aunt to see how her trip to Peru was",
      ["Home", "Phone Calls"],
      false,
    ),
    listItem(
      "Continue working towards CKA exam",
      new Date(2025, 0, 30),
      "High",
      "Keep learning Kubernetes and Linux to succeed as a SE",
      ["Job Hunt"],
      true,
    ),
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
  const getCurrentList = () => {
    // {{{
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
	  if (a.priority == b.priority) { return a.date - b.date };
	  const priorities = [];
	  [a, b].forEach((item, index) => {
	    if (item.priority == "high") {priorities[index] = 3}
	    else if (item.priority == "medium") {priorities[index] = 2}
	    else {priorities[index] = 1}
	  });
	  return priorities[1] - priorities[0];
        });
        break;
      case "To Complete":
	currentList.sort((a, b) => {
	  if (a.getCompletion() == b.getCompletion()) {
	    return a.date - b.date;
	  } else {
	    return a.getCompletion() - b.getCompletion();
	  }
	});
        break;
    }
    return currentList;
  }; // }}}
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

  const getList = (filterType = "", tag = "", sortType = "") => {
    if (filterType) { listFilter = filterType };
    if (tag) { currentTag = tag };
    if (sortType) { sortStyle = sortType };

    return getCurrentList();
  };

  const editListItem = (itemID, updateObj) => {
    const itemIndex = listItemsArr.findIndex((item) => item.getID() == itemID);
    Object.keys(updateObj).forEach(key => {
      if (key != "flipCompletion"){
	listItemsArr[itemIndex][key] = updateObj[key];
      } else {
	listItemsArr[itemIndex].flipCompletion();
      }
    })

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

// PRIVATE METHODS {{{
// LISTENERS {{{
  const addSidebarListeners = (sidebarNodes) => {
    sidebarNodes.forEach((node) => {
      if (node.classList.contains("subsection")) {
	node.addEventListener("click", () => {
	  displayControl.updateList(
	    listControl.getList(node.dataset.subsection),
	  );
	  const listNodes = displayControl.getListNodes();
	  addListItemListeners(listNodes);
	});
      } else if (node.classList.contains("project")) {
	node.addEventListener("click", () => {
	  displayControl.updateList(
	    listControl.getList("Project", node.dataset.project),
	  );
	  const listNodes = displayControl.getListNodes();
	  addListItemListeners(listNodes);
	});
      }
    });
  }

  const addListItemListeners = (listNodes) => {
    listNodes.forEach((node) => {
      const checkbox = node.querySelector("div.checkbox");
      const checkmark = node.querySelector("i.checkmark");
      const itemEdit = node.querySelector("i.edit");
      const itemTrash = node.querySelector("i.trash");

      checkbox.addEventListener("click", () => {
        node.classList.toggle("complete");
	displayControl.updateList(
	  listControl.editListItem(node.dataset.id, {flipCompletion: true})
	);
	const listNodes = displayControl.getListNodes();
	addListItemListeners(listNodes);
      });
      itemTrash.addEventListener("click", () => {
	displayControl.updateList(
	  listControl.removeListItem(node.dataset.id)
	);
	const listNodes = displayControl.getListNodes();
	addListItemListeners(listNodes);
      })
    });
  }
// }}}

  const initDisplay = () => {
    displayControl.init(
      listControl.getList("All ToDos"),
      listControl.getTags(),
    );
    const sidebarNodes = displayControl.getSidebarNodes();
    const listNodes = displayControl.getListNodes();
    const sortSelectNode = displayControl.getSortSelectNode();

    addSidebarListeners(sidebarNodes);
    addListItemListeners(listNodes);

    sortSelectNode.addEventListener("change", () => {
      displayControl.updateList(
	listControl.getList("", "", sortSelectNode.value)
      );
      const listNodes = displayControl.getListNodes();
      addListItemListeners(listNodes);
    });
  }
// }}}

// PUBLIC METHODS {{{
  const init = () => {
    initDisplay();
  };
// }}}

  return {
    init,
  };
}

export default mainController;
