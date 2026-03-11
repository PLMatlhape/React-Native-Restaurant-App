// ============================================
// Coffee Shop Backend - Stripe Payment Server
// ============================================
// Simple Express server that handles:
// - Creating Stripe PaymentIntents (securely with secret key)
// - Logging all transactions to a local JSON file
// - Providing transaction history / analytics endpoints
// ============================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
const fs = require("fs");
const path = require("path");

// ---- CONFIG ----
const PORT = process.env.PORT || 3001;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.error("❌ STRIPE_SECRET_KEY is not set in .env");
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY);
const app = express();

// ---- MIDDLEWARE ----
app.use(cors());
app.use(express.json());

// ---- TRANSACTION LOG ----
const TX_LOG_FILE = path.join(__dirname, "transactions.json");

function readTransactions() {
  try {
    if (fs.existsSync(TX_LOG_FILE)) {
      const data = fs.readFileSync(TX_LOG_FILE, "utf8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading transactions:", err.message);
  }
  return [];
}

function saveTransactions(transactions) {
  try {
    fs.writeFileSync(TX_LOG_FILE, JSON.stringify(transactions, null, 2));
  } catch (err) {
    console.error("Error saving transactions:", err.message);
  }
}

function logTransaction(tx) {
  const transactions = readTransactions();
  transactions.unshift(tx); // newest first
  saveTransactions(transactions);
  return tx;
}

// ============================================
// ROUTES
// ============================================

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "Coffee Shop Payment Server",
    version: "1.0.0",
    time: new Date().toISOString(),
  });
});

