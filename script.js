$(document).ready(function() {
    // Function to fetch the customer data from "data.json" file using AJAX
    function fetchCustomerData(callback) {
      $.ajax({
        url: "data.json",
        dataType: "json",
        success: function(data) {
          callback(data);
        },
        error: function(error) {
          console.error("Error fetching customer data:", error);
        }
      });
    }
  
    // Function to display customers in the table sorted by name
    function displayCustomersSortedByName() {
      fetchCustomerData(function(customers) {
        const sortedCustomers = customers.slice().sort((a, b) => a.name.localeCompare(b.name));
  
        const customerTableBody = $("#customerList");
        customerTableBody.empty();
  
        sortedCustomers.forEach(customer => {
          customerTableBody.append(
            `<tr>
              <td>${customer.name}</td>
              <td>${customer.country}</td>
              <td>${customer.region}</td>
              <td>${customer.status}</td>
              <td>${customer.organization}</td>
            </tr>`
          );
        });
      });
    }
  
    // Call the function to display customers sorted by name
    displayCustomersSortedByName();
  
    // Handle filter button click
    $("#filterButton").on("click", function() {
      window.location.href = "filter.html";
    });
  });
  