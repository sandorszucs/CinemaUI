var editId;

// TODO edit API url's
var API_URL = {
    CREATE_RESERVATION: 'http://localhost:8010/reservation',
    READ: 'http://localhost:8010/schedule' //readuri pt toate scheduleurile
};
var movieId;
var hallId;
var reservations = [];
var schedulesGlobal = [];
window.CinemaReservation = {

    buildScheduleDateOption: function (scheduleToAdd) {
        return `<option value='${scheduleToAdd.id}'> ${scheduleToAdd.movieStartTime} </option>`;
    },

    buildMovieOption: function (scheduleFromIndex) {
        return `<option value='${scheduleFromIndex.movieInfo.id}'> ${scheduleFromIndex.movieInfo.title} </option>`;
    },

    buildHallOption: function (scheduleFromIndex) {
        return `<option value='${scheduleFromIndex.hall.id}'> ${scheduleFromIndex.hall.location} </option>`;

    },

    refreshScheduled: function () {
        $.ajax({
            url: API_URL.READ,
            method: "GET"
        }).done(function (schedules) {
            schedulesGlobal = schedules;
            clearSeats()
            loadSeats();
            displaySeats();
        })
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
            }
            CinemaReservation.bindEventsForOptions();

            console.log(hallOption)
            console.log(movieOption)
            console.log(movieList)
            console.log(hallList)
            console.log(schedules)
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
            console.log("change movie");

            movieId = parseInt(movieOption.val());
            hallId = parseInt(hallOption.val());
            console.log("movieId " + movieId);
            console.log("hallId " + hallId);
            $("div.seatCharts-row");
            var schedulesForMovieAndHall = []
            for (i = 0; i < schedulesGlobal.length; i++) {
                scheduleForFor = schedulesGlobal[i];
                if (scheduleForFor.movieInfo.id === movieId && ((hallId >= 0 && hallId === scheduleForFor.hall.id) || !hallId === -1)) {
                    schedulesForMovieAndHall.push(scheduleForFor);
                    console.log("schedule found" + scheduleForFor)
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
            scheduleOption.change(function () {
                console.log("change schedule");
                clearSeats();
                loadSeats();
                displaySeats();
            })
        });
    }
};


var price = 10; //price
function displaySeats() {
    var $cart = $('#selected-seats'), //Sitting Area
        $counter = $('#counter'), //Votes
        $total = $('#total'); //Total money

    var sc = $('#seat-map').seatCharts({
        map: [  //Seating chart
            'aaaaaaaa',
            'aaaaaaaa',
            // '__________',
            'aaaaaaaa',
            'aaaaaaaa',
            'aaaaaaaa',
        ],
        naming: {
            top: false,
            getLabel: function (character, row, column) {
                return column;
            }
        },
        legend: { //Definition legend
            node: $('#legend'),
            items: [
                ['a', 'available', 'Option'],
                ['a', 'unavailable', 'Sold']
            ]
        },
        click: function () { //Click event
            console.log("click");
            var isSelected = $("div#" + this.settings.id + ".selected").length > 0;
            if (this.statusValue[0] == 'available' && !isSelected) { //optional seat
                $("div#" + this.settings.id).addClass("selected");
                $('<li>R' + (this.settings.row + 1) + ' S' + this.settings.label + '</li>')
                    .attr('id', 'cart-item-' + this.settings.id)
                    .data('seatId', this.settings.id)
                    .appendTo($cart);
                var selectedCount = $("div#seat-map div.selected").length;
                $counter.text(selectedCount);
                $total.text(selectedCount * price);
                this.statusValue[1] = "selected";
                return 'selected';
            } else if (this.statusValue[0] == 'available' && isSelected) { //Checked
                //Update Number
                $("div#" + this.settings.id).removeClass("selected");

                var selectedCount = $("div#seat-map div.selected").length;
                $counter.text(selectedCount);
                $total.text(selectedCount * price);

                //Delete reservation
                $('#cart-item-' + this.settings.id).remove();
                //optional
                this.statusValue[1] = null;
                return 'available';
            } else if (this.statusValue[0] == 'unavailable') { //sold
                return 'unavailable';
            } else {
                return this.style();
            }
        }
    });
    // sc.get(['']).status('unavailable');

}

