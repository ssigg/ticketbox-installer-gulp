'use strict';

var config = {
    'api': 'api',
    'currency': '{{currency}}',
    'styles': {
        'free': {{styles.free}},
        'ordered': {{styles.ordered}},
        'sold': {{styles.sold}}
    }
};

var configModule = angular.module('ticketbox.config', []);

angular.forEach(config, function(key, value) {
    configModule.constant(value, key);
});