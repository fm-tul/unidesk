# `api-client` directory

This directory contains the source code for the API client. The API client is
generated and generated files are not checked into the repository. To generate
the API client, run the server with environment variable `GENERATE_MODEL` set to 1.

This will generate

1.  `src/api-client/constants` - contains various constants/enums used by the API client
2.  `src/api-client/` - contains endpoints and models for the API client
