var API_URL = {
    USER: 'http://localhost:8010/user'
};

var window = new XMLHttpRequest();

window.CinemaApplication = {
    add: function (person) {
        //alert(person);
        $.ajax({
            url: API_URL.USER,
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            data: JSON.stringify(person, null, 5)
        }).done(function (response, data) {
            alert("User Registered");
            console.info('Congratulations! Now you can login' + JSON.stringify(data));
            console.info(response);
            window.location.href = "../html/login.html";
        }).fail(function (response) {
            alert("error");
            console.info('Oups! We got a problem');
            console.info(response);
            window.location.href = "../html/mailTaken.html";
        });
    },

    bindEvents: function () {
        $(".loginbox").submit(function () {
            const person = {
                firstName: $('input[name=firstName]').val(),
                lastName: $('input[name=lastName]').val(),
                password: $('input[name=password]').val(),
                telephoneNumber: $('input[name=telephoneNumber]').val(),
                email: $('input[name=email]').val(),
            };
            console.log('submitting data');
            console.log(person);
            CinemaApplication.add(person);
            return false;
        });
    }
};

console.info('loading user');
CinemaApplication.bindEvents();