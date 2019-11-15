import './styles/styles.styl'

const apiKey = 'f4d8cb8f-16fa-4e9c-93a9-c7266a052d62'
let currentPage = 1
let totalPages
let keyWord
let dataArray = []

let currentUrl
let defaultUrl = `https://content.guardianapis.com/search?from-date=${twoWeeksAgo()}&api-key=${apiKey}&page=${currentPage}`

const articlesContainer = document.querySelector(".articles")
const searchBar = document.querySelector("form")
const pagination = document.querySelector(".pagination")

function twoWeeksAgo() {
    const todayDate = new Date()
    const day = String(todayDate.getDate() - 14).padStart(2, '0')
    const month = String(todayDate.getMonth() + 1).padStart(2, '0')
    const year = todayDate.getFullYear()
    console.log(`${year}-${month}-${day}`)
    return `${year}-${month}-${day}`
}

async function getData(data) {
    try{
      let response = await fetch(data)
      let json = await response.json()
      console.log(json.response)
      totalPages = json.response.total
      console.log(totalPages)
      dataArray.push(...json.response.results)
      console.log(dataArray)
    }catch(err){
      console.log(err)
    }
}

function createArticles() {
    const articles = dataArray.map((article, i) => {
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

function searchForWord(e) {
    e.preventDefault() 
    currentPage = 1
    dataArray = []
    const inputText = document.querySelector("[type='text']") 
    keyWord = inputText.value
    currentUrl = `https://content.guardianapis.com/search?q=${keyWord}&from-date=${twoWeeksAgo()}&api-key=${apiKey}&page=${currentPage}`
    if (inputText.value === "") return
    createItems(currentUrl)
}

// 
// START Pagination
// 

function createPagination(page) {
    console.log(pagination)
    pagination.innerHTML=`
        <button class="arrow back"><</button>
        <button class="integer first" data-i=${page}>${page}</button>
        <button class="integer" data-i=${page+1}>${page+1}</button>
        <button class="integer" data-i=${page+2}>${page+2}</button>
        <button class="integer" data-i=${page+3}>${page+3}</button>
        <span>...</span>
        <button class="integer" data-i=${totalPages}>${totalPages}</button>
        <button class="arrow forward">></button>
    `
    console.log(page)
    pagination.addEventListener('click', paginationIntegers)
}

// start integers

function paginationIntegers(e) {
    const el = e.target
    if (!el.matches('.integer')) return
    currentPage = parseInt(el.dataset.i)
    console.log(currentPage)
    if (currentPage > totalPages) return
    dataArray = []

    // start current page
    createPagination(currentPage)
    // end current page

    // start showing new items
    defaultUrl = `https://content.guardianapis.com/search?from-date=${twoWeeksAgo()}&api-key=${apiKey}&page=${currentPage}`
    currentUrl = `https://content.guardianapis.com/search?q=${keyWord}&from-date=${twoWeeksAgo()}&api-key=${apiKey}&page=${currentPage}`

    createItems(keyWord == undefined ? defaultUrl : currentUrl, currentPage)
    // end showing new items

    // if (el.matches('.first') & currentPage >= 2) {
    //     createPagination(currentPage - 1)
    // }
}

// end integers

// 
// END Pagination
// 

async function createItems(data = defaultUrl, page = 1) {
    await getData(data)
    await createArticles()
    await createPagination(page)
}
createItems()

searchBar.addEventListener("submit", searchForWord)