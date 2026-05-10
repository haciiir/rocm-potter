#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
    echo "Usage: $0 <vm-ip>"
    exit 1
fi

IP="$1"
KEY="/home/saad/repos/personal/mwkan"
SRC="/home/saad/repos/personal/lablab/amd-hackathon/rocm-potter"
ARCHIVE="/tmp/rocm-potter.tar.gz.gpg"
REMOTE_DIR="/root/rocm-potter"

echo "=> Packaging rocm-potter (excluding README.md, kernels/, .git/, node_modules/, docs/)..."
tar czf - -C "$SRC" \
    --exclude='README.md' \
    --exclude='kernels' \
    --exclude='.git' \
    --exclude='data.zip' \
    --exclude='TODO.md' \
    --exclude='ship.sh' \
    --exclude='node_modules' \
    --exclude='docs' \
    . | gpg --batch --yes --symmetric --cipher-algo AES256 --passphrase-file "$KEY" -o "$ARCHIVE"

echo "=> Copying to root@${IP}:/tmp/..."
scp -i "$KEY" -o StrictHostKeyChecking=no "$ARCHIVE" "root@${IP}:/tmp/rocm-potter.tar.gz.gpg"

echo "=> Copying key to remote for decryption..."
scp -i "$KEY" -o StrictHostKeyChecking=no "$KEY" "root@${IP}:/tmp/mwkan"
chmod 600 /tmp/mwkan 2>/dev/null || true

echo "=> Unpacking on remote..."
ssh -i "$KEY" -o StrictHostKeyChecking=no "root@${IP}" bash -s <<REMOTE
mkdir -p ${REMOTE_DIR}
gpg --batch --yes --passphrase-file /tmp/mwkan \
    -d /tmp/rocm-potter.tar.gz.gpg | tar xzf - -C ${REMOTE_DIR}
rm -f /tmp/rocm-potter.tar.gz.gpg /tmp/mwkan
echo "=> Done. Files at ${REMOTE_DIR}:"
ls -la ${REMOTE_DIR}/
REMOTE

rm -f "$ARCHIVE"
echo "=> Local cleanup done."
