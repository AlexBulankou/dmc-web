gcloud builds submit --config cloudbuild_update_dm_convert.yaml
gsutil cp gs://alexbu-dm-convert-20210511-dm-config/output/output/dm-convert.tar ./
docker load < ./dm-convert.tar 