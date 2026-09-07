import app from "./application/app";

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server ready on http://localhost:${PORT}`);
});
