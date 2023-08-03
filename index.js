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
  switchScript();
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
      item: item,
      index: index,
    });
  });

  return linkedList;
}

function registerListHotKey(list) {
  document.addEventListener("keydown", function (event) {
    const keyCode = event.key;

    switch (keyCode) {
      case "ArrowRight":
        event.preventDefault();
        console.log("right");
        jumpToPost(list.currentNode());
        break;
      case "ArrowUp":
        event.preventDefault();
        current = list.currentNode();
        list.prev();
        
        continueB(current, list);
        break;
      case "ArrowDown":
        event.preventDefault();
        current = list.currentNode();
        list.next();

        continueB(current, list);

        break;
    }
  });

  function jumpToPost(target) {
    window.location.hash = `#post-${target.data.index}`;
    let jumpTarget = `${target.data.link}#post-${target.data.index}`;
    window.location.href = jumpTarget;
  }
}

function getPostListOnCPage() {
  const section = document.querySelectorAll(".c-section");
  let linkedList = new PostList();
  section.forEach((item, index) => {
    const id = item.id;
    if (/^post_\d+$/.test(id)) {
      // 在控制台输出符合条件的元素的 id
      linkedList.appendPost({
        id: id,
        item: item,
        index: index,
      });
    }
  });

  console.log(linkedList);

  return linkedList;
}

function registerPostHotKey(list) {
  document.addEventListener("keydown", function (event) {
    const keyCode = event.key;
    switch (keyCode) {
      case "ArrowLeft":
        event.preventDefault();
        history.back();
        break;
      case "ArrowRight":
        event.preventDefault();
        console.log("right");
        // jumpToPost(list.currentNode());
        break;
      case "ArrowUp":
        event.preventDefault();
        current = list.currentNode();
        list.prev();
        continueC(current, list);

        break;
      case "ArrowDown":
        event.preventDefault();
        current = list.currentNode();
        if (current !== null && !isLoaded(current.data.item)) {
          console.log("scrolling down");
          window.scrollBy(0, 150);
          return;
        }
        list.next();
        continueC(current, list);

        break;
    }
  });
}

function switchScript() {
  if (window.location.href.startsWith("https://forum.gamer.com.tw/B.php")) {
    let list = getPostList();
    registerListHotKey(list);

    if (window.location.hash.startsWith("#post")) {
      let target = window.location.hash.replace("#post-", "");
      console.log("re position to : " + target);
      let current = list.next();
      while (current !== null) {
        if (current.data.index === parseInt(target)) {
          break;
        }
        current = list.next();
      }
      console.log(current);

      continueB(null, list);
    }
  } else if (
    window.location.href.startsWith("https://forum.gamer.com.tw/C.php")
  ) {
    let list = getPostListOnCPage();
    registerPostHotKey(list);
  }
}

function continueB(current, list) {
  list
    .currentNode()
    .data.item.scrollIntoView({ block: "center", behavior: "smooth" });
  toggleClass(current, list.currentNode());

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

function continueC(current, list) {
  let pos = "center";
  if (!isVisible(list.currentNode().data.item)) {
    pos = "start";
  }

  console.log("positioning to " + pos);

  list
    .currentNode()
    .data.item.scrollIntoView({ block: pos, behavior: "smooth" });
  toggleClass(current, list.currentNode());

  function toggleClass(current, target) {
    if (current !== null) {
      const post = current.data.item.querySelector(".c-post");
      post.classList.remove("selected");
      post.classList.remove("blinking");
    }

    if (target !== null) {
      const post = target.data.item.querySelector(".c-post");
      post.classList.add("selected");
      post.classList.add("blinking");
    }
  }
}

function isVisible(item) {
  const rect = item.getBoundingClientRect();
  return (
    rect.height <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.width <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function isLoaded(item) {
  const rect = item.getBoundingClientRect();

  return (
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
  );
}
