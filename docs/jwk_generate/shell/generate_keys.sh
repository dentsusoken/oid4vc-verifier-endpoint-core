#!/usr/bin/env bash
set -e

# Variables
CURRENT_DATE=$(date +"%Y%m%d_%H%M%S")
ERROR_LOG="$CURRENT_DATE"_error.log
PEM_PATH=./pem
JWK_PATH=./jwk

echo "Start generating keys..."

trap 'printf "\e[1;31mAn error occurred while creating '$PEM_PATH' directory. Please check the error log: $ERROR_LOG\e[0m\n" >&2; exit 1' ERR

if [ -d "$PEM_PATH" ]; then
    echo "PEM directory exists."
else
    echo "PEM directory does not exist."
    echo "Creating PEM directory..."
    mkdir $PEM_PATH 2>>$ERROR_LOG
fi


trap 'printf "\e[1;31mAn error occurred while creating '$JWK_PATH' directory. Please check the error log: $ERROR_LOG\e[0m\n" >&2; exit 1' ERR

if [ -d "$JWK_PATH" ]; then
    echo "JWK directory exists."
else
    echo "JWK directory does not exist."
    echo "Creating JWK directory..."
    mkdir $JWK_PATH 2>>$ERROR_LOG
fi


trap 'printf "\e[1;31mAn error occurred while generating private key pem. Please check the error log: $ERROR_LOG\e[0m\n" >&2; exit 1' ERR

echo "Generating private key pem..."
openssl genpkey -algorithm EC -pkeyopt ec_paramgen_curve:P-256 > "$PEM_PATH"/private_key.pem 2>>$ERROR_LOG
echo "Private Key Pem generated successfully."

trap 'printf "\e[1;31mAn error occurred while generating public key pem. Please check the error log: $ERROR_LOG\e[0m\n" >&2; exit 1' ERR

echo "Generating Public Key Pem..."
openssl pkey -pubout -in "$PEM_PATH"/private_key.pem > "$PEM_PATH"/public_key.pem 2>>$ERROR_LOG
echo "Public Key generated successfully."

trap 'printf "\e[1;31mAn error occurred while generating private key jwk. Please check the error log: $ERROR_LOG\e[0m\n" >&2; exit 1' ERR
echo "Generating private key jwk..."
eckles "$PEM_PATH"/private_key.pem > "$JWK_PATH"/private_key.jwk 2>>$ERROR_LOG
echo "Private Key Jwk generated successfully."

trap 'printf "\e[1;31mAn error occurred while generating public key jwk. Please check the error log: $ERROR_LOG\e[0m\n" >&2; exit 1' ERR
echo "Generating public key jwk..."
eckles "$PEM_PATH"/public_key.pem > "$JWK_PATH"/public_key.jwk 2>>$ERROR_LOG
echo "Public Key Jwk generated successfully."

echo "Generating keys completed successfully."

# Check if the error log file is empty and delete it if it is
if [ -f "$ERROR_LOG" ] && [ ! -s "$ERROR_LOG" ]; then
    rm "$ERROR_LOG"
fi