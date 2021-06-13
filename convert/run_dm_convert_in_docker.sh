#sudo docker run us-central1-docker.pkg.dev/dm-convert-host/deployment-manager/dm-convert:private-preview --helpshort
sudo docker run  \
    -v /home/alexb/src/github.com/ab/dmc-web/convert:/mnt \
    --rm \
    us-central1-docker.pkg.dev/dm-convert-host/deployment-manager/dm-convert:private-preview \
    --config /mnt/deployment.yaml \
    --project_id [PROJECT_ID] \
    --project_number 0 \
    --output_format TF \
    --quiet \
    --deployment_name [DEPLOYMENT_NAME]


sudo docker run  \
    -v /home/alexb/src/github.com/ab/dmc-web/convert:/mnt \
    --rm \
    us-central1-docker.pkg.dev/dm-convert-host/deployment-manager/dm-convert:private-preview \
    --config /mnt/deployment.yaml \
    --project_id [PROJECT_ID] \
    --project_number 0 \
    --output_format KRM \
    --quiet \
    --deployment_name [DEPLOYMENT_NAME]