include .env

start:
	npm run build
	npm run start
dev:
	npm run start:dev
set-webhook:
	curl -X POST "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${HOST_URL}"
get-webhook-info:
	curl "https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo"