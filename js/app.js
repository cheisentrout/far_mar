$(() => { //BEGIN window.onload

  $('#clear').hide()
  $('#to-top-btn').hide()

  /*====== GLOBAL VARS ======*/

  const googleKey = `AIzaSyBT9_mprou4lCaUHTuQNhvRCNM8hyim7LE`
  const $pageHeader = $('header')
  const $submit = $('#submit')
  const $mktResultCont = $('#mktname-results')
  const $mktResSummary = $('#res-summary')
  const $mktSpecs = $('#mkt-specs')
  const imgArr = ['./img/ann_arbor.jpg', './img/banana_boxes.jpg', './img/berries.jpg', './img/bread.jpg', './img/cheese.jpg', './img/crowded_street.jpg', './img/eggs.jpg', './img/flower_buckets.jpg', './img/open_mic.jpg', './img/pink_flowers.jpg', './img/quality_meat.jpg', './img/salad_greens.jpg', './img/vendor.jpg']

  /*====== SUBMIT BTN EVENT ======*/

  $submit.on('click', (event) => {

    event.preventDefault()
    //Set up the page: empty the div for market specifics, remove text related to market results, and reveal the clear and "to the top" buttons.
    $mktResultCont.children().remove()
    $('.mkt-num').remove()
    $mktSpecs.empty()
    $mktSpecs.hide()
    $('#clear').show()
    $('#to-top-btn').show()

    //Store the zip from the user input!
    const $userZip = $('#search-bar').val()
    //Then immediately reset the input field to the placeholder text:
    $('#search-bar').val('')

    $.ajax({
      //Query the API based on the zipcode input by the user
      url: `https://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=${$userZip}`

    }).then(
      (data) => {
        console.log(data);
        //Data is returned in an object, so I created a variable to store the array of objects within the "results" key, which the data returns.
        const resArr = data.results
        const idArr = []
          //For the length of the resArr, do the following:
          for (let i = 0; i < resArr.length; i++) {
            //First, filter out any results that don't have a functional name or market ID:
            if (resArr[i].id !== "Error") {
              //With-results floats the header upwards on the page.
              $('header').addClass('with-results')
              //Create an article tag for each market result
              const $mktArt = $('<article>').addClass('mkt-article')
              //Remove the numbers returned before market names from the API
              const mktNameWithNum = resArr[i].marketname
              const mktNameNoNum = mktNameWithNum.split(' ').slice(1).join(' ')
              //Create a heading for each marketname returned from the data
              const $mktName = $('<h3>').html(mktNameNoNum).addClass('mkt-result')
              //Store the result array ID key in a variable
              const $mktID = resArr[i].id
              idArr.push($mktID)
              //Add the value of the ID key to the marketName element as an ID attribute
              $mktName.attr('id', `${$mktID}`)
              $mktArt.append($mktName)
              $mktResultCont.append($mktArt)
              //Generate a random stock image for the background of the market carousel
              $mktResultCont.css('background-image', `url(${imgArr[Math.floor(Math.random() * imgArr.length)]})`)
            // }
            } else {
              idArr.push(resArr[i].id)
              alert(`We didn't recognize the zip code ${$userZip}. Please try a different zip code.`)
            }
          }

        //Create the element that will display the total number of markets near userZip:
        const $carItemNum = $('<h3>').html(`There are ${resArr.length} markets near zip ${$userZip}!`).addClass('mkt-num')
        const $mktNumExp = $('<p>').html(`Use the arrows to scroll through them, and click on any market to learn more about it.`).addClass('mkt-num')
        const $nextArrow = $('<i>').addClass("fas fa-long-arrow-alt-right").attr('id', 'next')
        const $prevArrow = $('<i>').addClass("fas fa-long-arrow-alt-left").attr('id', 'prev')
        //If the idArr does NOT include an error... append these results to the page.
        if (idArr.includes("Error") === false) {
          $mktResSummary.append($carItemNum)
          $mktResSummary.append($mktNumExp)
          $('#mktname-results').prepend($prevArrow).append($nextArrow)
        }

          /*====== CAROUSEL OF MARKETS ======*/
          //currentIndex has to start at 1 so that it doesn't include the previous arrow
          let currentArtIndex = 1;
          //last index has to subtract 2 so that it doesn't include the next arrow
          let lastIndex = $('#mktname-results').children().length - 2

          /*===== NEXT ARROW CLICK FCTN =======*/
          $nextArrow.on('click', (event) => {

            $('#mktname-results').children().eq(currentArtIndex).css('display', 'none')
            $mktResultCont.css('background-image', `url(${imgArr[Math.floor(Math.random() * imgArr.length)]})`)

            if (currentArtIndex < lastIndex) {
              currentArtIndex++
            } else {
              currentArtIndex = 1
            }

            $('#mktname-results').children().eq(currentArtIndex).css({'display': 'flex', 'align-items': 'center', 'justify-content': 'center'})

          })
          /*===== PREVIOUS ARROW CLICK FCTN ======*/
          $prevArrow.on('click', (event) => {

            $('#mktname-results').children().eq(currentArtIndex).css('display', 'none')
            $mktResultCont.css('background-image', `url(${imgArr[Math.floor(Math.random() * imgArr.length)]})`)

            if (currentArtIndex > 1) {
              currentArtIndex--
            } else {
              currentArtIndex = lastIndex
            }

            $('#mktname-results').children().eq(currentArtIndex).css({'display': 'flex', 'align-items': 'center', 'justify-content': 'center'})

          })
          scroll({
            top: 450,
            left: 0,
            behavior: 'smooth'
          })

      /*======== MARKET NAME ON CLICK ========*/
      //Listen to each market name, and on click, run the following:
        $('.mkt-result').on('click', (event) => {
          console.log(event)
          //First, remove any market specs that already populate the page (from a previous search)
          $mktSpecs.empty()
          //Store the event's current target in a variable
          const $mktName = $(event.currentTarget)
          //store the currentTarget's id as a variable
          const $mktID = $(event.currentTarget).attr('id')

          $.ajax({
            //query the API for the market id assigned to the event target
            url: `https://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=${$mktID}`
          }).then(
            (data) => {
              //Populate the DOM with the marketdetail information:
              $mktSpecs.show()
              const $mktDetails = data.marketdetails
              const $address = $('<p>')
                .html($mktDetails.Address)
                .attr('id', 'address')
                .addClass('mkt-specs')
              const $mapLink = $('<a>')
                .html(`Find on Google Maps`)
                .attr('href', `${$mktDetails.GoogleLink}`)
                .attr('target', `${$mktDetails.GoogleLink}`)
                .addClass('mkt-specs')
              const googleSearch = $mktDetails.Address
              const $map = $('<iframe>')
                .attr('src', `https://www.google.com/maps/embed/v1/place?key=${googleKey}
    &q=${googleSearch}`)
              .css({'width': '100%', 'height': '250px'})

              const $prodHeader = $('<h4>').html(`This market carries the following products:`)
              const $prodList = $('<ul>')
                .addClass('mkt-specs')
              const splitProducts = $mktDetails.Products.split(';')
              for (let i = 0; i < splitProducts.length; i++) {
                const $product = $('<li>').html(splitProducts[i]).addClass('mkt-specs').addClass('list-item')
                $prodList.append($product)
              }
              const $prodChooser = $('<h4>').html(`Select a product to see other markets in your area that carry similar items.`)
              const $schedule = $('<p>')
                .html($mktDetails.Schedule)
                .addClass('mkt-specs')
              const $mktNameHeader = $('<h2>')
                .html($mktName.html())
                .addClass('mkt-specs')
              const $addAndSchedCont = $('<div>').attr('id', 'addAndSched').addClass('addAndSched')

              $addAndSchedCont.append($address)
              $addAndSchedCont.append($schedule)
              $addAndSchedCont.append($mapLink)
              $mktSpecs.css({'background-color': '#D6DCD8', 'padding': '20px'})
              $mktSpecs.append($mktNameHeader)
              $mktSpecs.append($addAndSchedCont)
              $mktSpecs.append($map)
              $mktSpecs.append($prodHeader)
              $mktSpecs.append($prodList)
              $mktSpecs.append($prodChooser)

              scroll({
                top: 650,
                left: 0,
                behavior: 'smooth'
              })

              $('li').on('click', (event) => {

                $('.mktMatch').remove()
                $('#match-container').remove()
                $('#match-header').remove()
                //Split up product strings into an array of characters - some begin with a space, and interfere with matching the html to other markets' product arrays.
                const charArr = Array.from($(event.target).html().split(" "))

                if (charArr[0] === "") {
                  charArr.shift()
                }
                const prodHTML = charArr.join(' ')

                const $matchHeader = $('<p>').html(`Nice! These markets nearby also carry ${prodHTML.toLowerCase()}:`).attr('id', 'match-header').css({'background-color': 'inherit', 'justify-content': 'center'})
                const $matchCont = $('<div>').attr('id', 'match-container')
                $mktSpecs.append($matchHeader)
                $mktSpecs.append($matchCont)

                //Loop through each local market, making a marketdetails request for each based on their IDs
                for (let i = 0; i < resArr.length; i++) {
                  $.ajax({
                    //Query the API for the market id assigned to the event target
                    url: `https://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=${resArr[i].id}`
                  }).then(
                    (data) => {
                      const products = data.marketdetails.Products.split("; ")
                      const productArr = [] //start with an empty array each time, so that it's fresh for each specific market check
                      productArr.push(products)
                      //Add something here so it doesn't display current market selection///
                      if (productArr[0].includes(prodHTML)) {
                        const $mktMatch = $('<h3>').html(resArr[i].marketname.split(' ').slice(1).join(' ')).addClass('mktMatch')
                        // $mktMatch.on('click', (event) => {
                        //   $mktMatch.toggleClass('back')
                        // })
                        $matchCont.append($mktMatch)
                      } else {
                        console.log(`${resArr[i].marketname} does not carry ${prodHTML}`);
                      }
                    }
                  ) //end .then()
                } //end result array for loop
              }) //end ul on click
            },
            () => {
              console.log('request did not work');
            }
          ) //end second AJAX request (Market details)
        }) // end mktName click listener
      },
      () => {
        console.log('request did not work');
      }
    ) // end first AJAX request (market by zip)
  }) // end SUBMIT click listener

  $('#clear').on('click', (event) => {
    $('.mkt-num').remove()
    $('.mkt-article').remove()
    $('#next').remove()
    $('#prev').remove()
    $('.mkt-specs').remove()
    $mktSpecs.empty()
    $mktSpecs.hide()
    $pageHeader.removeClass('with-results')
    $('#clear').hide()
    $('#to-top-btn').hide()
  })

}) //END window.onload


