// console.log('app.js hooked up');
// console.log($);

$(() => { //BEGIN window.onload

  /*====== GLOBAL VARS ======*/

  const $pageHeader = $('header')
  const $submit = $('#submit')
  const $mktResultCont = $('#mktname-results')
  const $mktResSummary = $('#res-summary')
  const $mktSpecs = $('#mkt-specs')
  const imgArr = ['./img/ann_arbor.jpg', './img/banana_boxes.jpg', './img/berries.jpg', './img/bread.jpg', './img/cheese.jpg', './img/crowded_street.jpg', './img/eggs.jpg', './img/flower_buckets.jpg', './img/open_mic.jpg', './img/pink_flowers.jpg', './img/quality_meat.jpg', './img/salad_greens.jpg', './img/vendor.jpg']

  /*====== SUBMIT BTN EVENT ======*/

  $submit.on('click', (event) => {

    event.preventDefault()
    $mktResultCont.children().remove()
    $('.mkt-num').remove()

    //store the user's input in a variable
    const $userZip = $('#search-bar').val()
    //then reset the input field to blank
    $('#search-bar').val('')

    $.ajax({
      //Query the API based on the zipcode input by the user
      url: `http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=${$userZip}`

    }).then(
      (data) => {

        // $('header').addClass('with-results')
        console.log(data);
        //Data is returned in an object, so I created a variable to store the array of objects within the "results" key, which the data returns.
        const resArr = data.results

        // //element that will display total number of markets near userZip:
        // const $carItemNum = $('<h3>').html(`There are ${resArr.length} markets near zipcode ${$userZip}!`).addClass('mkt-num')

        const idArr = []

          //for the length of the resArr, do the following:
          for (let i = 0; i < resArr.length; i++) {
            //create an article for each result that's returned

            if (resArr[i].id !== "Error") {

              $('header').addClass('with-results')
              const $mktArt = $('<article>').addClass('mkt-article')

              const mktNameWithNum = resArr[i].marketname
              const mktNameNoNum = mktNameWithNum.split(' ').slice(1).join(' ')

              //create an h3 that will have the text of the marketname key from the results array - give each the class of 'market-result'
              const $mktName = $('<h3>').html(mktNameNoNum).addClass('mkt-result')
              //Store the result array key ID in a variable
              const $mktID = resArr[i].id
              idArr.push($mktID)
              // console.log(`The array of market id's is: ${idArr}.`);
              //Add the value of the ID key to the marketName element as an ID
              $mktName.attr('id', `${$mktID}`)
              $mktArt.append($mktName)
              $mktResultCont.append($mktArt)
              $mktResultCont.css('background-image', `url(${imgArr[Math.floor(Math.random() * imgArr.length)]})`)
            // }
            } else {
              idArr.push(resArr[i].id)
              console.log(idArr);
              alert(`We didn't recognize the zip code ${$userZip}. Please try a different zip code.`)
            }
          }

          console.log(`ID array outside of for loop: ${idArr}`);
//Here, something that scans through the array of market ids and only runs the following so long as the id doesn't return "error"?
//element that will display total number of markets near userZip:

        const $carItemNum = $('<h3>').html(`There are ${resArr.length} markets near zipcode       ${$userZip}!`).addClass('mkt-num')
        const $nextArrow = $('<i>').addClass("fas fa-long-arrow-alt-right")
        const $prevArrow = $('<i>').addClass("fas fa-long-arrow-alt-left")

        if (idArr.includes("Error") === false) {
          // const $carItemNum = $('<h3>').html(`There are ${resArr.length} markets near zipcode ${$userZip}!`).addClass('mkt-num')
          // const $nextArrow = $('<i>').addClass("fas fa-long-arrow-alt-right")
          // const $prevArrow = $('<i>').addClass("fas fa-long-arrow-alt-left")
          $mktResSummary.append($carItemNum)
          $('#mktname-results').prepend($prevArrow).append($nextArrow)
        }

          /*====== CAROUSEL OF MARKETS ======*/
          //currentIndex has to start at 1 so that it doesn't include the previous arrow
          let currentArtIndex = 1;
          //last index has to subtract 2 so that it doesn't include the next arrow
          let lastIndex = $('#mktname-results').children().length - 2
          // console.log(lastIndex);

          /*===== NEXT ARROW CLICK FCTN =======*/
          $nextArrow.on('click', (event) => {

            $('#mktname-results').children().eq(currentArtIndex).css('display', 'none')
            $mktResultCont.css('background-image', `url(${imgArr[Math.floor(Math.random() * imgArr.length)]})`)

            if (currentArtIndex < lastIndex) {
              currentArtIndex++
            } else {
              currentArtIndex = 1
            }

            // $('#mktname-results').children().eq(currentArtIndex).css('display', 'block')
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

      /*======== MARKET NAME ON CLICK ========*/
      //any element with the class mkt-result, do the following on click:
        $('.mkt-result').on('click', (event) => {
          console.log(event);
          //first, remove any market specs that already populate the page (from a previous search)
          $('#mkt-specs').children().remove()
          //store the event's current target in a variable
          const $mktName = $(event.currentTarget)
          console.log($(event.currentTarget).attr('id'));
          //store the currentTarget's id as a variable
          const $mktID = $(event.currentTarget).attr('id')
          console.log($mktID);
          $.ajax({
            //query the API for the market id assigned to the event target
            url: `http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=${$mktID}`
          }).then(
            (data) => {
              // console.log(data);
              const $mktDetails = data.marketdetails
              // console.log($mktDetails);
              const $address = $('<p>')
                .html($mktDetails.Address)
                .attr('id', 'address')
                .addClass('mkt-specs')
              const $map = $('<a>')
                .html(`Find on Google Maps`)
                .attr('href', `${$mktDetails.GoogleLink}`)
                .attr('target', `${$mktDetails.GoogleLink}`)
                .addClass('mkt-specs')
              const $prodList = $('<ul>')
                .addClass('mkt-specs')
              const splitProducts = $mktDetails.Products.split(';')
              console.log($mktDetails.GoogleLink);
              for (let i = 0; i < splitProducts.length; i++) {
                const $product = $('<li>').html(splitProducts[i]).addClass('mkt-specs')
                $prodList.append($product)
              }
              // const $products = $('<p>')
              //   .html($mktDetails.Products)
              //   .addClass('mkt-specs')
              const $schedule = $('<p>')
                .html($mktDetails.Schedule)
                .addClass('mkt-specs')
              const $mktNameHeader = $('<h2>')
                .html($mktName.html())
                .addClass('mkt-specs')
              $mktSpecs.css({'background-color': '#D6DCD8', 'padding': '20px'})
              $mktSpecs.append($mktNameHeader)
              $mktSpecs.append($address)
              $mktSpecs.append($schedule)
              $mktSpecs.append($map)
              $mktSpecs.append($prodList)
              // $mktSpecs.append($products)
            },
            () => {
              console.log('request did not work');
            }
          ) //end SECOND ".then"
        }) //end mktName on click
      },
      () => {
        console.log('request did not work');
      }
    ) //end FIRST .then
  }) //end searchBar on click

  $('#clear').on('click', (event) => {
    $('.mkt-num').remove()
    $('.mkt-article').remove()
    $('i').remove()
    $('.mkt-specs').remove()
    $('#mkt-specs').remove()
    $pageHeader.removeClass('with-results')
  })

}) //END window.onload


/*======================================================
-------------------------------------------------------
PROGRAM NOTES AND ATTEMPTS BELOW
-------------------------------------------------------
=======================================================*/

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
