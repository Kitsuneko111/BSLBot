FROM arm64
COPY ./ ./
RUN make ./
CMD node ./main.js
