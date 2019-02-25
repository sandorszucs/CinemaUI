var API_URL = {
    READ: 'http://localhost:8010/login'
};

window.CinemaApplication = {
    load: function (person) {
        console.log('person', person);
        $.ajax({
            url: API_URL.READ,
            headers: {
                "Content-Type": "application/json"
            },
            contentType: "application/json",
            method: "POST",
            data: JSON.stringify(person),
        }).done(function (data, textStatus, jqXHR) {
           if (data == "") window.location.href="../html/incorrectEmail.html";
           else window.location.href="../html/whatson.html";
        }).fail(function (response) {
            console.log("error");
            console.log(response);
            window.location.href="../html/incorrectEmail.html";
        });
    },

    bindEvents: function() {
        $( ".loginbox" ).submit(function() {
            const person = {
                email: $('input[name=email]').val(),
                password: $('input[name=password]').val(),
            };
            CinemaApplication.load(person);
            return false;
        });
    }
};

console.info('loading if user is correct');
CinemaApplication.bindEvents();