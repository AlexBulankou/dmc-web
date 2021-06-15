
resource "google_bigquery_dataset" "bigquerydataset" {
  default_table_expiration_ms = 36000000
  location = "us-west1"
  dataset_id = "bigquerydataset"
  project = ["PROJECT_ID"]
}

resource "google_bigquery_table" "bigquerytable" {
  labels = {
    data-source = "external"
    schema-type = "auto-junk"
  }
  dataset_id = "bigquerydataset"
  project = ["PROJECT_ID"]
  table_id = "bigquerytable"

  depends_on = [
    google_bigquery_dataset.bigquerydataset
  ]
}
