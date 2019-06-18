'use strict';

var config = {
    'api': 'api',
    'currency': '{{currency}}',
    'canCustomerPurchase': {{canCustomerPurchase}},
    'maxNumberOfUnspecifiedSeats': {{maxNumberOfUnspecifiedSeats}},
    'hostName': '{{hostName}}',
    'administrator': {
        'firstname': '{{administrator.firstname}}',
        'lastname': '{{administrator.lastname}}',
        'email': '{{administrator.email}}'
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