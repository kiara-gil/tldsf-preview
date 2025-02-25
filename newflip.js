$(document).ready(function () {
  var totalPages = 76; // Total number of pages in the flipbook
  var pagePrefix = "pages/tldsf ("; // Folder and naming prefix for images
  var pageExtension = ").jpg"; // File extension for images

  // Flag to track if the user has gone through the book
  var hasGoneThroughBook = false;

  // Dynamically load the pages into the flipbook
  for (var i = 1; i <= totalPages; i++) {
    var page = $(
      '<div class="page"><img src="' +
        pagePrefix +
        i +
        pageExtension +
        '" alt="Page ' +
        i +
        '"></div>'
    );
    $("#flipbook").append(page);
  }

  // Function to calculate flipbook dimensions while maintaining the ratio
  function calculateFlipbookSize() {
    var maxWidth = 1200; // Maximum width for the container
    var maxHeight = 600; // Maximum height for the container
    var aspectRatio = maxWidth / maxHeight; // Define the desired aspect ratio

    var screenWidth = $(window).width();
    var screenHeight = $(window).height();

    // Calculate width and height based on the screen size and the aspect ratio
    var width = Math.min(screenWidth * 0.9, maxWidth);
    var height = width / aspectRatio;

    // If height exceeds maxHeight, adjust dimensions to fit within maxHeight
    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }

    return {
      width: Math.round(width),
      height: Math.round(height),
    };
  }

  // Initialize the flipbook with calculated dimensions
  var flipbookSize = calculateFlipbookSize();
  var flipbook = $(".flipbook").turn({
    width: flipbookSize.width,
    height: flipbookSize.height,
    autoCenter: true,
    elevation: 50,
    gradients: true,
  });

  // Adjust the flipbook size dynamically on window resize
  $(window).on("resize", function () {
    var newSize = calculateFlipbookSize();
    flipbook.turn("size", newSize.width, newSize.height);
    checkOrientation();  // Recheck the orientation on resize
  });

  // Show or hide the flipbook based on orientation
  function checkOrientation() {
    if (window.innerWidth > window.innerHeight) {
      // In landscape mode, show the flipbook and hide the message
      $(".flipbook-container").show();
      $(".mobile-message").hide();
    } else {
      // In portrait mode, hide the flipbook and show the message
      $(".flipbook-container").hide();
      $(".mobile-message").show();
    }
  }

  // Initial check on page load
  checkOrientation();

  // Arrow navigation
  $("#next-page").on("click", function () {
    flipbook.turn("next");
  });

  $("#prev-page").on("click", function () {
    flipbook.turn("previous");
  });

  // Show the "Back to Start", "Jump to Page", and the message when the last page is reached
  flipbook.on("turning", function (event, page, view) {
    console.log("Current page: " + (page - 2));

    // If the user has reached the last page, show the buttons and message
    if (page === totalPages) {
      $("#back-start").fadeIn(); // Show the "Back to Start" button
      $(".jump-container").fadeIn(); // Show the "Jump to Page" section
      $("#message").fadeIn(); // Show the message on the right
      hasGoneThroughBook = true; // Mark that the user has gone through the book
    } else if (hasGoneThroughBook) {
      // If the user has gone through the book once, keep the buttons and message visible
      $("#back-start").fadeIn(); // Keep the "Back to Start" button visible
      $(".jump-container").fadeIn(); // Keep the "Jump to Page" section visible
      $("#message").fadeIn(); // Keep the message visible
    } else {
      // Otherwise, hide the buttons and message
      $("#back-start").fadeOut(); // Hide the "Back to Start" button
      $(".jump-container").fadeOut(); // Hide the "Jump to Page" section
      $("#message").fadeOut(); // Hide the message
    }
  });

  // "Back to Start" button click functionality
  $("#back-start").on("click", function () {
    flipbook.turn("page", 1); // Go back to the first page
    $("#back-start").fadeOut(); // Hide the "Back to Start" button
    $(".jump-container").fadeOut(); // Hide the "Jump to Page" section
    $("#message").fadeOut(); // Hide the message
  });

  // Jump to Page button functionality
  $("#jump-button").on("click", function () {
    var pageNumber = parseInt($("#jump-to-page").val(), 10); // Get the page number from the input field
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      flipbook.turn("page", pageNumber + 2); // Jump to the selected page
    } else {
      alert(
        "Invalid page number. Please enter a valid page number between 1 and " +
          totalPages
      );
    }
  });
});
