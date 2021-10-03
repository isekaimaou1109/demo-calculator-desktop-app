const form = document.getElementById('login_form');

form.addEventListener('submit', function (event) {
    event.preventDefault();
    const isSanitized = /[^<>!@$%\/\s]/gm;
    const isStandardPassword = /^[A-Z]{1}(\w+|\d+)[_!]{1}/gm;

    console.log("submitted")

    var username = event.target.elements['username'];
    var password = event.target.elements['password'];
    var _csrf = event.target.elements['_csrf'];

    console.log(username, password, _csrf)

    if (isSanitized.test(username.value) && username.value.length > 5 && password.value.length > 8 && isStandardPassword.test(password.value)) {
        fetch('https://localhost:2337/login', {
            method: 'POST',
            body: {
                username,
                password,
                _csrf
            }
        }).then(response => response.json())
          .then(data => console.log(data))
          .catch(e => console.error(e));
    }
}, true);