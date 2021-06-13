export PROJECT_ID=alexbu-dm-convert-20210511
export BUCKET_NAME=$PROJECT_ID-dm-config
export BUCKET_URI=gs://$BUCKET_NAME
export DM_CONVERT_IMAGE="us-central1-docker.pkg.dev/dm-convert-host/deployment-manager/dm-convert:private-preview"

# gsutil mb $BUCKET_URI

# This is where we will store DM configuration to be converted
export DM_CONFIG_URI=$BUCKET_URI/dm

gsutil cp ./deployment.yaml $DM_CONFIG_URI/deployment.yaml

echo Converting KRM...

export KRM_RESOURCES=krm_resources.yaml

gcloud builds submit . --config ./cloudbuild_convert.yaml \
--substitutions=_DM_CONVERT_IMAGE=$DM_CONVERT_IMAGE,_BUCKET_URI=$BUCKET_URI,\
_DEPLOYMENT_NAME=test-conversion-to-krm,\
_OUTPUT_FORMAT=KRM,_OUTPUT_FILE=$KRM_RESOURCES

# Print output file
gsutil cp $BUCKET_URI/output/$KRM_RESOURCES ./$KRM_RESOURCES

echo Converting TF...

export TF_RESOURCES=tf_resources.tf

gcloud builds submit . --config ./cloudbuild_convert.yaml \
--substitutions=_DM_CONVERT_IMAGE=$DM_CONVERT_IMAGE,_BUCKET_URI=$BUCKET_URI,\
_DEPLOYMENT_NAME=test-conversion-to-tf,\
_OUTPUT_FORMAT=TF,_OUTPUT_FILE=$TF_RESOURCES

# Print output file
gsutil cp $BUCKET_URI/output/$TF_RESOURCES ./$TF_RESOURCES
