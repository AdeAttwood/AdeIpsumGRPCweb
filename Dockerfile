FROM ubuntu:22.04 as builder
LABEL stage=builder

## Install any packages we can from apt
RUN apt-get update && apt-get install -y curl make build-essential protobuf-compiler

## Install rustc
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

## Install nodejs
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
RUN . /root/.bashrc; nvm install node
RUN . /root/.bashrc; npm install --global yarn

## Install the grpc-web proto generator
RUN curl https://github.com/grpc/grpc-web/releases/download/1.3.1/protoc-gen-grpc-web-1.3.1-linux-x86_64 --output /usr/local/bin/protoc-gen-grpc-web
RUN chmod +x /usr/local/bin/protoc-gen-grpc-web

COPY . /build

WORKDIR /build
RUN . /root/.bashrc; make all
