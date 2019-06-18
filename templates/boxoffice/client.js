'use strict';

var config = {
    'api': 'api',
    'currency': '{{currency}}',
    'maxNumberOfUnspecifiedSeats': {{maxNumberOfUnspecifiedSeats}},
    'hostName': '{{hostName}}',
    'administrator': {
        'firstname': '{{administrator.firstname}}',
        'lastname': '{{administrator.lastname}}',
        'email': '{{administrator.email}}'
    },
    'boxoffice': {
        'name': '{{name}}',
        'type': 'download', // paper: Hardware tickets. Only a notification is sent and the seats are reserved.
                        // pdf: PDF tickets. Additionally to the notification, a confirmation with PDF tickets is sent to the customer.
                        // printout: Tickets to be printed at the box office. A PDF ticket will be generated but it will not be distributed by email.
                        // download: Tickets to be downloaded at the box office. All PDF tickets will be merged into one PDF for download. They will not be distributed by email.
        'event_id': 3   // The event can be hard-coded here
    },
    'styles': {
        'free': {{styles.free}},
        'freeHover': {{styles.freeHover}},
        'reserved': {{styles.reserved}},
        'reservedbymyself': {{styles.reservedbymyself}}
    }
};

var configModule = angular.module('ticketbox.config', []);

angular.forEach(config, function(key, value) {
    configModule.constant(value, key);
});