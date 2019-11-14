import './styles/styles.styl'

const apiKey = "f4d8cb8f-16fa-4e9c-93a9-c7266a052d62"
let currentPage = 1
let totalPages
let dataArray = []

const dataUrl = `https://content.guardianapis.com/search?from-date=${twoWeeksAgo()}&api-key=${apiKey}&page=${currentPage}`

const articlesContainer = document.querySelector(".articles")
// const pagination = document.querySelector(".pagination")

function twoWeeksAgo() {
    const todayDate = new Date()
    const day = String(todayDate.getDate() - 13).padStart(2, '0')
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
            <a href="${article.webUrl}">Show more</a>
          </article>
        `
    }).join("")
    articlesContainer.innerHTML = articles
}

// function searchForWord() {

// }

// function createPagination() {

// }

async function createItems() {
    await getData(dataUrl)
    await createArticles()
    // await createPagination()
}
createItems()