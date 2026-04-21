FROM mcr.microsoft.com/playwright:v1.48.0-jammy

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY src ./src

RUN useradd -m app && chown -R app:app /app
USER app

EXPOSE 3000

CMD ["node", "src/server.js"]
