"""
Cloudflare R2 storage service — S3-compatible.
All file access goes through signed URLs with 15-min expiry.
"""
import boto3
from botocore.config import Config as BotoConfig
from botocore.exceptions import ClientError

from app.core.config import get_settings

settings = get_settings()


def _get_r2_client():
    """Create a boto3 S3 client configured for R2."""
    if not settings.R2_ACCESS_KEY_ID or not settings.R2_ENDPOINT_URL:
        return None

    return boto3.client(
        "s3",
        endpoint_url=settings.R2_ENDPOINT_URL,
        aws_access_key_id=settings.R2_ACCESS_KEY_ID,
        aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
        config=BotoConfig(
            signature_version="s3v4",
            region_name="auto",
        ),
    )


def upload_to_r2(key: str, data: bytes, content_type: str = "application/octet-stream") -> str:
    """Upload bytes to R2. Returns the object key."""
    client = _get_r2_client()
    if not client:
        raise RuntimeError("R2 storage not configured")

    client.put_object(
        Bucket=settings.R2_BUCKET_NAME,
        Key=key,
        Body=data,
        ContentType=content_type,
    )
    return key


def generate_r2_signed_url(key: str, expires_in: int | None = None) -> str:
    """
    Generate a pre-signed download URL for an R2 object.
    Default expiry: 15 minutes (900 seconds).
    Never return permanent public URLs.
    """
    if expires_in is None:
        expires_in = settings.SIGNED_URL_EXPIRY_SECONDS

    client = _get_r2_client()
    if not client:
        raise RuntimeError("R2 storage not configured")

    try:
        url = client.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": settings.R2_BUCKET_NAME,
                "Key": key,
            },
            ExpiresIn=expires_in,
        )
        return url
    except ClientError as e:
        raise RuntimeError(f"Failed to generate signed URL: {e}")


def delete_from_r2(key: str) -> None:
    """Delete an object from R2."""
    client = _get_r2_client()
    if not client:
        return

    try:
        client.delete_object(
            Bucket=settings.R2_BUCKET_NAME,
            Key=key,
        )
    except ClientError:
        pass  # Best-effort deletion
