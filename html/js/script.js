$(function() {
	$.post('http://esx_identity/ready', JSON.stringify({}));

	window.addEventListener('message', function(event) {
		if (event.data.type == "enableui") {
			document.body.style.display = event.data.enable ? "block" : "none";
		}
	});
	
	$("#register").submit(function(event) {
		event.preventDefault(); // Prevent form from submitting
		
		// Check form validation
		if (!validateForm()) {
			errorMessage.textContent = "Please fill in all fields correctly.";
			errorMessage.classList.add('error-visible');
			return;
		}
		
		// Check date
		var dateValue = $("#dateofbirth").val();
		if (!dateValue) {
			errorMessage.textContent = "Please enter a valid date of birth.";
			errorMessage.classList.add('error-visible');
			return;
		}
		
		// Date is already in DD-MM-YYYY format
		var formattedDate = dateValue;
		
		// Check date format
		var dateParts = formattedDate.split('-');
		if (dateParts.length !== 3) {
			errorMessage.textContent = "Invalid date format. Please use DD-MM-YYYY.";
			errorMessage.classList.add('error-visible');
			return;
		}
		
		// Convert height from cm to inches (for database)
		var heightValue = $("#height").val();
		if (!heightValue || isNaN(heightValue) || heightValue < 100 || heightValue > 220) {
			errorMessage.textContent = "Please enter a valid height between 100 and 220 cm.";
			errorMessage.classList.add('error-visible');
			return;
		}
		
		var heightInInches = Math.round(parseInt(heightValue) / 2.54);
		
		// Clamp inches to the allowed range (48-96 inches)
		heightInInches = Math.max(48, Math.min(96, heightInInches));
		
		// Debug: Show formatted date in console
		console.log("Formatted date: " + formattedDate);
		
		// Send data to server
		$.post('http://esx_identity/register', JSON.stringify({
			firstname: $("#firstname").val(),
			lastname: $("#lastname").val(),
			dateofbirth: formattedDate,
			sex: $("input[type='radio'][name='sex']:checked").val(),
			height: heightInInches
		}));
	});
});