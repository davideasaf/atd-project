build: 
	docker build -t atd-graphql-server-dev .

run:
	docker run --rm -it -e DATABASE_URL -p 5000:5000 atd-graphql-server-dev

deploy-image:
	gcloud builds submit --tag gcr.io/crafty-willow-224901/atd-graphql-server .

deploy-with-config:
	gcloud builds submit --config cloudbuild.yaml .