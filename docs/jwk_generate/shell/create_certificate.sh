#!/usr/bin/env bash
set -e

# Variables
CURRENT_DATE=$(date +"%Y%m%d_%H%M%S")
ERROR_LOG="$CURRENT_DATE"_error.log
CERTIFICATE_PATH=./certificate
PEM_PRIVATE_KEY=./pem/private_key.pem
JWK_PRIVATE_KEY=./jwk/private_key.jwk

echo "Start generating certificate..."

printf "\e[1;34m%s\e[0m\n" "Please enter your client id:"
read CLIENT_ID

if [ -f "$JWK_PRIVATE_KEY" ] && [ -f "$PEM_PRIVATE_KEY" ]; then
    echo "Private Keys exists."
else
    echo "Private Keys does not exist."
    echo "Please generate the private keys first."
    exit 1
fi

trap 'printf "\e[1;31m%s\e[0m\n" "An error occurred while creating '$CERTIFICATE_PATH' directory. Please check the error log: $ERROR_LOG" >&2; exit 1' ERR

if [ -d "$CERTIFICATE_PATH" ]; then
    echo "Certificate directory exists."
else
    echo "Certificate directory does not exist."
    echo "Creating certificate directory..."
    mkdir $CERTIFICATE_PATH 2>>$ERROR_LOG
fi

trap 'printf "\e[1;31m%s\e[0m\n" "An error occurred while generating certificate. Please check the error log: $ERROR_LOG" >&2; exit 1' ERR

echo "Generating certificate pem..."
openssl req -x509 -key "$PEM_PRIVATE_KEY" -subj /CN="$CLIENT_ID" > "$CERTIFICATE_PATH"/certificate.pem 2>>$ERROR_LOG
echo "Certificate pem generated successfully."

echo "Generating certificate jwk..."
CERT=$(sed /-/d "$CERTIFICATE_PATH"/certificate.pem | tr -d \\n)
jq ".+{ \"alg\":\"ES256\",\"use\":\"sig\",\"x5c\":[\"$CERT\"]}" "$JWK_PRIVATE_KEY" > "$CERTIFICATE_PATH"/certificate.jwk 2>>$ERROR_LOG
echo "Certificate jwk generated successfully."

echo "Generating certificate completed successfully."
echo "Check "$CERTIFICATE_PATH"/certificate.jwk"

# Check if the error log file is empty and delete it if it is
if [ -f "$ERROR_LOG" ] && [ ! -s "$ERROR_LOG" ]; then
    rm "$ERROR_LOG"
fi