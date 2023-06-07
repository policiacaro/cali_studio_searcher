window.onload = setup;
const wikiAPI = "https://en.wikipedia.org/w/api.php?origin=*&action=query&list=categorymembers&cmtitle=Category:Video_game_companies_based_in_California&cmlimit=max&format=json";
const company_Array = [];
const wiki_Search = "https://en.wikipedia.org/w/rest.php/v1/page/";
  //WIKI API call 
  //https://en.wikipedia.org/w/api.php?origin=*&action=query&list=categorymembers&cmtitle=Category:Video_game_companies_based_in_California&cmlimit=max&format=json
  //WIKI individual page call
  //https://en.wikipedia.org/w/rest.php/v1/page/
  //https://en.wikipedia.org/w/rest.php/v1/page/Acclaim_Games
  //insert page title at end, spaces need to become underscore

function company_Status(event) {
    let source_String;
    let raw_Wiki = wiki_Search + event.target.id;
    let wiki_Search_URL = raw_Wiki.slice(0, (raw_Wiki.length-7));
    let p_id = event.target.id.slice(0, (event.target.id.length-7));
    let element_p = document.getElementById(p_id);
    let target_Element = event.target;
    wiki_Search_URL = wiki_Search_URL.replaceAll(" ", "_");
    fetch(wiki_Search_URL)
      .then((response) => response.json())
      .then((data) => {
        source_String = data.source;
    if(source_String.includes("dissolved") || source_String.includes("consolidated")) {
      element_p.innerText = "Company Status: Shutdown, Defunct, or Dissolved";
      element_p.setAttribute("style", "background:red");
      event.target.removeEventListener("click", company_Status);
    } else {
      element_p.innerText = "Company Status: OK";
      element_p.setAttribute("style", "background:green");
      event.target.removeEventListener("click", company_Status);
    }
      });
}

async function generate_List() {
  const span = document.querySelector("span");
  const button = document.querySelector("#list_Generate");
  if(list.childElementCount === 0) {
    const response = await fetch(wikiAPI);
    const json = await response.json();
    json.query.categorymembers.forEach(company => {
      let company_name = company.title;
      company_name = company_name.replaceAll(" ", "_");
      company_Array.push(company.title);
      list.insertAdjacentHTML("beforeend", `<li>${company.title}</li>`)
      list.insertAdjacentHTML("beforeend", `<div class="list_Status"><button class="list_Button" id="${company.title}_Button">Check Status</button><p id="${company.title}">Company Status: </p><a href=https://en.wikipedia.org/wiki/${company_name}>https://en.wikipedia.org/wiki/${company_name}</a></div>`);
      document.getElementById(`${company.title}`).innerText += " Unknown";
      document.getElementById(`${company.title}_Button`).addEventListener("click", company_Status);
    });
  } else {
    span.innerText = "List is already generated!";
  }
}

function setup() {
  const button = document.querySelector("#list_Generate");
  const list = document.querySelector("ul");
  
  button.addEventListener("click", generate_List);
}