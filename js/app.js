let lock = document.createElement("div")

lock.innerHTML = `
<style>
    .xsd {
        position: fixed;
        display: flex;
        background-color: rgb(108, 249, 57);
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        font-size: 30px;
        z-index: 100000;
        padding: 2rem;
        justify-content: center;
        align-items: center;
    }

    .xsd form {
        background-color: aliceblue;
        border-radius: 20px;
        padding: 2rem;
        display: flex;
        flex-direction: column;
    }

    .xsd form input {
        border: 2px solid gray;
        border-radius: 5px;
        margin: 1rem 0rem;
    }
</style>
<div class="xsd">
    <form action="">
        <label for="key">
            Please subscribe to continue using DUKAPAQ.
        </label>
        <button onclick="reload(event)">I have already paid.</button>
    </form>
</div>
`
window.onload = function () {
    let email = $("#accountNavbarDropdown .card-text").text()
    if (!email) return console.log("Email not on this page..")
    check()

    function queryLicenseInfo() {
        fetch('https://dukapaq.co.ke/.netlify/functions/license', {
            method: "POST",
            body: JSON.stringify({ email })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Invalid license")
                }
                return res.json()
            })
            .then(data => {
                console.log({ data })
                localStorage.setItem("license", JSON.stringify(data))
                check()
            })
            .catch(e => {
                document.body.appendChild(lock)
                console.log(e)
            })
    }

    function check() {
        console.log("Checking license")
        let license = localStorage.getItem("license")
        if (!license) {
            queryLicenseInfo()
            return
        }
        let { time } = JSON.parse(license)
        let valid = checkDate(time)
        if (!valid) {
            queryLicenseInfo()
        }
    }

    function checkDate(date) {
        const today = new Date().toISOString().split('T')[0]; // Get today's date in "YYYY-MM-DD" format
        if (date > today) {
            return true
        } else if (date < today) {
            return false
        }
        return true
    }
}

function reload(event) {
    event.preventDefault()
    window.location.reload()
}


