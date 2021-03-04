import * as express from "express";

import * as morgan from "morgan";
import * as cors from "cors";
import * as compression from "compression";
import * as helmet from "helmet";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.set("trust proxy", 1);
app.disable("x-powered-by");

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(cors());
app.use(compression());
app.use(helmet());

app.use("/", require("./routes/user.route").default);

export default app;
