|code_ci| |code_cov| |license|

============== ==============================================================
Source code https://gitlab.diamond.ac.uk/lims/ebic-sample-handling/frontend
============== ==============================================================

eBIC sample handling service (frontend)

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
* :code:`NEXT_PUBLIC_API_URL`: Sample Handling API URL
* :code:`NEXT_PUBLIC_DEV_CONTACT`: Developer contact email

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

- Run :code:`yarn test`

============
Development
============

To run Next in development mode, run :code:`yarn dev`. If you don't have certificates set up, or if you're using self-signed certificates, Node might throw up errors and block connections. To avoid that, run :code:`NODE_TLS_REJECT_UNAUTHORIZED=0 yarn dev`

.. |code_ci| image:: https://gitlab.diamond.ac.uk/lims/ebic-sample-handling/frontend/badges/master/pipeline.svg
    :target: https://gitlab.diamond.ac.uk/lims/ebic-sample-handling/frontend/-/pipelines
    :alt: Code CI

.. |code_cov| image:: https://gitlab.diamond.ac.uk/lims/ebic-sample-handling/frontend/badges/master/coverage.svg
    :target: https://gitlab.diamond.ac.uk/lims/ebic-sample-handling/frontend/-/pipelines
    :alt: Code Coverage

.. |license| image:: https://img.shields.io/badge/License-Apache%202.0-blue.svg
    :target: https://opensource.org/licenses/Apache-2.0
    :alt: Apache License
