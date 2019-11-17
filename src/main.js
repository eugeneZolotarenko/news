import './styles/styles.styl'

const apiKey = 'f4d8cb8f-16fa-4e9c-93a9-c7266a052d62'
let currentPage = 1
let totalPages
let totalNews
let keyWord = ""
let dataArray = []

let currentUrl
let defaultUrl = `https://content.guardianapis.com/search?from-date=${twoWeeksAgo()}&api-key=${apiKey}&page=${currentPage}&order-by=newest`

const articlesContainer = document.querySelector(".articles")
const searchBar = document.querySelector("form")
const pagination = document.querySelector(".pagination")
const numberPage = document.querySelector(".number-page")
const mainWords = document.querySelector("h1")

function twoWeeksAgo() {
    const todayDate = new Date()
    const day = String(todayDate.getDate() - 14).padStart(2, '0')
    const month = String(todayDate.getMonth() + 1).padStart(2, '0')
    const year = todayDate.getFullYear()
    return `${year}-${month}-${day}`
}

async function getData(data) {
    try{
      let response = await fetch(data)
      let json = await response.json()
      totalPages = json.response.pages
      totalNews = json.response.total
      dataArray.push(...json.response.results)
    } catch(err){
      console.log(err)
    }
}

function displayMainWords() {
    if (keyWord == "") {
        mainWords.innerHTML = `
        🥳 ${totalNews} interesting News for you!
    `
    } else if (totalPages === 0) {
        mainWords.innerHTML = `
        😢 Nothing about "${keyWord}", try something else!
    `
    } else {
        mainWords.innerHTML = `
        😘 ${totalNews} interesting News about "${keyWord}" for you!
    `
    }
}

function searchForWord(e) {
    e.preventDefault() 
    dataArray = []
    currentPage = 1
    const inputText = document.querySelector("[type='text']") 
    keyWord = inputText.value
    currentUrl = `https://content.guardianapis.com/search?q=${keyWord}&from-date=${twoWeeksAgo()}&api-key=${apiKey}&page=${currentPage}&order-by=newest`
    createItems(keyWord === "" ? defaultUrl : currentUrl)
    this.reset()
}
searchBar.addEventListener("submit", searchForWord)

function createArticles() {
    const articles = dataArray.map((article) => {
        const date = () => {
            return article.webPublicationDate.toString().replace(/[t-z]/gi,' | ')
        }
        return `
          <article>
            <h3>${article.webTitle}</h3>
            <div>
              <span>${article.sectionName}</span>
              <time>| ${date()}</time>
            </div>
            <a href="${article.webUrl}" target="_blank">Show more</a>
          </article>
        `
    }).join("")
    articlesContainer.innerHTML = articles
}

function displayPageNumber() {
    if (currentPage === totalPages) {
        numberPage.classList.remove('hidden')
        numberPage.innerHTML = `
        <span>Last page: <strong>${currentPage}</strong></span>
    `
    } else if (totalPages === 0) {
        numberPage.classList.add('hidden')
    } else {
        numberPage.classList.remove('hidden')
        numberPage.innerHTML = `
        <span>Current page: <strong>${currentPage}</strong> of ${totalPages}</span>
    `
    }
}

function createPagination() {
    if (totalPages <= 1) {
        pagination.classList.add('hidden')
    } else {
        pagination.classList.remove('hidden')
    }
    pagination.innerHTML = `
        <button class="to-first">To start: 1</button>
        <button class="previous">← Previous</button>
        <button class="forward">Next →</button>
        <button class="to-last">To end: ${totalPages}</button>
    `
    const arrowPrevious = document.querySelector('.previous')
    const arrowForward = document.querySelector('.forward')
    const toFirst = document.querySelector('.to-first')
    const toLast = document.querySelector('.to-last')
    if (currentPage <= 1) {
        arrowPrevious.classList.add('hidden')
        toFirst.classList.add('hidden')
    } else if (currentPage === totalPages){
        arrowForward.classList.add('hidden')
        toLast.classList.add('hidden')
    }
}

function paginationItems(e) {
    dataArray = []
    const el = e.target
    if (!el.matches('button')) return

    if (el.matches('.previous')) {
     currentPage -= 1
     if (currentPage < 1) return
    } else if (el.matches('.forward')) {
     currentPage = parseInt(currentPage) + 1
    } else if (el.matches('.to-first')) {
        currentPage = 1
    } else {
        currentPage = totalPages
    }

    defaultUrl = `https://content.guardianapis.com/search?from-date=${twoWeeksAgo()}&api-key=${apiKey}&page=${currentPage}&order-by=newest`

    currentUrl = `https://content.guardianapis.com/search?q=${keyWord}&from-date=${twoWeeksAgo()}&api-key=${apiKey}&page=${currentPage}&order-by=newest`
    createItems(keyWord === "" ? defaultUrl : currentUrl)

     toTop()
}
pagination.addEventListener('click', paginationItems)

function toTop() {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
}

async function createItems(data = defaultUrl) {
    await getData(data)
    await createArticles()
    await createPagination()
    await displayMainWords()
    await displayPageNumber()
}
createItems()