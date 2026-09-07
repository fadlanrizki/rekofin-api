import app from "./application/app";

const PORT = process.env.PORT || 5000;

if (process.env.VERCEL) {
  console.log("🚀 Backend running on Vercel Production");
} else {
  app.listen(PORT, () => {
    console.log(`🚀 Backend running locally on http://localhost:${PORT}`);
  });
}
