'use strict';

angular.module('ngLocalizedStarterApp.config', [])
    .constant('loginRedirectPath', '/login')
    .constant('FBURL', 'https://crackling-fire-8110.firebaseio.com')

/*********************
 * !!FOR E2E TESTING!!
 *
 * Must enable email/password logins and manually create
 * the test user before the e2e tests will pass
 *
 * user: test@test.com
 * pass: test123
 */
