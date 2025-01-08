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
  const showItemDialog = (listItem) => {
    const itemDialog = document.querySelector("dialog#item");
    const formHeader = document.querySelector("h3#form-header");
    if (listItem) {
      formHeader.textContent = "EDIT ITEM";
      const itemForm = document.querySelector("form");
      const formElements = itemForm.elements;
      itemForm.dataset.id = listItem.getID();
      formElements["title"].value = listItem.title;
      formElements["date"].value = format(listItem.date, "yyyy-MM-dd");
      formElements["notes"].value = listItem.notes;
      formElements[listItem.priority].checked = true;
      formElements["completion"].checked = listItem.getCompletion();
      formElements["tags"].value = listItem.tags.join(", ");
    } else {
      formHeader.textContent = "NEW ITEM";
    }
    itemDialog.showModal();
  }

  const closeItemDialog = () => {
    const itemDialog = document.querySelector("dialog#item");
    const itemForm = itemDialog.querySelector("form");
    const itemFormData = new FormData(itemForm);
    if (itemForm.dataset.id) {
      itemFormData.append("id", itemForm.dataset.id);
    }
    itemDialog.close();
    itemForm.reset();
    return itemFormData;
  }

  const initSortSelect = () => {
    const contentToolbar = contentSection.querySelector("div#content-toolbar");
    
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

    contentToolbar.append(selectLabel, selectEl);
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

  // }}}

  // PUBLIC METHODS {{{
  const init = (listItemsArr, tags) => {
    updateSidebar(tags);
    updateList(listItemsArr);
    initSortSelect();
    insertFooter(footerEl);
  };

  const updateSidebar = (todoListTags) => {
    // {{{
    const menuContainerDiv = document.createElement("div");
    menuContainerDiv.classList.add("menu-container");

    const projectsContainerDiv = document.createElement("div");
    projectsContainerDiv.classList.add("project-container");

    const projectsH2 = document.createElement("h2");
    projectsH2.textContent = "Projects";

    const newItemBtn = document.createElement("button");
    newItemBtn.id = "new-item";
    newItemBtn.textContent = "+";

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

    menuContainerDiv.append(projectsH2, projectsContainerDiv, newItemBtn);
    sidebarSection.replaceChildren(menuContainerDiv);
  }; // }}}

  const getListNodes = () => {
    return listContainer.querySelectorAll("div.item-container");
  };

  const getSidebarNodes = () => {
    return sidebarSection.querySelectorAll("p.subsection, p.project");
  };

  const getSortSelectNode = () => {
    return contentSection.querySelector("select#sort-select");
  }

  const getNewItemNode = () => {
    return sidebarSection.querySelector("button#new-item");
  }

  const getSubmitBtn = () => {
    return contentSection.querySelector("button#submit");
  }

  const getCancelBtn = () => {
    return contentSection.querySelector("button#cancel");
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
    getNewItemNode,
    getSubmitBtn,
    getCancelBtn,
    showItemDialog,
    closeItemDialog,
    updateList,
    updateSidebar,
  };
} // }}}

