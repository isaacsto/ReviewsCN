document.addEventListener("DOMContentLoaded", function() {
    const searchButton = document.getElementById("searchButton");
    const companyNameInput = document.getElementById("companyNameInput");
    const resultsDiv = document.getElementById("results");

    searchButton.addEventListener("click", async function() {
        const companyName = companyNameInput.value;

        if (!companyName) {
            resultsDiv.innerHTML = "Please enter a company name.";
            return;
        }

        try {
            const response = await fetch("/searchCompany", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ companyName })
            });

            if (response.ok) {
                const data = await response.json();
                displayResults(data);
            } else {
                resultsDiv.innerHTML = "An error occurred while fetching data.";
            }
        } catch (error) {
            console.error(error);
            resultsDiv.innerHTML = "An error occurred while processing the request.";
        }
    });

    function displayResults(data) {
      
        resultsDiv.innerHTML = JSON.stringify(data, null, 2);
    }
});
