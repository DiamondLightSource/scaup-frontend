|code_ci| |license|

============== ==============================================================
Source code https://github.com/DiamondLightSource/scaup-frontend
============== ==============================================================

Scaup (frontend)

==========
Configuration
==========

Configuration is done through environment variables:

* :code:`NEXTAUTH_URL`: NextAuth instance URL. Usually the application's path, followed by :code:`/nextauth`
* :code:`NEXTAUTH_SECRET`: Random string used for generating the encrypted NextAuth JWT. Do not use the secret in :code:`.example.env` in production
* :code:`OAUTH_CLIENT_ID`: OIDC client ID
* :code:`OAUTH_CLIENT_SECRET`: OIDC client secret
* :code:`OAUTH_COOKIE_NAME`: Authentication token cookie name
* :code:`OAUTH_DISCOVERY_ENDPOINT`: OIDC discovery endpoint
* :code:`OAUTH_PROFILE_INFO_ENDPOINT`: Microauth's profile endpoint. May be removed in the future if our auth solution provides profile info as well.
* :code:`SERVER_API_URL`: Scaup API URL from the server perspective. Note that relative paths such as `/api` cannot be used, since the user has no concept of relative paths. Paths must be absolute. This can be modified at runtime/deploy time.
* :code:`CONTACT_EMAIL`: Email for application support (like international shipments)
* :code:`USER_GUIDE_URL`: URL for SCAUP user guide
* :code:`NEXT_PUBLIC_API_URL`: SCAUP API URL
* :code:`NEXT_PUBLIC_DEV_CONTACT`: Developer contact email
* :code:`NEXT_PUBLIC_APP_VERSION`: App version
* :code:`PATO_URL`: URL of the PATo instance you want to target for redirects
* :code:`SYNCHWEB_URL`: URL of the SynchWeb instance you want to target for redirects

==========
Building
==========

Building the distribution files:

.. code-block:: bash

    yarn install
    yarn build

============
Testing
============

Unit Tests
------------

- Run :code:`yarn test`

End-to-End Tests
------------

- Create two environment variables, :code:`PLAYWRIGHT_USERNAME` and :code:`PLAYWRIGHT_PASSWORD` containing the username and password you use to authenticate to Scaup.
- Deploy the backend and frontend. Keep in mind that since these are full E2E tests, Expeye/Microauth must also be available.
- Run :code:`yarn e2e`

============
Development
============

To run Next in development mode, run :code:`yarn dev`. If you don't have certificates set up, or if you're using self-signed certificates, Node might throw up errors and block connections. To avoid that, run :code:`NODE_TLS_REJECT_UNAUTHORIZED=0 yarn dev`

.. |code_ci| image:: https://github.com/DiamondLightSource/scaup-frontend/actions/workflows/test.yml/badge.svg
    :target: https://github.com/DiamondLightSource/scaup-frontend/actions/workflows/test.yml
    :alt: Code CI

.. |license| image:: https://img.shields.io/badge/License-Apache%202.0-blue.svg
    :target: https://opensource.org/licenses/Apache-2.0
    :alt: Apache License
