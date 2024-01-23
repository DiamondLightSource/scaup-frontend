|code_ci| |code_cov| |license|

============== ==============================================================
Source code https://gitlab.diamond.ac.uk/lims/ebic-sample-handling/frontend
============== ==============================================================

eBIC sample handling service (frontend)

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
