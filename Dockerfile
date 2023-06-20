FROM dotnet-node AS build-env

# process arguments
ARG UNIDESK_VERSION=0.0.0
ENV UNIDESK_VERSION=$UNIDESK_VERSION \
    VITE_UNIDESK_VERSION=$UNIDESK_VERSION

WORKDIR /App

# Copy everything
COPY unidesk ./
COPY cfg/appsettings.secret.json ./src/Unidesk/Unidesk/appsettings.secret.json
COPY cfg/appsettings.secret.Dev.json ./src/Unidesk/Unidesk/appsettings.secret.Dev.json
COPY cfg/appsettings.secret.Test.json ./src/Unidesk/Unidesk/appsettings.secret.Test.json
COPY cfg/appsettings.secret.Prod.json ./src/Unidesk/Unidesk/appsettings.secret.Prod.json

# Restore as distinct layers
RUN cd src/Unidesk/Unidesk \
    && dotnet restore \
    && dotnet tool restore \
    && dotnet build -c Release \
    && GENERATE_MODEL=1 dotnet tool run swagger tofile --output ../Unidesk.Client/swagger.json  ./bin/Release/net7.0/Unidesk.dll v1 \
    && cd /App/src/Unidesk/Unidesk.Client \
    && yarn install \
    && yarn run generate

RUN apt-get update && apt-get install -y libfontconfig1

# Build and publish a release
RUN cd src/Unidesk/Unidesk && dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:7.0
ARG UNIDESK_VERSION=0.0.0
ENV UNIDESK_VERSION=$UNIDESK_VERSION \
    VITE_UNIDESK_VERSION=$UNIDESK_VERSION

WORKDIR /App
COPY --from=build-env /App/src/Unidesk/Unidesk/out ./
ENTRYPOINT ["dotnet", "Unidesk.dll"]


# docker build -t foo .
# docker run --rm -ti -e UNIDESK_ENVIRONMENT=Dev -p80:80 -p443:443 -e ASPNETCORE_URLS="https://+;http://+" -e ASPNETCORE_Kestrel__Certificates__Default__Path=/keys/temata.fm.tul.cz.pfx -v $(pwd)/keys:/keys/ foo