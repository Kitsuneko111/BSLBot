FROM 1and1internet/ubuntu-16
COPY ./ ./
RUN apt-get update && apt-get install make
RUN apt-get install build-essential
RUN make ./
CMD node ./main.js