$(document).ready(function () {
    $('#res-btn').click(function () {

        var selectedSeats = new Array();
        $.each($(".seatCharts-seat.seatCharts-cell.selected"), function () {
            selectedSeats.push($(this).attr("id"));
        });
        console.log(selectedSeats);

        var scheduleOption = $("#scheduleOption");
        var scheduleId = parseInt(scheduleOption.val());

        var postBodyToSaveReservation = {
            "scheduleId": scheduleId,
            "reservedSeat": selectedSeats,
            "userId": 1
        }
        console.log("to post " + postBodyToSaveReservation);

        $.ajax({
            url: API_URL.CREATE_RESERVATION,
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            data: JSON.stringify(postBodyToSaveReservation)

        }).success(function () {
            $("<p>Reservation created</p>").insertAfter('#res-btn');
            CinemaReservation.refreshScheduled();
            clearSeats();
            loadSeats();
            displaySeats();

        });
    });
});

//sum total money
function recalculateTotal(sc) {
    var total = 0;
    sc.find('selected').each(function () {
        total += price;
    });

    return total;
}


function clearSeats() {
    $("div#seat-map .seatCharts-row").remove();
    $("div#seat-map").removeData("seatCharts");
}

function clearLegend() {
    $("div#legend .seatCharts-legendList").remove();
}


