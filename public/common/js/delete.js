$(document).ready(function () {

    deleteForm.onsubmit = async (event) => {
        event.preventDefault();
        const appID = document.getElementById('appID').value;

        console.log("Form submitted with App ID: " + appID);

        try {
            const response = await fetch(deleteForm.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ appID }), // Send appID as JSON
            });

            if (response.ok) {
                // Handle success (e.g., reload the page or update the UI dynamically)
                window.location.reload(); // Reload the page to show updated data
            } else {
                const error = await response.text();
                console.error("Error:", error);
                alert("Failed to delete the record: " + error);
            }
        } catch (err) {
            console.error("Error during the fetch:", err);
            alert("An error occurred. Please try again.");
        }
    };

});