import json
import os
import urllib.request
from datetime import datetime, timezone
from typing import Optional
from uuid import NAMESPACE_URL, UUID, uuid5

from cryptography.hazmat.backends import default_backend
from cryptography.x509 import load_pem_x509_certificate
from jose import jwt

IN_LAMBDA = os.getenv("AWS_LAMBDA_FUNCTION_NAME") is not None
FIREBASE_PROJECT_ID = os.getenv("FIREBASE_PROJECT_ID")
if FIREBASE_PROJECT_ID is None:
    raise ValueError("'FIREBASE_PROJECT_ID' environment variable not set")


def get_firebase_cert_map():
    CERTS_URL = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"
    with urllib.request.urlopen(CERTS_URL) as f:
        certs = json.loads(f.read().decode("utf-8"))
    return certs  # dict {kid: x509 cert PEM string}


def firebase_uid_to_uuid(firebase_uid: str) -> UUID:
    return uuid5(NAMESPACE_URL, f"https://firebase.google.com/uid/{firebase_uid}")


def get_user_id_from_authorization(authorization: str) -> Optional[str]:
    token = authorization.split(" ")[1]
    # Skip verification if in Lambda behind APIGW
    if IN_LAMBDA:
        verify_jwt = False
    else:
        verify_jwt = True

    firebase_uid = _verify_token_and_get_uid(token, verify_jwt)
    return firebase_uid_to_uuid(firebase_uid)


def _verify_token_and_get_uid(token: str, verify_jwt=True) -> Optional[str]:
    if verify_jwt:
        certs = get_firebase_cert_map()
        headers = jwt.get_unverified_headers(token)
        kid = headers.get("kid")
        if not kid or kid not in certs:
            print("Public cert not found for given kid")
            return None

        cert_pem = certs[kid]
        cert = load_pem_x509_certificate(cert_pem.encode("utf-8"), default_backend())
        public_key = cert.public_key()

        try:
            claims = jwt.decode(
                token,
                public_key,
                algorithms=["RS256"],
                audience=FIREBASE_PROJECT_ID,
                issuer=f"https://securetoken.google.com/{FIREBASE_PROJECT_ID}",
            )
        except Exception as e:
            print(f"JWT decode/verify failed: {e}")
            return None
    else:
        claims = jwt.get_unverified_claims(token)

    # Verify expiry manually (just in case)
    expiry = datetime.fromtimestamp(claims["exp"], tz=timezone.utc)
    if expiry < datetime.now(timezone.utc):
        print(f"Token expired at {expiry.isoformat()}")
        return None

    return claims.get("user_id")


if __name__ == "__main__":
    from getpass import getpass

    token = getpass("Paste Firebase token: ")
    uid = _verify_token_and_get_uid(token)
    print(f"UID: {uid}")
