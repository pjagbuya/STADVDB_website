function populateFields(button) {
    // Get the row containing the clicked button
    const row = button.closest("tr");
  
    // Extract data from the row
    const appId = button.getAttribute("data-id");
    const name = row.querySelectorAll(".tc")[2].textContent.trim(); // Name
    const releaseDate = row.querySelectorAll(".tc")[3].textContent.trim(); // Release Date
    const price = row.querySelectorAll(".tc")[4].textContent.trim(); // Price
    const developers = row.querySelectorAll(".tc")[5].textContent.trim(); // Developers
  
    // Populate the corresponding inputs and labels
    $("#appid").text(appId);
    document.getElementById("name").value = name;
    document.getElementById("date").value = releaseDate;
    document.getElementById("price").value = price;
    document.getElementById("developers").value = developers;
  
    // Log for debugging
    console.log("Data populated:", { appId, name, releaseDate, price, developers });
  }

$(document).ready(function () {

    const buttons = document.querySelectorAll('button[name="select"]');
    buttons.forEach((button) => {
        button.addEventListener("click", (event) => {
          event.preventDefault();
          populateFields(button); // Call the reusable function
        });
      });


    $('#search').on('click', function (event) {
        
            const selectedOption = $("#input_field_update option:selected").text();

            const searchText = $("#search-txt").val();
            console.log("Clicked");
            
            console.log(searchText);
            console.log(selectedOption);


            $.post(`search`,

              { msg: true,
                input_field_update: selectedOption,
                search: searchText
              },
              function(data, status){
                try {
                if(status === 'success'){
           
          
          
                  const templateSource = document.getElementById('table-display-template').innerHTML;
                  console.log("Compiling: " + templateSource);
                  const template = Handlebars.compile(templateSource);
          
                  let renderedProfile =  template({games: data.game});
                  $('#sql-results').empty();
                  $('#sql-results').append(renderedProfile);
                  const samebtns = document.querySelectorAll('button[name="select"]');
                  samebtns.forEach((button) => {
                      button.addEventListener("click", (event) => {
                        event.preventDefault();
                        populateFields(button); // Call the reusable function
                      });
                    });
                  console.log("Actually done")
          
                }//if
                else {
                  // Error handling for status other than 'success'
                  console.error("Error:", data);
                  alert("An error occurred while editing the reservation. Please try again."); // Or display appropriate error message
                }
            } catch (error) {
                // Handle potential errors during AJAX request or DOM manipulation
                console.error("Error:", error);
                alert("An unexpected error occurred. Please try again later."); // Or display appropriate error message
                }
              });//fn+post
          
          

      });





});