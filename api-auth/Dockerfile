FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ApiAuth.slnx ./
COPY src/ApiAuth.Domain/ApiAuth.Domain.csproj src/ApiAuth.Domain/
COPY src/ApiAuth.Application/ApiAuth.Application.csproj src/ApiAuth.Application/
COPY src/ApiAuth.Infrastructure/ApiAuth.Infrastructure.csproj src/ApiAuth.Infrastructure/
COPY src/ApiAuth.Api/ApiAuth.Api.csproj src/ApiAuth.Api/
RUN dotnet restore src/ApiAuth.Api/ApiAuth.Api.csproj
COPY src/ ./src/
RUN dotnet publish src/ApiAuth.Api/ApiAuth.Api.csproj -c Release -o /out --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:8080
COPY --from=build /out .
EXPOSE 8080
ENTRYPOINT ["dotnet", "ApiAuth.Api.dll"]
