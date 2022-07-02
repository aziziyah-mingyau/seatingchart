(function formHandler() {
    const webAppUrl = "https://script.google.com/macros/s/AKfycbwnCyWBzJTlivtXEoSan-dd5SwsKWUByiybSQLR2nuNhzfWbbpsbmQ1gGICBG2WU8NIqg/exec";
    const form = document.getElementById("form");
    const formResult = document.getElementById("form_result");
    const formResultContainer = document.getElementById("form_result_container");
    const submitButton = form.querySelector("button");
    const formLoading = document.getElementById("form_loading");
    const formErrors = document.getElementById("form_errors");
    form.onsubmit = async function (e) {
        e.preventDefault();
        submitForm();
        return false;
    };

    const submitForm = async function () {
        formLoading.style.display = "block";
        formErrors.style.display = "none";
        formResultContainer.style.display = "none";
        submitButton.disabled = true;
        let phone = form.phone.value;
        if (location.hash) {
            phone = location.hash.substring(1);
        }
        try {
            const response = await fetch(webAppUrl + "?" + new URLSearchParams({
                phone: phone
            }));
            
            var responseBody = await response.json();
            console.log(response, responseBody);
            if (responseBody.success) {
                if (responseBody.found) {
                    console.log("success");
                    const tables = {};
                    for (let seat of responseBody.data) {
                        if (tables[seat.TableNumber]) {
                            tables[seat.TableNumber].push(seat);
                        } else {
                            tables[seat.TableNumber] = [seat];
                        }
                    }
                    let html = [];
                    for (let table in tables) {
                        html.push("<h1>Table " + table + "</h1>");
                        for (let seat of tables[table]) {
                            html.push("<p>" + seat.Name + "</p>");
                        }
                    }
                    formResult.innerHTML = html.join("");
                    formResultContainer.style.display = "block";
                    //form.style.display = "none";
                } else {
                    formErrors.innerHTML = "Unable to find phone number. Please enter the phone number used for RSVP.";
                    formErrors.style.display = "block";
                }
            } else {
                throw new Error(responseBody.error);
            }
        } catch (e) {
            alert("Oops! You have encountered a network error. Please retry again over a stable internet connection.");
            console.log("error", e);
        }
        formLoading.style.display = "none";
        submitButton.disabled = false;
    };

    if (location.hash) {
        form.style.display = "none";
        submitForm();
    }
})();
