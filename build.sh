#!/bin/bash
# build.sh - Package the docker-top plugin for Unraid

PLUGIN_NAME="docker-top"
VERSION=$(date +%Y.%m.%d)
SOURCE_DIR="source/${PLUGIN_NAME}"
PLUGIN_DIR="plugins/${PLUGIN_NAME}"
ARCHIVE_NAME="${PLUGIN_NAME}.txz"
PLG_FILE="${PLUGIN_NAME}.plg" # Moved to root

echo "Building Unraid Plugin: ${PLUGIN_NAME} v${VERSION}"

# 1. Create the plugin directory
mkdir -p "${PLUGIN_DIR}"

# 2. Create the txz archive
echo "Creating archive ${PLUGIN_DIR}/${ARCHIVE_NAME}..."
cd source
tar -cvJf "../${PLUGIN_DIR}/${ARCHIVE_NAME}" "${PLUGIN_NAME}"
cd ..

# 3. Calculate MD5
echo "Calculating MD5 checksum..."
ARCHIVE_PATH="${PLUGIN_DIR}/${ARCHIVE_NAME}"
if command -v md5 >/dev/null 2>&1; then
    MD5_SUM=$(md5 -q "${ARCHIVE_PATH}")
elif command -v md5sum >/dev/null 2>&1; then
    MD5_SUM=$(md5sum "${ARCHIVE_PATH}" | awk '{print $1}')
else
    echo "Error: No md5 tool found."
    exit 1
fi

echo "MD5: ${MD5_SUM}"

# 3. Update the PLG file
echo "Updating ${PLG_FILE}..."

# Update version entity
sed -i '' "s/ENTITY version   \".*\"/ENTITY version   \"${VERSION}\"/" "${PLG_FILE}"

# Update MD5 entity
echo "Updating MD5 entity in ${PLG_FILE}..."
sed -i '' "s/ENTITY md5       \".*\"/ENTITY md5       \"${MD5_SUM}\"/" "${PLG_FILE}"

echo "Build complete. Ready to distribute."
echo "To install on Unraid, run:"
echo "installplg /boot/config/plugins/${PLUGIN_NAME}/${PLUGIN_NAME}.plg (if local)"
echo "Or use the web UI with the URL to your .plg file."
