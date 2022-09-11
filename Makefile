

help: ## Show this help.
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/:.*##/:/' | sort | column

api: ## Build the API binary
	cargo build --release --bin api

client-proto:
	mkdir -p src/client/proto
	protoc -I=proto ./proto/v1/adeipsum.proto \
			--js_out=import_style=commonjs,binary:src/client/proto \
			--grpc-web_out=import_style=commonjs+dts,mode=grpcwebtext:src/client/proto

client: client-proto ## Build the web client 
	yarn install --production
	NODE_ENV=production ./node_modules/.bin/webpack-cli

all: api client ## Build all of the targets

clean: ## Remove all of the build targets
	rm -v ./public/index.html
	rm -vrf ./node_modules
	rm -vrf ./public/assets
	rm -vrf ./src/client/proto
	rm -vrf ./target