/*======================================================
-------------------------------------------------------
PROGRAM NOTES AND ATTEMPTS BELOW
-------------------------------------------------------
=======================================================*/

//Ways to optimize my code:
//  - store all marketnames in a function, or variables

// http://maps.google.com/?q=42.165956%2C%20-83.781146%20(%22Saline+Farmers+Market%22

// let $zip = '48103'
// let zip = $('input[type="text"]').val()
// let id = 1020005
// console.log(zip);
// const $searchBar = $('#search-bar').html('test')
// console.log($searchBar);

/*======= BELOW QUERY WORKS returns marketDetails by spec. ID ========*/
// $.ajax({
//   url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=" + id,
//   //might have to do separate queries - zip and then id will provide market details like season, address, and products
// }).then(
//   (data) => {
//     console.log(data);
//   },
//   () => {
//     console.log('request did not work');
//   }
// )
/*==================== END marketDetails query ========================*/

// function getResults(zip) {
//     // or
//     // function getResults(lat, lng) {
//     $.ajax({
//         type: "GET",
//         contentType: "application/json; charset=utf-8",
//         // submit a get request to the restful service zipSearch or locSearch.
//         url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=" + zip,
//         // or
//         // url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/locSearch?lat=" + lat + "&lng=" + lng,
//         dataType: 'jsonp',
//         jsonpCallback: 'searchResultsHandler'
//     })
// }
// //iterate through the JSON result object.
// function searchResultsHandler(searchResults) {
//     for (var key in searchresults) {
//         alert(key);
//         var results = searchresults[key];
//         for (var i = 0; i < results.length; i++) {
//             var result = results[i];
//             for (var key in result) {
//                 //only do an alert on the first search result
//                 if (i == 0) {
//                     alert(result[key]);
//                 }
//             }
//         }
//     }
// }
// searchResultsHandler(48103)
// getResults('48103')

