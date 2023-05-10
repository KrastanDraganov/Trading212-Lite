import cors from "cors";
import express, { Express, Request, Response } from "express";

const app: Express = express();
const port = 8082;

const providerUrl = "https://trading212-tgvlmhdopa-lm.a.run.app";

app.use(express.json());
app.use(cors());

app.get("/", async (req: Request, res: Response) => {
	const providerResponse = await fetch(providerUrl);

	if (!providerResponse.ok) {
		return res.status(400).json({ type: "Can't connect to the server" });
	}

	console.log(providerResponse);

	res.send("Welcome to Trading212 quotes provider :))");
});

app.get("/instruments", async (req: Request, res: Response) => {
	const providerResponse = await fetch(`${providerUrl}/instruments`);

	const instrumentsJSON = await providerResponse.json();

	res.json(instrumentsJSON);
});

app.get("/instruments/:ticker", async (req: Request, res: Response) => {
	const tickerName = req.params.ticker;

	const providerResponse = await fetch(
		`${providerUrl}/instruments/${tickerName}`
	);

	const tickerInfo = await providerResponse.json();

	if (tickerInfo.error) {
		return res.status(400).json({ type: tickerInfo.error });
	}

	res.json(tickerInfo);
});

app.listen(port, () => {
	console.log(
		`⚡️[server]: Customer Service is running at http://localhost:${port}`
	);
});
