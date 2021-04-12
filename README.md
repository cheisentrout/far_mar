# FarMar - Find Your Market

Project Description

Using JavaScript, jQuery, an open source API, HTML and CSS to build an app that finds local farmers markets based on zip code.

My goal was to:
  - Make it easy for people to find local food sources near them
  - Display data like market names, locations, hours, and products
  - Support small farms and the local food movement through tech!

Day 1

I set up some basic HTML and started testing the USDA's API for farmers markets. I realized that you could query the API either by zipcode, OR by market details - the former returns markets local to a zip, and the latter returns content like market addresses, hours, and products typically carried.

I assigned the zip variable to query based on a user's input. Then, once the array of markets was returned, each name was associated with that market's national "ID", which became my method of querying for specific markets' details.

Day 2

I got the bulk of my CSS done today, making sure that my elements being added through jQuery were styled appropriately and responsively (the latter, to only a very basic degree).

This was also the day that I made sure the data from the API would populate all of the market details on the "click within a click" function, on the target of each market name!

Day 3

Today has been a major test-and-retest day! Some bugs I've dealt with are:
  - What to do when the API doesn't recognize the zip
  - The clear button and the search bar function were removing an entire hard-coded HTML <section> tag rather than simply emptying/hiding it - so certain details weren't appearing in the DOM even though they were logging as appended.
