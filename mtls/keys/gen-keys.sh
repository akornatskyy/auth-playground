#/bin/sh

cd $(dirname "$0")

# Create a certificate authority (CA) that both the client and server trust.
# The CA is a private key (ca.key) and public key (wrapped up in
# a self-signed X.509 certificate) in the PEM format.

openssl req -x509 -newkey rsa:2048 -nodes -days 365 \
	-subj "/CN=My CA/O=mTLS auth playground" \
	-keyout ca.key -out ca.crt

# Create the server’s key and certificate.
# /CN=localhost indicates that this certificate can be trusted for
# the DNS name localhost.

openssl genrsa -out server.key 2048
# Certificate Signing Request (CSR) with the Common Name (CN) localhost
openssl req -new -key server.key -subj '/CN=localhost' -out server.csr
# Sign certificate
openssl x509 -req -days 365 -in server.csr \
	-CA ca.crt -CAkey ca.key -CAcreateserial -CAserial ca.srl \
	-out server.crt
rm server.csr

openssl genrsa -out client.key 2048
# Certificate Signing Request (CSR) with the Common Name (CN) my-client
openssl req -new -key client.key -subj '/CN=my-client' -out client.csr
# Sign certificate
openssl x509 -req -days 365 -in client.csr \
	-CA ca.crt -CAkey ca.key -CAcreateserial -CAserial ca.srl \
	-out client.crt
rm client.csr