// ---- CREATE PAYMENT INTENT ----
app.post("/api/payments/create-intent", async (req, res) => {
  try {
    const { amount, currency = "zar", metadata = {} } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Convert to cents (Stripe expects smallest currency unit)
    const amountInCents = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: {
        source: "coffee_shop_app",
        ...metadata,
      },
    });

    // Log the intent creation
    logTransaction({
      id: paymentIntent.id,
      type: "payment_intent_created",
      amount,
      amountInCents,
      currency,
      status: paymentIntent.status,
      metadata,
      createdAt: new Date().toISOString(),
    });

    console.log(
      `✅ PaymentIntent created: ${paymentIntent.id} for R${amount.toFixed(2)}`,
    );

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    console.error("❌ PaymentIntent error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ---- CONFIRM / CAPTURE A PAYMENT (update status after client confirms) ----
app.post("/api/payments/confirm", async (req, res) => {
  try {
    const { paymentIntentId, orderId, userId, userName, items } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: "paymentIntentId is required" });
    }

    // Retrieve the payment intent from Stripe to get its current status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Log the completed transaction
    const tx = logTransaction({
      id: paymentIntent.id,
      type: "payment_completed",
      amount: paymentIntent.amount / 100,
      amountInCents: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      paymentMethod: paymentIntent.payment_method_types?.[0] || "card",
      orderId: orderId || null,
      userId: userId || null,
      userName: userName || null,
      items: items || [],
      receiptUrl: paymentIntent.charges?.data?.[0]?.receipt_url || null,
      createdAt: new Date().toISOString(),
    });

    console.log(
      `💰 Payment confirmed: ${paymentIntent.id} - R${(paymentIntent.amount / 100).toFixed(2)} [${paymentIntent.status}]`,
    );

    res.json({
      success: paymentIntent.status === "succeeded",
      transaction: tx,
    });
  } catch (err) {
    console.error("❌ Confirm error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ---- LOG CASH PAYMENT ----
app.post("/api/payments/cash", async (req, res) => {
  try {
    const { amount, orderId, userId, userName, items } = req.body;

    const transactionId = `COD-${Date.now().toString(36).toUpperCase()}`;

    const tx = logTransaction({
      id: transactionId,
      type: "cash_payment",
      amount: amount || 0,
      amountInCents: Math.round((amount || 0) * 100),
      currency: "zar",
      status: "completed",
      paymentMethod: "cash",
      orderId: orderId || null,
      userId: userId || null,
      userName: userName || null,
      items: items || [],
      createdAt: new Date().toISOString(),
    });

    console.log(
      `💵 Cash payment logged: ${transactionId} - R${(amount || 0).toFixed(2)}`,
    );

    res.json({
      success: true,
      transactionId,
      transaction: tx,
    });
  } catch (err) {
    console.error("❌ Cash payment error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ---- GET ALL TRANSACTIONS ----
app.get("/api/transactions", (req, res) => {
  const transactions = readTransactions();

  // Optional query filters
  const { type, limit, offset, from, to } = req.query;

  let filtered = transactions;

  if (type) {
    filtered = filtered.filter((tx) => tx.type === type);
  }

  if (from) {
    filtered = filtered.filter(
      (tx) => new Date(tx.createdAt) >= new Date(from),
    );
  }

  if (to) {
    filtered = filtered.filter((tx) => new Date(tx.createdAt) <= new Date(to));
  }

  const total = filtered.length;
  const start = parseInt(offset) || 0;
  const count = parseInt(limit) || 50;
  const page = filtered.slice(start, start + count);

  res.json({
    total,
    offset: start,
    limit: count,
    transactions: page,
  });
});

// ---- GET SINGLE TRANSACTION ----
app.get("/api/transactions/:id", (req, res) => {
  const transactions = readTransactions();
  const tx = transactions.find((t) => t.id === req.params.id);

  if (!tx) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  res.json({ transaction: tx });
});

// ---- ANALYTICS SUMMARY ----
app.get("/api/analytics/summary", (req, res) => {
  const transactions = readTransactions();
  const completed = transactions.filter(
    (tx) => tx.type === "payment_completed" || tx.type === "cash_payment",
  );

  const totalRevenue = completed.reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const cardPayments = completed.filter((tx) => tx.paymentMethod === "card");
  const cashPayments = completed.filter((tx) => tx.paymentMethod === "cash");

  // Daily breakdown (last 7 days)
  const dailyRevenue = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    dailyRevenue[key] = { revenue: 0, orders: 0 };
  }

  completed.forEach((tx) => {
    const key = tx.createdAt?.split("T")[0];
    if (dailyRevenue[key]) {
      dailyRevenue[key].revenue += tx.amount || 0;
      dailyRevenue[key].orders += 1;
    }
  });

  // Top items
  const itemMap = {};
  completed.forEach((tx) => {
    (tx.items || []).forEach((item) => {
      const name = item.name || "Unknown";
      if (!itemMap[name]) {
        itemMap[name] = { name, quantity: 0, revenue: 0 };
      }
      itemMap[name].quantity += item.quantity || 1;
      itemMap[name].revenue += (item.price || 0) * (item.quantity || 1);
    });
  });
  const topItems = Object.values(itemMap)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);

  res.json({
    totalTransactions: completed.length,
    totalRevenue,
    averageOrderValue:
      completed.length > 0 ? totalRevenue / completed.length : 0,
    cardPayments: cardPayments.length,
    cashPayments: cashPayments.length,
    cardRevenue: cardPayments.reduce((s, tx) => s + (tx.amount || 0), 0),
    cashRevenue: cashPayments.reduce((s, tx) => s + (tx.amount || 0), 0),
    dailyRevenue,
    topItems,
  });
});

// ---- RETRIEVE PAYMENT INTENT STATUS FROM STRIPE ----
app.get("/api/payments/:id", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(req.params.id);
    res.json({
      id: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      paymentMethod: paymentIntent.payment_method_types,
      created: new Date(paymentIntent.created * 1000).toISOString(),
    });
  } catch (err) {
    res.status(404).json({ error: "Payment not found" });
  }
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`
  ☕ Coffee Shop Payment Server
  ─────────────────────────────
  Port:    ${PORT}
  Stripe:  ${STRIPE_SECRET_KEY.slice(0, 12)}...${STRIPE_SECRET_KEY.slice(-4)}
  Mode:    ${STRIPE_SECRET_KEY.startsWith("sk_test") ? "TEST" : "LIVE"}
  Time:    ${new Date().toISOString()}

  Endpoints:
    POST /api/payments/create-intent  - Create PaymentIntent
    POST /api/payments/confirm        - Log completed payment
    POST /api/payments/cash           - Log cash payment
    GET  /api/transactions            - List all transactions
    GET  /api/transactions/:id        - Get single transaction
    GET  /api/analytics/summary       - Analytics dashboard data
    GET  /api/payments/:id            - Check Stripe payment status
  `);
});
