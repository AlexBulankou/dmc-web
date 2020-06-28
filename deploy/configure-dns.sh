#!/bin/bash
set -e

export Y_SITE_NAME=gcpdedm.com

# LC_CTYPE=C && find ./dns-resources/  -type f -exec sed -i '' "s/Y_SITE_NAME/${Y_SITE_NAME}/g" {} \;
# to replace back
# LC_CTYPE=C && find ./dns-resources/ -type f -exec sed -i '' "s/${Y_SITE_NAME}/Y_SITE_NAME/g" {} \;

gcloud compute addresses create gcpdedm-ip --global
export EXTERNAL_IP_ADDRESS=$(gcloud compute addresses describe gcpdedm-ip --global | grep address: | awk '{print $2'})


gcloud dns managed-zones create gcpdedm-zone --dns-name="${Y_SITE_NAME}" --description="gcpdedm zone" --visibility=public
gcloud dns record-sets transaction start --zone="gcpdedm-zone"
gcloud dns record-sets transaction add $EXTERNAL_IP_ADDRESS \
  --name="${Y_SITE_NAME}." \
  --ttl="30" \
  --type="A" \
  --zone="gcpdedm-zone"
gcloud dns record-sets transaction execute --zone="gcpdedm-zone"


gcloud dns record-sets transaction start --zone="gcpdedm-zone"
# NOTE: I could not add it as part of the same transaction
gcloud dns record-sets transaction add "${Y_SITE_NAME}." \
  --name="www.${Y_SITE_NAME}." \
  --zone="gcpdedm-zone" \
  --type="CNAME" \
  --ttl="30"
gcloud dns record-sets transaction execute --zone="gcpdedm-zone"

