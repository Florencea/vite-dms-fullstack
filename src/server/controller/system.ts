import { zodiosContext } from "@zodios/express";
import systemApi from "../../api/system";

const ctx = zodiosContext();

const systemRouter = ctx.router(systemApi);

systemRouter.post("/system/auth", async (req, res) => {
  console.log(req.body);
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "ok",
    data: { token: "xxxxx" },
  });
});

export default systemRouter;
