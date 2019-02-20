var API_URL = {
    READ: 'http://localhost:8010/user'
};

window.CinemaApplication = {
    load: function (person) {
        $.ajax({
            url: API_URL.READ,
            headers: {
                "Content-Type": "application/json"
            },
            contentType: "application/json",
            method: "GET",
            data: {name:person.name}
        }).done(function (data, textStatus, jqXHR) {
            console.log('success ' + JSON.stringify(data));
            console.log("cookie : "+data.id);
            document.cookie=data.id;
            if(data.password == person.password){
                window.location.href="../html/login.html";
            }else{
                window.location.href="../html/incorrectPassword.html";
            }
        }).fail(function (response) {
            console.log("error");
            console.log(response);
            window.location.href="../html/incorrectEmail.html";
        });
    },

    bindEvents: function() {
        $( ".loginbox" ).submit(function() {
            const person = {
                firstName: $('input[name=firstName]').val(),
                lastName: $('input[name=lastName]').val(),
                password: $('input[name=password]').val(),
                telephoneNumber: $('input[name=telephoneNumber]').val(),
                email: $('input[name=email]').val(),
            };
            CinemaApplication.load(person);
            return false;
        });
    }
};

console.info('loading if user is correct');
CinemaApplication.bindEvents();