function listController() {
  // {{{
  let itemID = 0;
  let listFilter = "All ToDos";
  let currentTag = "";
  let sortStyle = "Date";

  function listItem(itemObj) {
    // {{{
    const title = itemObj.title;
    const date = itemObj.date;
    const notes = itemObj.notes;
    const tags = itemObj.tags;
    const priority = itemObj.priority.toLowerCase();
    const ID = itemID;
    let complete = itemObj.completion;

    const getID = () => ID;

    const getCompletion = () => complete;

    const setCompletion = (completion) => {
      complete = completion;
    }

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
      setCompletion,
      flipCompletion,
    };
  } // }}}

  // LIST ITEM ARRAY {{{
  const listItemsArr = [
    listItem(
      {
	title: "Get groceries",
	date: new Date(2024, 11, 31),
	priority: "Medium",
	notes: "List TBD",
	tags: ["Condo"],
	completion: false
      }
    ),
    listItem(
      {
	title: "Finish Hawaii booking",
	date: new Date(2024, 11, 31),
	priority: "Medium",
	notes: "Looking at Feb 2-12, 2025 w the D. Kotharis",
	tags: ["Leisure", "Travel"],
	completion: false
      }
    ),
    listItem(
      {
	title: "Get skates from crawlspace",
	date: new Date(2024, 11, 29),
	priority: "Low",
	notes: "Need to get them sharpened before taking them to Toronto",
	tags: ["Home", "Leisure"],
	completion: false,
      }
    ),
    listItem(
      {
	title: "Call Charumasi",
	date: new Date(2024, 11, 29),
	priority: "Low",
	notes: "Check in with your dear aunt to see how her trip to Peru was",
	tags: ["Home", "Phone Calls"],
	completion: false,
      }
    ),
    listItem(
      {
	title: "Continue working towards CKA exam",
	date: new Date(2025, 0, 30),
	priority: "High",
	notes: "Keep learning Kubernetes and Linux to succeed as a SE",
	tags: ["Job Hunt"],
	completion: true,
      }
    ),
    listItem(
      {
	title: "Contact Shopify Support",
	date: new Date(2024, 9, 31),
	priority: "High",
	notes: "Shopify payments are down. Support ticket has been generated and we are waiting for an update.",
	tags: ["Shopify", "Phone Calls"],
	completion: true,
      }
    ),
    listItem(
      {
	title: "Contact BMW",
	date: new Date(2024, 10, 3),
	priority: "Medium",
	notes: "Want to trade in two cars and buy-out dad's lease. Dad needs a lease and is checking prices.",
	tags: ["Vehicle", "Phone Calls"],
	completion: true,
      }
    ),
    listItem(
      {
	title: "Discuss Melissa's Schedule",
	date: new Date(2024, 9, 5),
	priority: "Medium",
	notes: "We will reduce her days to twice a week. Either do a 3 hour split both days, or house cleaning on one day and kitchen prep on the other.",
	tags: ["Home"],
	completion: false,
      }
    ),
    listItem(
      {
	title: "Finish To-Do List App",
	date: new Date(2024, 10, 2),
	priority: "High",
	notes: "Deadline set for Wednesday evening. Need to incorporate list content and all interactive capabilities.",
	tags: ["Job Hunt"],
	completion: false,
      }
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

  const editListItem = (itemID, itemObj) => {
    const itemIndex = listItemsArr.findIndex((item) => item.getID() == itemID);
    for (const [key, value] of Object.entries(itemObj)) {
      if (key == "completion") {
	listItemsArr[itemIndex].setCompletion(value);
      } else {
	listItemsArr[itemIndex][key] = value;
      }
    }

    return getCurrentList();
  };

  const addListItem = (itemObj) => {
    const newListItem = listItem(itemObj);
    listItemsArr.push(newListItem);

    return getCurrentList();
  };

  const getListItem = (itemID) => {
    return listItemsArr.find((item) => item.getID() == itemID);
  }

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
    getListItem,
    removeListItem,
  };
} // }}}

function mainController() {
  const displayControl = displayController();
  const listControl = listController();

// PRIVATE METHODS {{{
// LISTENERS {{{
  const addSidebarListeners = (sidebarNodes, newItemNode) => {
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

    newItemNode.addEventListener("click", () => {
      displayControl.showItemDialog();
    });
  }

  const addListItemListeners = (listNodes) => {
    listNodes.forEach((node) => {
      const checkbox = node.querySelector("div.checkbox");
      const checkmark = node.querySelector("i.checkmark");
      const itemEdit = node.querySelector("i.edit");
      const itemTrash = node.querySelector("i.trash");

      checkbox.addEventListener("click", () => {
	const newCompletion = node.classList.contains("complete") ? false : true;
	displayControl.updateList(
	  listControl.editListItem(node.dataset.id, {completion: newCompletion})
	);
	const listNodes = displayControl.getListNodes();
	addListItemListeners(listNodes);
      });

      itemEdit.addEventListener("click", () => {
	displayControl.showItemDialog(
	  listControl.getListItem(node.dataset.id)
	)
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
    const newItemNode = displayControl.getNewItemNode();
    const submitBtn = displayControl.getSubmitBtn();
    const cancelBtn = displayControl.getCancelBtn();

    addSidebarListeners(sidebarNodes, newItemNode);
    addListItemListeners(listNodes);

    sortSelectNode.addEventListener("change", () => {
      displayControl.updateList(
	listControl.getList("", "", sortSelectNode.value)
      );
      const listNodes = displayControl.getListNodes();
      addListItemListeners(listNodes);
    });

    submitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const itemFormData = displayControl.closeItemDialog();
      const itemObj = {};
      let itemID;
      if (itemFormData.has("completion")) {
	itemObj.completion = true;
	itemFormData.delete("completion");
      } else {
	itemObj.completion = false;
      }
      for (const [key, value] of itemFormData.entries()) {
	if (key == "tags") {
	  itemObj[key] = value.split(", ");
	} else if (key == "date") {
	  itemObj[key] = new Date(value + " EDT");
	} else if (key == "id") {
	  continue;
	} else {
	  itemObj[key] = value;
	}
      }

      if (itemFormData.has("id")) {
	displayControl.updateList(
	  listControl.editListItem(itemFormData.get("id"), itemObj)
	);
      } else {
	displayControl.updateList(
	  listControl.addListItem(itemObj)
	);
      }
      displayControl.updateSidebar(
	listControl.getTags()
      );
      const listNodes = displayControl.getListNodes();
      const sidebarNodes = displayControl.getSidebarNodes();
      const newItemNode = displayControl.getNewItemNode();
      addListItemListeners(listNodes);
      addSidebarListeners(sidebarNodes, newItemNode);
    });

    cancelBtn.addEventListener("click", (e) => {
      e.preventDefault();
      displayControl.closeItemDialog();
    })
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
