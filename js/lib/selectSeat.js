var editId;

// TODO edit API url's
var API_URL = {
    CREATE_RESERVATION: 'http://localhost:8010/reservation',
    READ: 'http://localhost:8010/schedule' //readuri pt toate scheduleurile
};
var movieId;
var hallId;

var schedulesGlobal = []; // variabila globala in care tinem toate scheduleruri - Nu e eficient - normal daca am avea api mai granular ar fi mai eficient si performant
// ar putea fi imbunatit cu api - getAllAvailableMovies, getHallsForMovie(movieId), getScheduleForMovieInHall(movieId,hallId)
//deocamdnata e ok asa - dar poate ramane asta de imbunatatit dupa acreditare :)
window.CinemaReservation = {

    buildScheduleDateOption: function (scheduleToAdd) {
        return `<option value='${scheduleToAdd.id}'> ${scheduleToAdd.movieStartTime} </option>`;

    },

    //am extras functie care returneaza stringul creat pt un option
    buildMovieOption: function (scheduleFromIndex) {
        //pe langa movie title mai adaug si movie id ca si fied data-id = nu va fi visibil la client,
        // dar il vei putea folosi cand faci rezervarea sa iei movie id selectat de user
        return `<option value='${scheduleFromIndex.movieInfo.id}'> ${scheduleFromIndex.movieInfo.title} </option>`;
    },

    buildHallOption: function (scheduleFromIndex) {
        //pe langa movie title mai adaug si hall id ca si fied data-id = nu va fi visibil la client,
        // dar il vei putea folosi cand faci rezervarea sa iei hall id selectat de user
        return `<option value='${scheduleFromIndex.hall.id}'> ${scheduleFromIndex.hall.location} </option>`;

    },

    load: function () {
        $.ajax({
            url: API_URL.READ,
            method: "GET"
        }).done(function (schedules) {
            schedulesGlobal = schedules;

            var hallOption = $("#hallOption");
            var movieOption = $("#movieOption");
            var movieList = [];
            var hallList = [];
            for (i = 0; i < schedules.length; i++) {
                let scheduleFromIndex = schedules[i];//extracted as variable - ca sa o mai pot folosi mai usor
                var alreadyExists = movieList.indexOf(scheduleFromIndex.movieInfo.title);
                if (alreadyExists < 0) {
                    movieOption.html(movieOption.html() + CinemaReservation.buildMovieOption(scheduleFromIndex))
                }
                movieList.push(scheduleFromIndex.movieInfo.title);

                // hall
                var hallAlreadyExists = hallList.indexOf(scheduleFromIndex.hall.location);
                if (hallAlreadyExists < 0) {
                    hallOption.html(hallOption.html() + CinemaReservation.buildHallOption(scheduleFromIndex))
                }
                hallList.push(scheduleFromIndex.hall.location);

                //  scheduleOption.html(scheduleOption.html() + "<option>" + scheduleFromIndex.movieStartTime + "</option>")
                CinemaReservation.bindEventsForOptions();
            }

        });
    },

    getScheduleForMovieInHall: function (schedule) {
        if (schedule.movieInfo.id === movieId && ((hallId > 0 && hallId === schedule.hall.id) || !hallId === "-1")) {
            return true;
        } else {
            return false;
        }
    },

    bindEventsForOptions: function () {
        var hallOption = $("#hallOption");
        var movieOption = $("#movieOption");

        movieOption.change(function () {
            movieId = parseInt(movieOption.val());
            hallId = parseInt(hallOption.val());
            console.log("movieId " + movieId);
            console.log("hallId " + hallId);

            var schedulesForMovieAndHall = []
            for (i = 0; i < schedulesGlobal.length; i++) {
                scheduleForFor = schedulesGlobal[i];
                if (scheduleForFor.movieInfo.id === movieId && ((hallId >= 0 && hallId === scheduleForFor.hall.id) || !hallId === -1)) {
                    schedulesForMovieAndHall.push(scheduleForFor);
                    console.log("scheule found" + scheduleForFor)
                }
            }
            var scheduleOption = $("#scheduleOption");
            scheduleOption.html("<option  value='-1'>Select Schedule</option>");
            for (i = 0; i < schedulesForMovieAndHall.length; i++) {
                scheduleToAdd = schedulesForMovieAndHall[i];
                scheduleOption.html(scheduleOption.html() + CinemaReservation.buildScheduleDateOption(scheduleToAdd));
            }
        });

        hallOption.change(function () {
            console.log("changeHall");
            movieId = parseInt(movieOption.val());
            hallId = parseInt(hallOption.val());

            console.log("movieId " + movieId);
            console.log("hallId " + hallId);

            var  schedulesForMovieAndHall = []
            for (i = 0; i < schedulesGlobal.length; i++) {
                scheduleForFor = schedulesGlobal[i];
                if (scheduleForFor.movieInfo.id === movieId && ((hallId >= 0 && hallId === scheduleForFor.hall.id) || !hallId === -1)) {
                    schedulesForMovieAndHall.push(scheduleForFor);
                    console.log("scheule found" + scheduleForFor)
                }
            }
            var scheduleOption = $("#scheduleOption");
            scheduleOption.html("<option  value='-1'>Select Schedule</option>");
            for (i = 0; i < schedulesForMovieAndHall.length; i++) {
                scheduleToAdd = schedulesForMovieAndHall[i];
                scheduleOption.html(scheduleOption.html() + CinemaReservation.buildScheduleDateOption(scheduleToAdd));
            }
        });
    }
};

$('.cinema-seats .seat').on('click', function () {
    $(this).toggleClass('active');
});


console.info('loading schedule');
CinemaReservation.load();