const listFav = () => {

  let array = JSON.parse(localStorage.getItem('favs'))

  if (array) {
      document.querySelector('[data-fav-help]').innerHTML = ""

      array.forEach(arr => {
          const a = document.createElement('a')

          a.classList.add('menu-item', 'nav-link', 'menu-link', 'text-white-50')
          a.style.padding = "0rem 0.3rem"
          a.innerHTML = arr.name
          a.href = arr.action

          document.querySelector('[data-favs-list]').appendChild(a)
      })
  }
}

const listRecents = () => {
  let array = JSON.parse(localStorage.getItem('recents'))

  if (array) {
      array.forEach(arr => {
          const a = document.createElement('a')

          a.classList.add('menu-item', 'nav-link', 'menu-link', 'text-white-50')
          a.style.padding = "0rem 0.3rem"
          a.innerHTML = arr.name
          a.href = arr.action

          document.querySelector('[data-recent]').appendChild(a)
      })
  }
}

$(document).ready(function () {

  var timer;
  function debounce() {
      clearTimeout(timer);
      timer = setTimeout(function () {
          $("[data-fav]").fadeOut('fast');
      }, 250);
  }

  $(".d-block").hover(function () {
      // hover over
      $(this).children().show();
      clearTimeout(timer);
  }, function () {
      // hover out
      debounce();
  });

  $(".d-block").mouseleave(function (e) {
      debounce();
  });

  $(".d-block").mouseenter(function () {
      clearTimeout(timer);
  });
});

const addRecent = () => {

  const page = document.URL
  if (page.match(/dashboard*/)) return null

  const url = page.split("/")

  let newarray = []
  const div = document.querySelector('[data-recent]')

  const newRecent = {
      name: document.querySelector('[data-title]').children[0].innerHTML,
      action: `./${url[4]}`
  }

  let array = JSON.parse(localStorage.getItem('recents'))

  if (array) newarray = array
  if (newarray.length >= 5) {
      array.shift()
      document.querySelector('[data-recent]').children[4].remove()
  }

  let pos = newarray.findIndex(i => i.action === newRecent.action);

  if (pos > -1) {
      newarray.splice(pos, 1)
      div.children[pos].remove()
  }

  newarray.unshift(newRecent)

  localStorage.setItem('recents', JSON.stringify(newarray))

  const a = document.createElement('a')

  a.classList.add('menu-item', 'nav-link', 'menu-link', 'text-white-50')
  a.style.padding = "0rem 0.3rem"
  a.innerHTML = newRecent.name
  a.href = newRecent.action

  div.prepend(a)
}

const addFav = (event) => {
  event.preventDefault()
  const div = document.querySelector('[data-favs-list]')
  let newarray = []

  const newfav = {
      name: event.path[2].children[1].innerHTML,
      action: event.path[2].children[1].href
  }

  let array = JSON.parse(localStorage.getItem('favs'))

  if (array) newarray = array

  let pos = newarray.findIndex(i => i.action === newfav.action);

  if (pos === -1) {

      event.path[2].children[0].setAttribute('data-menu-fav', '1')
      event.path[2].children[0].children[0].style.color = '#FFD700'

      newarray.push(newfav)

      if (newfav.name) {
          localStorage.setItem('favs', JSON.stringify(newarray))

          const a = document.createElement('a')

          a.classList.add('menu-item', 'nav-link', 'menu-link', 'text-white-50')
          a.style.padding = "0rem 0.3rem"
          a.href = newfav.action
          a.innerHTML = newfav.name

          document.querySelector('[data-fav-help]').innerHTML = ""
          div.appendChild(a)
      }
  } else {
      newarray.splice(pos, 1)
      div.children[pos].remove()

      localStorage.setItem('favs', JSON.stringify(newarray))
      event.path[2].children[0].children[0].style.color = '#fff7ba29'
  }
}

const showFav = (event) => {
  if (event.target && event.target.nodeName == "A" && !event.target.matches("[data-menu-fav]")) {
      event.target.parentElement.children[0].children[0].classList.add('fas', 'fa-star')
  }
}

const links = document.querySelectorAll('[data-div-link]')
Array.from(links).forEach(link => {
  if (link.children[1] && link.children[1].matches("[data-menu-fav]")) {
      link.children[0].children[0].style.color = '#FFD700'
  } else {
      link.children[0].children[0].classList.remove('fas', 'fa-star')
  }
})

const divs = document.querySelectorAll('[data-div-link]')
Array.from(divs).forEach(div => {
  div.addEventListener('mouseover', showFav, false)
})


document.querySelector('[data-modal-menu]').addEventListener('click', (event) => {
  if (event.target && (event.target.matches('[data-fav]') || event.target.className == 'btn-fav fas fa-star')) addFav(event)
  if (event.target && event.target.matches("[data-favaction]")) clickFav(event)
})

const btnMenu = document.querySelector('[data-selector-menu]')
if (btnMenu) {
  btnMenu.addEventListener('mouseenter', (event) => {
      $('#navbarResponsive').collapse('show');
  })
}

const modalMenu = document.querySelector('[data-modal-menu]')
if (modalMenu) {
  modalMenu.addEventListener('mouseleave', (event) => {
      $('#navbarResponsive').collapse('hide');
  })
}

const closeMenu = document.querySelector('[data-close-menu]')
if (closeMenu) {
  closeMenu.addEventListener('click', (event) => {
      $('#navbarResponsive').collapse('hide');
  })
}

const itemMenu = document.querySelectorAll('[menu-item]')
if(itemMenu){
  Array.from(itemMenu).forEach(item => {
      item.addEventListener('mouseenter', (event) => {
          event.target
      })
  })
}




listFav()
listRecents()
addRecent()
