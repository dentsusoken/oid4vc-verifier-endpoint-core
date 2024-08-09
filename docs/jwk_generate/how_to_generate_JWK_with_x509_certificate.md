# Generate JWK with X.509 Certificate

## Prepare

**Skip Prepare Section When you use Dev Container.**

Before you begin, ensure you have installed the following required software:

- [OpenSSL](https://www.openssl.org/source/)
- [jq](https://stedolan.github.io/jq/download/)
- [eckles](https://www.npmjs.com/package/eckles)

You can install these with following commands:

```shell
# Linux
sudo apt-get update
sudo apt-get install openssl jq
npm install -g eckles
```

```shell
# Mac
brew install openssl jq
npm install -g eckles
```

Confirm your openssl is not LibreSSL with a following comand:

```shell
openssl version -a
```

result:

```shell
OpenSSL 1.1.1g  21 Apr 2020 # Correct

# or

LibreSSL 2.6.5 # Incorrect
```

## Generate JWK with Shell Script

1. Run following command:

    ```sh
    bash run_all.sh
    ```

    or

    ```sh
    zsh run_all.sh
    ```
    ※Input your client id when you asked "Please enter your client id".

## Generate JWK manually with commands

1. Generate Private Key with a following command:

    ```sh
    openssl genpkey -algorithm EC -pkeyopt ec_paramgen_curve:P-256 > private_key.pem
    ```

2. Create X.509 Certificate with a following command:

    ```sh
    openssl req -x509 -key private_key.pem -subj /CN=$CLIENT_ID* -days 1000 > certificate.pem
    ```

    *Change your own client id.

3. Convert Private Key format from PEM to JWK with a following command:

    ```sh
    eckles private_key.pem > private_key.jwk
    ```

4. Incorporate the X.509 certificate into the `x5c` attribute of the JWK and add `alg` and `use` attributes with following commands:

    ```sh
    CERT=$(sed /-/d certificate.pem | tr -d \\n)
    jq ".+{\"alg\":\"ES256\",\"use\":\"sig\",\"x5c\":[\"$CERT\"]}" private_key.jwk > pub+cert.jwk
    ```
