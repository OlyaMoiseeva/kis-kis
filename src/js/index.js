document.addEventListener('DOMContentLoaded', function() {
  // render
  function makeEqpImage(type) {
    return {
      img: `<img class="card__icon" src="images/${type}.svg">`,
      name: type
    }
  }

  const imgNull = makeEqpImage('eqp');
  const imgBad = makeEqpImage('eqp1');
  const imgNail = makeEqpImage('eqp2');
  const imgGames = makeEqpImage('eqp3');
  const imgHouse = makeEqpImage('eqp4');

  const page = document.querySelector('.page-content__right');
  
  const cards = [
    {
      image: 'images/cat1.jpg',
      name: 'Эконом',
      size: '90x70x180',
      square: '0,63',
      equipment: [imgNull],
      price: 100
    },
    {
      image: 'images/cat2.jpg',
      name: 'Эконом плюс',
      size: '90x100x180',
      square: '0,90',
      equipment: [imgBad, imgNail],
      price: 200
    },
    {
      image: 'images/cat3.jpg',
      name: 'Комфорт',
      size: '100x125x180',
      square: '1,13',
      equipment: [imgBad, imgNail, imgGames],
      price: 250
    },
    {
      image: 'images/cat4.jpg',
      name: 'Сьют',
      size: '125x125x180',
      square: '1,56',
      equipment: [imgBad, imgNail, imgGames],
      price: 350
    },
    {
      image: 'images/cat5.jpg',
      name: 'Люкс',
      size: '160x160x180',
      square: '2,56',
      equipment: [imgBad, imgNail, imgGames, imgHouse],
      price: 500
    },
    {
      image: 'images/cat6.jpg',
      name: 'Супер-Люкс',
      size: '180x160x180',
      square: '2,88',
      equipment: [imgBad, imgNail, imgGames, imgHouse],
      price: 600
    }
  ];

  function render(arr) {

    for (let item of arr) {
      const card = `
        <img class="card__image" alt="cat" src="${item.image}">
        <div class="card__content">
          <h2 class="card__title">${item.name}</h2>
          <ul class="card__list">
            <li class="card__list-item">Размеры <span class="card__size">(ШхГхВ) - ${item.size} см</span></li>
            <li class="card__list-item">Площадь <span class="card__sqr">- ${item.square} м2</span></li>
            <li class="card__list-item">Оснащение номера <span class="card__eqp">${item.equipment.map(i => i.img).join(' ')}</span></li>
            <li class="card__list-item">Цена за сутки: <span class="card__price">${item.price}&#8381;</span></li>
          </ul>
          <a class="card__button" href="#">Забронировать</a>
        </div>
      `
      let cardWrap = document.createElement('div');
      cardWrap.setAttribute('class', 'card');
      cardWrap.innerHTML = card;
      page.appendChild(cardWrap);
      if(newArr) {
        currentArr = newArr;
      } else {
        currentArr = cards;
      }
    }
  }
  render(cards);

  // select
  let newArr;
  let currentArr;
  const selectList = document.querySelector('.select__list');
  
  document.addEventListener('mousedown', function(event) {
    if(event.target.closest('.select__list') === null) {
      selectList.classList.remove('select__list--active');
    }
  });

  selectList.addEventListener('click', function(event) {
    const target = event.target;
    selectList.classList.toggle('select__list--active');
    if (target.tagName.toLowerCase() === 'li') {
      const options = [...document.querySelectorAll('.select__item')];
      for (let i of options) {
        i.classList.remove('active');
      }
      target.classList.add('active');
      Sorted(currentArr, target);
    }
  });
  
  function Sorted (arr, sortProp) {
    const attribute = sortProp.getAttribute('data-sort');
    
    (attribute == '1') ? newArr = arr.slice().sort((a, b) => a.square > b.square ? 1 : -1) :
    (attribute == '2') ? newArr = arr.slice().sort((a, b) => a.square < b.square ? 1 : -1) :
    (attribute == '3') ? newArr = arr.slice().sort((a, b) => a.price > b.price ? 1 : -1) :
    (attribute == '4') ? newArr = arr.slice().sort((a, b) => a.price < b.price ? 1 : -1) :
    newArr = arr;
    page.innerHTML = '';
    render(newArr);
    if (newArr.length === 0) {
      noContent();
    }
  }

  function noContent () {
    let no = document.createElement('div');
    no.innerHTML = 'ничего(';
    page.appendChild(no);
  }

  // filter
  const confirm = document.querySelector('.filters__button--confirm');
  const reset = document.querySelector('.filters__button--reset');

  const priceTo = document.querySelector('.filters__price--to');
  const priceFrom = document.querySelector('.filters__price--from');

  confirm.addEventListener('click', function() {
    const sortProp = document.querySelector('.select__item.active');

    const sqrInpChecked = [...document.querySelectorAll('.checkbox__inp--sqr:checked')];
    const sqrInpAll = [...document.querySelectorAll('.checkbox__inp--sqr')];
    const eqpInpChecked = [...document.querySelectorAll('.checkbox__inp--eqp:checked')];
    const eqpInpAll = [...document.querySelectorAll('.checkbox__inp--eqp')];
    const sqr = [];
    const eqp = [];

    for (let i of sqrInpChecked) {
      sqr.push(i.getAttribute('data-value'));
    }
    if (sqr.length === 0) {
      for (let i of sqrInpAll) {
        sqr.push(i.getAttribute('data-value'));
      }
    }
    for (let i of eqpInpChecked) {
      eqp.push(i.getAttribute('data-value'));
    }
    if (eqp.length === 0) {
      for (let i of eqpInpAll) {
        eqp.push(i.getAttribute('data-value'));
      }
    }
    
    newArr = cards
      .filter((item) => {
        for (const s of sqr) {
          if (item.square === s) {
            return true;
          }
        }
        
        return false;
      })
      .filter((item) => {
        for (const e of eqp) {
          for (let i of item.equipment) {
            if (i.name === e) {
              return true;
            }
          }
        }

        return false;
      })

    if (priceTo.value != '' || priceFrom.value != '') {
      newArr = newArr.filter(item => (priceTo.value != '' ? priceTo.value >= item.price : true) && (priceFrom.value != '' ? item.price >= priceFrom.value : true));
    }
    
    Sorted(newArr, sortProp);
  });

  reset.addEventListener('click', function() {
    const allInp = [...document.querySelectorAll('input[type="checkbox"]:checked')];
    for (let i of allInp) {
      i.checked = false;
    }
    priceTo.value = '';
    priceFrom.value = '';
    page.innerHTML = '';
    render(cards);
  });

   // header
  const header = document.getElementById('header');

  window.onscroll = function() {
    if (window.pageYOffset > 0) {
        header.classList.add('header--fix');
    }
    else if (window.pageYOffset < 120) {
        header.classList.remove('header--fix');
    }
  };
  // filter toggle
  const filterToggle = document.querySelector('.filters__mob-spoiler');
  const filter = document.querySelector('.filters');

  filterToggle.addEventListener('click', function() {
    filter.classList.toggle('filters--inv');
    filterToggle.classList.toggle('filters__mob-spoiler--active');
  });

  // burger toggle
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.header__navbar');

  burger.addEventListener('click', function() {
    menu.classList.toggle('header__navbar--inv');
    document.body.classList.toggle('no-scroll');
    this.classList.toggle('burger--active');
  });

});