// mktDetail?id=" + id,
//might have to do separate queries - zip and then id will provide market details like season, address, and products
//query by zip

          // console.log(`${resArr[i].marketname}'s ID is: ${$marketName.attr('id')}`);

/* Trying to account for unrecognized zips */

//   if (resArr[i].id = "Error") {
//     alert(`We didn't recognize the zip code ${$userZip}. Please try a different zip code.`)
//   } else {
//     const $mktArt = $('<article>').addClass('mkt-article')
//
//     const mktNameWithNum = resArr[i].marketname
//     const mktNameNoNum = mktNameWithNum.split(' ').slice(1).join(' ')
//
//     //create an h3 that will have the text of the marketname key from the results array - give each the class of 'market-result'
//     const $mktName = $('<h3>').html(mktNameNoNum).addClass('mkt-result')
//     //Store the result array key ID in a variable
//     const $mktID = resArr[i].id
//     idArr.push($mktID)
//     console.log(idArr);
//     //Add the value of the ID key to the marketName element as an ID
//     $mktName.attr('id', `${$mktID}`)
//     $mktArt.append($mktName)
//     $mktResultCont.append($mktArt)
//     $mktResultCont.css('background-image', `url(${imgArr[Math.floor(Math.random() * imgArr.length)]})`)
//   }
// }