function loadSeats() {
    var t = jQuery;
    t.fn.seatCharts = function (s) {
        if (this.data("seatCharts")) return this.data("seatCharts");
        var e = this, a = {}, n = [], i = {
            animate: !1, naming: {
                top: !0, left: !0, getId: function (t, s, e) {
                    return s + "_" + e
                }, getLabel: function (t, s, e) {
                    return e
                }
            }, legend: {node: null, items: []}, click: function () {
                return "available" == this.status() ? "selected" : "selected" == this.status() ? "available" : this.style()
            }
            ,
            focus: function () {
                return "available" == this.status() ? "focused" : this.style()
            }, blur: function () {
                return this.status()
            },
            seats: {}
        }, r = function (s, e) {
            var objectWIthStatus = this;
            return function (n) {

                var i = this;
                var status = computeStatusForSeat(i, n);
                i.settings = t.extend({
                    status: status,
                    style: status,
                    data: e.seats[n.character] || {}
                }, n), i.settings.$node = t("<div></div>"), i.settings.$node.attr({
                    id: i.settings.id,
                    role: "checkbox",
                    "aria-checked": !1,
                    focusable: !0,
                    tabIndex: -1
                }).text(i.settings.label).addClass(["seatCharts-seat", "seatCharts-cell", status].concat(i.settings.classes,
                    "undefined" == typeof e.seats[i.settings.character] ? [] : e.seats[i.settings.character].classes).join(" ")), i.data = function () {
                    return i.settings.data
                }, i["char"] = function () {
                    return i.settings.character
                }, i.node = function () {
                    return i.settings.$node
                }, i.style = function () {
                    return 1 == arguments.length ? function (t) {
                        var s = i.settings.style;
                        return t == s ? s : (i.settings.status = "focused" != t ?
                            t : i.settings.status, i.settings.$node.attr("aria-checked", "selected" == t),
                            e.animate ? i.settings.$node.switchClass(s, t, 200) : i.settings.$node.addClass(t), i.settings.style = t)
                    }(arguments[0]) : i.settings.style
                }, i.status = function () {
                    computeStatusForSeat(i, n);
                }, function (n, r, c) {
                    t.each(["click", "focus", "blur"], function (t, u) {
                        i[u] = function () {
                            return "focus" == u && (void 0 !== s.attr("aria-activedescendant") &&
                            a[s.attr("aria-activedescendant")].blur(), s.attr("aria-activedescendant", c.settings.id),
                                c.node().focus()),

                                i.style("function" == typeof n[r][u] ? n[r][u].apply(c) : e[u].apply(c))
                        }
                    })
                }(e.seats, i.settings.character, i), i.node().on("click", i.click).on("mouseenter", i.focus).on("mouseleave", i.blur).on("keydown", function (t, e) {
                    return function (n) {
                        var i;
                        switch (n.which) {
                            case 32:
                                n.preventDefault(), t.click();
                                break;
                            case 40:
                            case 38:
                                if (n.preventDefault(), i = function r(t, s, a) {
                                    var c;
                                    return c = t.index(a) || 38 != n.which ? t.index(a) == t.length - 1 && 40 == n.which ? t.first() : t.eq(t.index(a) +
                                        (38 == n.which ? -1 : 1)) : t.last(), i = c.find(".seatCharts-seat,.seatCharts-space").eq(s.index(e)),
                                        i.hasClass("seatCharts-space") ? r(t, s, c) : i
                                }(e.parents(".seatCharts-container").find(".seatCharts-row:not(.seatCharts-header)"),
                                    e.parents(".seatCharts-row:first").find(".seatCharts-seat,.seatCharts-space"),
                                    e.parents(".seatCharts-row:not(.seatCharts-header)")), !i.length) return;
                                t.blur(), a[i.attr("id")].focus(), i.focus(), s.attr("aria-activedescendant", i.attr("id"));
                                break;
                            case 37:
                            case 39:
                                if (n.preventDefault(), i = function (t) {
                                    return t.index(e) || 37 != n.which ? t.index(e) == t.length - 1 && 39 == n.which ? t.first() : t.eq(t.index(e)
                                        + (37 == n.which ? -1 : 1)) : t.last()
                                }(e.parents(".seatCharts-container:first").find(".seatCharts-seat:not(.seatCharts-space)")), !i.length) return;
                                t.blur(), a[i.attr("id")].focus(), i.focus(), s.attr("aria-activedescendant", i.attr("id"))
                        }
                    }
                }(i, i.node()))
            }
        }(e, i);
        if (e.addClass("seatCharts-container"), t.extend(!0, i, s), i.naming.rows = i.naming.rows || function (t) {
            for (var s = [], e = 1; t >= e; e++) s.push(e);
            return s
        }(i.map.length), i.naming.columns = i.naming.columns || function (t) {
            for (var s = [], e = 1; t >= e; e++) s.push(e);
            return s
        }(i.map[0].split("").length), i.naming.top) {
            var c = t("<div></div>").addClass("seatCharts-row seatCharts-header");
            i.naming.left && c.append(t("<div></div>").addClass("seatCharts-cell")), t.each(i.naming.columns, function (s, e) {
                c.append(t("<div></div>").addClass("seatCharts-cell").text(e))
            })
        }
        return e.append(c), t.each(i.map, function (s, c) {
            var u = t("<div></div>").addClass("seatCharts-row");
            i.naming.left && u.append(t("<div></div>").addClass("seatCharts-cell seatCharts-space").text(i.naming.rows[s])),
                t.each(c.match(/[a-z_]{1}(\[[0-9a-z_]{0,}(,[0-9a-z_ ]+)?\])?/gi), function (e, c) {
                var h = c.match(/([a-z_]{1})(\[([0-9a-z_ ,]+)\])?/i), d = h[1],
                    o = "undefined" != typeof h[3] ? h[3].split(",") : [], l = o.length ? o[0] : null,
                    f = 2 === o.length ? o[1] : null;
                u.append("_" != d ? function (t) {
                    i.seats[d] = d in i.seats ? i.seats[d] : {};
                    var c = l ? l : t.getId(d, t.rows[s], t.columns[e]);
                    return a[c] = new r({
                        id: c,
                        label: f ? f : t.getLabel(d, t.rows[s], t.columns[e]),
                        row: s,
                        column: e,
                        character: d
                    }), n.push(c), a[c].node()
                }(i.naming) : t("<div></div>").addClass("seatCharts-cell seatCharts-space"))
            }), e.append(u)
        }), i.legend.items.length ? function (s) {
            if ($("div#legend .seatCharts-legendList").length > 0)
                return;
            var a = (s.node || t("<div></div>").insertAfter(e)).addClass("seatCharts-legend"),
                n = t("<ul></ul>").addClass("seatCharts-legendList").appendTo(a);
            return t.each(s.items, function (s, e) {
                n.append(t("<li></li>").addClass("seatCharts-legendItem").append(t("<div></div>").addClass(["seatCharts-seat",
                    "seatCharts-cell", e[1]].concat(i.classes, "undefined" == typeof i.seats[e[0]] ? []
                    : i.seats[e[0]].classes).join(" "))).append(t("<span></span>").addClass("seatCharts-legendDescription").text(e[2])))
            }), a
        }(i.legend) : null, e.attr({tabIndex: 0}), e.focus(function () {
            e.attr("aria-activedescendant") && a[e.attr("aria-activedescendant")].blur(), e.find(".seatCharts-seat:not(.seatCharts-space):first").focus(), a[n[0]].focus()
        }), e.data("seatCharts", {
            seats: a, seatIds: n, status: function () {
                var s = this;
                return 1 == arguments.length ? s.seats[arguments[0]].status() : function (e, a) {
                    return "string" == typeof e ? s.seats[e].status(a) : function () {
                        t.each(e, function (t, e) {
                            s.seats[e].status(a)
                        })
                    }()
                }(arguments[0], arguments[1])
            }, each: function (t) {
                var s = this;
                for (var e in s.seats) if (!1 === t.call(s.seats[e], e)) return e;
                return !0
            }, node: function () {
                var s = this;
                return t("#" + s.seatIds.join(",#"))
            }, find: function (t) {
                var s = this, e = s.set();
                return t instanceof RegExp ? function () {
                    return s.each(function (s) {
                        s.match(t) && e.push(s, this)
                    }), e
                }() : 1 == t.length ? function (t) {
                    return s.each(function () {
                        this["char"]() == t && e.push(this.settings.id, this)
                    }), e
                }(t) : function () {
                    return t.indexOf(".") > -1 ? function () {
                        var a = t.split(".");
                        return s.each(function (t) {
                            this["char"]() == a[0] && this.status() == a[1] && e.push(this.settings.id, this)
                        }), e
                    }() : function () {
                        return s.each(function () {
                            this.status() == t && e.push(this.settings.id, this)
                        }), e
                    }()
                }()
            }, set: function u() {
                var s = this;
                return {
                    seats: [], seatIds: [], length: 0, status: function () {
                        var s = arguments, e = this;
                        return 1 == this.length && 0 == s.length ? this.seats[0].status() : function () {
                            t.each(e.seats, function () {
                                this.status.apply(this, s)
                            })
                        }()
                    }, node: function () {
                        return s.node.call(this)
                    }, each: function () {
                        return s.each.call(this, arguments[0])
                    }, get: function () {
                        return s.get.call(this, arguments[0])
                    }, find: function () {
                        return s.find.call(this, arguments[0])
                    }, set: function () {
                        return u.call(s)
                    }, push: function (t, s) {
                        this.seats.push(s), this.seatIds.push(t), ++this.length
                    }
                }
            }, get: function (s) {
                var e = this;
                return "string" == typeof s ? e.seats[s] : function () {
                    var a = e.set();
                    return t.each(s, function (t, s) {
                        "object" == typeof e.seats[s] && a.push(s, e.seats[s])
                    }), a
                }()
            }
        }), e.data("seatCharts")
    }
}

(jQuery);

function computeStatusForSeat(i, seat) {
    //get selected schedule
    var scheduleOption = $("#scheduleOption");
    var scheduleId = parseInt(scheduleOption.val());
    if (scheduleId < 0) {
        return "unavailable";
    }
    i.statusValue = [];
    var selectedSchedule = schedulesGlobal.filter(schedule => schedule.id === scheduleId)[0];
    var isReservered = selectedSchedule.reservedSeats.filter(reservedSeat => (reservedSeat.seat.row + "_" + reservedSeat.seat.seatNumber) === seat.id).length > 0;
    if (!isReservered) {
        i.statusValue[0] = "available";
        return "available";
    } else {
        i.statusValue[0] = "unavailable";
        return "unavailable";
    }
}

console.info('loading schedule');
CinemaReservation.load();