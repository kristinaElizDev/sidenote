FROM golang:1.23

WORKDIR /app

COPY go.mod go.sum .env ./

RUN go mod download

COPY *.go ./

RUN CGO_ENABLED=0 GOOS=linux go build -o /sidenote

EXPOSE 4000

CMD ["/sidenote"]
