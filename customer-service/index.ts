import bcrypt from "bcrypt";
import {
	containsOnlyLatinCharacters,
	CountryT,
	isPasswordSecure,
	isValidEmail,
} from "customer-commons";
import express, { Express, Request, Response } from "express";
import session from "express-session";
import { v4 as uuidv4 } from "uuid";
import { CustomerT } from "./models/Customer";
import { Countries } from "./repositories/Countries";
import CustomersFileRepository from "./repositories/Customers";

const app: Express = express();
const port = 8081;

const sessionConfiguration = {
	secret: "onlyCSKA",
	saveUninitialized: true,
	resave: true,
};

declare module "express-session" {
	interface SessionData {
		isAuthenticated: boolean;
	}
}

CustomersFileRepository.init();

app.use(express.json());
app.use(session(sessionConfiguration));

app.get("/", (req: Request, res: Response) => {
	// TO DO - Fix Redirect
	res.status(400).send(":|");
});

app.get("/countries", (req: Request, res: Response) => {
	res.header("Access-Control-Allow-Origin", "*").json(Countries);
});

app.post("/customers", async (req: Request, res: Response) => {
	if (!req.body) {
		return res.status(400).json({ type: "NoPayload" });
	}

	const givenNames: string | undefined = req.body.givenNames;

	if (!givenNames) {
		return res.status(400).json({ type: "MissingGivenNames" });
	}

	if (!containsOnlyLatinCharacters(givenNames)) {
		return res.status(400).json({ type: "InvalidGivenNames" });
	}

	const lastName: string | undefined = req.body.lastName;

	if (!lastName) {
		return res.status(400).json({ type: "MissingLastName" });
	}

	if (!containsOnlyLatinCharacters(lastName)) {
		return res.status(400).json({ type: "InvalidLastName" });
	}

	const email: string | undefined = req.body.email;

	if (!email) {
		return res.status(400).json({ type: "MissingEmail" });
	}
	if (!isValidEmail(email)) {
		return res.status(400).json({ type: "InvalidEmail" });
	}

	const existingCustomer: CustomerT | undefined =
		await CustomersFileRepository.findByEmail(email);

	if (existingCustomer) {
		return res.status(400).json({ type: "EmailAlreadyInUse" });
	}

	const countryCode: string | undefined = req.body.countryCode;

	if (!countryCode) {
		return res.status(400).json({ type: "MissingCountryCode" });
	}

	const country: CountryT | undefined = Countries.find(
		(item) => item.code === countryCode
	);

	if (!country) {
		return res.status(400).json({ type: "UnknownCountry" });
	}
	if (country.support === "none") {
		return res.status(400).json({ type: "CountryNotSupported" });
	}
	if (country.support === "coming-soon") {
		return res.status(400).json({ type: "CountrySupportIsComingSoon" });
	}

	const password: string | undefined = req.body.password;

	if (!password) {
		return res.status(400).json({ type: "MissingPassword" });
	}
	if (!isPasswordSecure(password)) {
		return res.status(400).json({ type: "PasswordNotSecureEnough" });
	}

	const hashedPassword: string = await bcrypt.hash(password, 10);

	const customerID = uuidv4();

	const newCustomer = await CustomersFileRepository.add({
		id: customerID,
		givenName: givenNames,
		lastName: lastName,
		email: email,
		password: hashedPassword,
		countryCode: countryCode,
	});

	req.session.isAuthenticated = true;

	res.json({
		id: newCustomer.id,
		email: newCustomer.email,
		countryCode: newCustomer.countryCode,
	});
});

app.post("/login", async (req: Request, res: Response) => {
	if (!req.body) {
		return res.status(400).json({ type: "NoPayload" });
	}

	const email: string | undefined = req.body.email;

	if (!email) {
		return res.status(400).json({ type: "MissingEmail" });
	}

	const customer: CustomerT | undefined =
		await CustomersFileRepository.findByEmail(email);

	if (!customer) {
		return res.status(401).json({ type: "NoCustomerWithThisEmail" });
	}

	const password: string | undefined = req.body.password;

	if (!password) {
		return res.status(400).json({ type: "MissingPassword" });
	}

	const arePasswordsSame: boolean = await bcrypt.compare(
		password,
		customer.password
	);

	if (!arePasswordsSame) {
		return res.status(401).json({ type: "IncorrectPassword" });
	}

	req.session.isAuthenticated = true;

	res.json({
		id: customer.id,
		email: customer.email,
		countryCode: customer.countryCode,
	});
});

app.listen(port, () => {
	console.log(
		`⚡️[server]: Customer Service is running at http://localhost:${port}`
	);
});
