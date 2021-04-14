# FarMar - Find Your Market

Project Description

Using JavaScript, jQuery, an open source API, HTML and CSS, I built an app that finds local farmers markets based on zip code and product preference!

My goal was to:
  - Make it easy for people to find local food sources near them
  - Display data like market names, locations, hours, and products
  - Support small farms and the local food movement through tech!

Day 1

I set up some basic HTML and started testing the USDA's API for farmers markets. I realized that you could query the API either by zip code, OR by market details - the former returns markets local to a zip, and the latter returns content like market addresses, hours, and products typically carried.

I assigned the zip variable to query based on a user's input. Then, once the array of markets was returned, each name was associated with that market's national "ID", which became my method of querying for specific markets' details.

Day 2

I got the bulk of my CSS done today, making sure that my elements being added through jQuery were styled appropriately and responsively (the latter, to only a very basic degree).

This was also the day that I made sure the data from the API would populate all of the market details on the "click within a click" function, on the target of each market name!

Day 3

Today has been a major test-and-retest day! Some bugs I've dealt with are:
  - What to do when the API doesn't recognize the zip
  - The clear button and the search bar function were removing an entire hard-coded HTML <section> tag rather than simply emptying/hiding it - so certain details weren't appearing in the DOM even though they were logging as appended.

Day 4

On Tuesday, I mostly dealt with writing a function that would match local results by product preference. I wanted it to work so that when a user clicks a product they're looking for, a list of local markets who also carry that product is generated. This was achieved by creating an event listener on each product list item, and looping through the local results by their IDs in order to access the "marketdetails" from the API. Each time the loop runs, I want it to check through each local market's product list, and check if each item is equal to the html of the product that was clicked. This was complicated mostly by how the data is stored in the API! Some product strings are preceded by a space, while others were not - it took me a while to figure that out and remedy it.

Ways to improve:

  - Overall, I could refactor my code quite a bit to be more concise. I could write global functions that deal with the market name strings, product strings, etc. Right now the program is coded very much like a story, start to finish, with no callbacks.
  - There was fancy CSS I wanted to get to with this project, like being able to flip the product match market name cards, and creating smooth page transitions whenever new content loaded.
  - Embed Google maps
  - Store user's favorite products using local storage
