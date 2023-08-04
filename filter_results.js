$(document).ready(function () {
  // Function to fetch the customer data from "data.json" file using AJAX
  function fetchCustomerData(callback) {
    $.ajax({
      url: "data.json",
      dataType: "json",
      success: function (data) {
        callback(data);
      },
      error: function (error) {
        console.error("Error fetching customer data:", error);
      }
    });
  }

  // Function to populate the datalist options for Intelli-sense search
  function populateDatalistOptions(customers, property, datalistId) {
    const uniqueOptions = [...new Set(customers.map(customer => customer[property]))];
    const datalist = $(`#${datalistId}`);
    datalist.empty();
  }

  // Variable to keep track of the current sorting order
  let isAscending = true;

  // Function to toggle the sorting order
  function toggleSortingOrder() {
    isAscending = !isAscending;
  }

  // Function to display customers based on search query and filters
  function displayCustomers(query, filters) {
    fetchCustomerData(function (customers) {
      const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(query.toLowerCase()) &&
        (!filters.region || customer.region === filters.region) &&
        (!filters.country || customer.country === filters.country) &&
        (!filters.status || customer.status === filters.status) &&
        (!filters.organization || customer.organization === filters.organization)
      );

      // Sort the customers based on name
      const sortedCustomers = filteredCustomers.sort((a, b) => {
        if (a.name < b.name) return isAscending ? -1 : 1;
        if (a.name > b.name) return isAscending ? 1 : -1;
        return 0;
      });

      const customerTableBody = $("#customerList");
      customerTableBody.empty();

      if (sortedCustomers.length === 0) {
        customerTableBody.append("<tr><td colspan='5'>No customers found.</td></tr>");
      } else {
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
      }
    });
  }

  // Autocomplete function for filter inputs
  function autocompleteFilterInput(inputId, optionsProperty) {
    const filterInput = $(inputId);
    const dropdown = filterInput.siblings("datalist");

    let searchOptions = [];
    let prevSearchQuery = ""; // Track previous search query

    filterInput.on("input", function () {
      const searchQuery = $(this).val();
      if (searchQuery === prevSearchQuery) {
        return;
      }

      prevSearchQuery = searchQuery; // Update previous search query

      fetchCustomerData(function (customers) {
        searchOptions = customers.map(customer => customer[optionsProperty]);
        const uniqueMatchingOptions = [...new Set(searchOptions)];

        const matchingOptions = uniqueMatchingOptions.filter(option =>
          option.toLowerCase().startsWith(searchQuery.toLowerCase())
        );

        dropdown.empty();
        matchingOptions.slice(0, 10).forEach(option => {
          dropdown.append(`<option value="${option}">${option}</option>`);
        });
      });
    });

    // Handle suggestion selection and input clearing
    dropdown.on("click", "option", function () {
      const selectedValue = $(this).val();
      filterInput.val(selectedValue);
      dropdown.empty();
      prevSearchQuery = ""; // Reset previous search query
      filterInput.trigger("input"); // Trigger input event to update suggestions
      filterInput.blur(); // Blur the input to clear suggestions
    });

    // Clear suggestions when focus is lost
    filterInput.on("blur", function () {
      if (!filterInput.is(":focus")) { // Check if input is not in focus
        dropdown.empty();
        prevSearchQuery = ""; // Reset previous search query
      }
    });
  }

  // Autocomplete suggestions for each filter input
  autocompleteFilterInput("#filterRegion", "region");
  autocompleteFilterInput("#filterCountry", "country");
  autocompleteFilterInput("#filterStatus", "status");
  autocompleteFilterInput("#filterOrganization", "organization");
  // Autocomplete suggestions for the customer name input
  autocompleteFilterInput("#searchInput", "name");

  // Handle filter button click
  $("#filterButton").on("click", function () {
    const searchQuery = $("#searchInput").val();
    const filters = getFilters();
    displayCustomers(searchQuery, filters);
  });

  // Handle reset button click
  $("#resetButton").on("click", function () {
    // Reset search input
    $("#searchInput").val("");
    // Reset filter inputs
    $("#filterRegion").val("");
    $("#filterCountry").val("");
    $("#filterStatus").val("");
    $("#filterOrganization").val("");
    // Redisplay customers with empty search and filters
    displayCustomers("", getFilters());
  });

  // Function to get the entered filters
  function getFilters() {
    return {
      region: $("#filterRegion").val(),
      country: $("#filterCountry").val(),
      status: $("#filterStatus").val(),
      organization: $("#filterOrganization").val(),
      name: $("#searchInput").val()
    };
  }

  // Populate the customer table with data on page load
  fetchCustomerData(function (customers) {
    populateDatalistOptions(customers, "region", "regionOptions");
    populateDatalistOptions(customers, "country", "countryOptions");
    populateDatalistOptions(customers, "status", "statusOptions");
    populateDatalistOptions(customers, "organization", "organizationOptions");
    populateDatalistOptions(customers, "name", "nameOptions");
    displayCustomers("", getFilters());
  });
});
