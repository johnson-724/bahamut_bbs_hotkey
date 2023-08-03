class PostList {
  constructor() {
    this.length = 0;
    this.head = null;
    this.appendOffset = null;
    this.current = null;
  }

  appendPost(post) {
    let node = new PostNode(post);

    if (this.head === null) {
      this.head = node;
      this.appendOffset = node;
    } else {
      let current = this.appendOffset;
      current.next = node;
      node.prev = current;
      this.appendOffset = node;
    }
  }

  next() {
    if (this.current === null) {
      this.current = this.head;
    } else if (this.current.next !== null) {
      this.current = this.current.next;
    }

    return this.current;
  }

  prev() {
    if (this.current === null || this.current === this.head) {
      this.current = this.head;
    } else if (this.current.prev !== null) {
      this.current = this.current.prev;
    }

    return this.current;
  }

  currentNode() {
    return this.current;
  }
}

class PostNode {
  constructor(data, next, prev) {
    this.data = data;
    this.next = null;
    this.prev = null;
  }
}

(function () {
  console.log("bahamut hotkey loading ...");
  let list = getPostList();
  registerHotKey(list);

  console.log("bahamut hotkey loaded");
})();

function getPostList() {
  let list = document.querySelectorAll(
    "#BH-master > form > div > table > tbody > .b-list__row.b-list-item:not(.b-list__row--sticky)"
  );

  let linkedList = new PostList();

  list.forEach((item, index) => {
    let link = item.querySelector("td.b-list__main > a");
    linkedList.appendPost({
      title: link.innerText,
      link: link.href,
      item : item,
      index: index,
    });
  });

  return linkedList;
}

function registerHotKey(list) {
  document.addEventListener("keydown", function (event) {
    const keyCode = event.key;

    switch (keyCode) {
      case "ArrowLeft":
        event.preventDefault();
        console.log("left");
        break;
      case "ArrowRight":
        event.preventDefault();
        console.log("right");
        break;
      case "ArrowUp":
        event.preventDefault();
        current = list.currentNode();
        console.log(list.prev());
        console.log(list.currentNode().data.title);
        list.currentNode().data.item.scrollIntoView({block: "center", behavior: "smooth"});
        toggleClass(current, list.currentNode());
        break;
      case "ArrowDown":
        event.preventDefault();
        current = list.currentNode();
        console.log(list.next());
        console.log(list.currentNode().data.title);
        list.currentNode().data.item.scrollIntoView({block: "center", behavior: "smooth"});
        toggleClass(current, list.currentNode());

        break;
    }
  });

  function toggleClass(current, target) {
    if (current !== null) {
        current.data.item.classList.remove("selected");
        current.data.item.classList.remove("blinking");
    }

    if (target !== null) {
        target.data.item.classList.add("selected");
        target.data.item.classList.add("blinking");
    }
  }
}
