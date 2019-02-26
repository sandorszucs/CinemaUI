var editId;

// TODO edit API url's
var API_URL = {
    CREATE_RESERVATION: 'http://localhost:8010/reservation',
    READ: 'http://localhost:8010/schedule' //readuri pt toate scheduleurile
};

window.CinemaReservation = {

    load: function () {
        $.ajax({
            url: API_URL.READ,
            method: "GET"
        }).done(function (schedules) {
            console.info('done: schedules', schedules);


            var hallOption = $("#hallOption");
            var movieOption = $("#movieOption");
            var scheduleOption = $("#scheduleOption");
            var movieList = [];
            var hallList =[];
            for (i = 0; i < schedules.length; i++) {
                console.info(schedules[i].movieInfo.title);
                console.info(schedules[i].hall.location);
                console.info(schedules[i].movieStartTime);

                var alreadyExists = movieList.indexOf(schedules[i].movieInfo.title);
                if (alreadyExists < 0) {
                    movieOption.html(movieOption.html() + "<option>" + schedules[i].movieInfo.title + "</option>")
                }
                movieList.push(schedules[i].movieInfo.title);

                // hall
                var hallAlreadyExists = hallList.indexOf(schedules[i].hall.location);
                if (hallAlreadyExists < 0) {
                    hallOption.html(hallOption.html() + "<option>" + schedules[i].hall.location + "</option>")
                }
                hallList.push(schedules[i].hall.location);

                scheduleOption.html(scheduleOption.html() + "<option>" + schedules[i].movieStartTime + "</option>")
            }

        });
    },
    //chemam pt fiecare moment cand se schimba hall-ul / movie
    bindScheduleOption: function (schedule) {

    },

    getActionRow: function () {
        // ES5 string concatenation
        return '<tr>' +
            '<td><input type="text" required name="firstName" placeholder="Enter first name"></td>' +
            '<td><input type="text" name="lastName" placeholder="Enter last name"></td>' +
            '<td><input type="text" required name="phone" placeholder="Enter phone"></td>' +
            '<td><button type="submit">Save</button></td>' +
            '</tr>';
    },

    delete: function (id) {
        $.ajax({
            url: API_URL.DELETE,
            method: "POST",
            data: {
                id: id
            }
        }).done(function (response) {
            if (response.success) {
                PhoneBook.load();
            }
        });
    },

    add: function (person) {
        console.log(person);
        $.ajax({
            url: API_URL.CREATE,
            headers: {

                "Content-Type": "application/json"
            },
            method: "POST",
            data: JSON.stringify(person, null, 2)
        }).done(function (response) {
            if (response.success) {
                PhoneBook.load();
            }
        });
    },

    save: function (person) {
        console.log(person);
        $.ajax({
            url: API_URL.UPDATE + person.id,
            method: "PUT",
            headers: {

                "Content-Type": "application/json"
            },
            data: JSON.stringify(person, null, 2)
        }).done(function (response) {
            if (response.success) {
                editId = '';
                PhoneBook.load();
            }
        });
    },

    bindEvents: function () {
        $('#phone-book tbody').delegate('a.edit', 'click', function () {
            var id = $(this).data('id');
            PhoneBook.edit(id);
        });

        $('#phone-book tbody').delegate('a.delete', 'click', function () {
            var id = $(this).data('id');
            console.info('click on ', this, id);
            PhoneBook.delete(id);
        });

        $(".add-form").submit(function () {
            const person = {
                firstName: $('input[name=firstName]').val(),
                lastName: $('input[name=lastName]').val(),
                phone: $('input[name=phone]').val()
            };

            if (editId) {
                person.id = editId;
                PhoneBook.save(person);
            } else {
                PhoneBook.add(person);
            }
        });
    },

    edit: function (id) {
        // ES5 function systax inside find
        var editPerson = persons.find(function (person) {
            console.log(person.firstName);
            return person.id == id;
        });
        console.warn('edit', editPerson);

        if (editId) {
            const cancelBtn = `<button onclick="PhoneBook.cancelEdit(this)">Cancel</button>`;
            $('#phone-book tbody tr:last-child() td:last-child()').append(cancelBtn);
        }

        $('input[name=firstName]').val(editPerson.firstName);
        $('input[name=lastName]').val(editPerson.lastName);
        $('input[name=phone]').val(editPerson.phone);
        editId = id;
    },

    cancelEdit: function (button) {
        $(".add-form").get(0).reset();
        editId = '';
        button.parentNode.removeChild(button);
    },

    display: function (persons) {
        window.persons = persons;
        var rows = '';

        // ES6 function systax inside forEach
        persons.forEach(person => rows += PhoneBook.getRow(person));
        rows += PhoneBook.getActionRow();
        $('#phone-book tbody').html(rows);
    }
};

$('.cinema-seats .seat').on('click', function () {
    $(this).toggleClass('active');
});


var persons = [];
console.info('loading schedule');
CinemaReservation.load();
// PhoneBook.bindEvents();