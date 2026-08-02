import React, { useState, useEffect } from "react";

function App() {
  // State for login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");

  // State for clock, records, form
  const [currentTime, setCurrentTime] = useState(new Date());
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    script: "",
    qty: "",
    unitCost: "",
    operation: "Buy",
    orderDTL: "",
    settlementDTL: "",
    description: "",
    recordedDTL: "",
    SN: "",
  });

  // State for date & time with location
  const [dateTimeLoc, setDateTimeLoc] = useState({
    dateTime: "",
    latitude: null,
    longitude: null,
    location: "",
  });

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationName = `Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`;
          setDateTimeLoc({
            dateTime: new Date().toLocaleString(),
            latitude,
            longitude,
            location: locationName,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setDateTimeLoc({
            dateTime: new Date().toLocaleString(),
            latitude: null,
            longitude: null,
            location: "Location access denied",
          });
        }
      );
    } else {
      setDateTimeLoc({
        dateTime: new Date().toLocaleString(),
        latitude: null,
        longitude: null,
        location: "Geolocation not supported",
      });
    }
  }, [currentTime]);

  // Handle login form change
  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  // Handle login submit
 const handleLogin = (e) => {
    e.preventDefault();
    const { email, password } = loginForm;
    if (
      email === "gautam.unish007@gmail.com" &&
      password === "@Everest123"
    ) {
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Invalid email or password");
    }
  };

  // Generate unique order ID
 const generateOrderId = () => {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${day}-${month}-${year}-${random}`;
  };

  // Handle form input changes
 const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission with validation
 const handleSubmit = (e) => {
    e.preventDefault();

    const qty = Number(form.qty);
    const unitCost = Number(form.unitCost);
    const total = qty * unitCost;

    const lastRecord = records[records.length - 1];
    let openingBalance = lastRecord ? lastRecord.closingBalance : 0;

    const snNumber = parseInt(form.SN);

    if (form.operation === "Buy" && snNumber === 0) {
      openingBalance = 0;
    }

    let newClosingBalance =
      form.operation === "Buy"
        ? openingBalance + total
        : openingBalance - total;

    if (form.operation === "Sell") {
      if (total > openingBalance) {
        alert("There is insufficient balance in your account");
        return;
      }
    }

    if (form.operation === "Buy" && newClosingBalance < 0) {
      alert("There is insufficient balance in your account");
      return;
    }

    const currentQty = form.operation === "Buy" ? qty : -qty;

    const newRecord = {
      script: form.script,
      SN: form.SN,
      qty: qty,
      unitCost: unitCost,
      total: total,
      operation: form.operation,
      orderDTL: form.orderDTL,
      settlementDTL: form.settlementDTL,
      description: form.description,
      recordedDTL: form.recordedDTL,
      orderId: generateOrderId(),
      openingBalance: openingBalance,
      currentQty: currentQty,
      currentUnit: unitCost,
      currentTotal: total,
      currentStatusTime: new Date().toLocaleString(),
      closingBalance: newClosingBalance,
    };

    setRecords([...records, newRecord]);

    // Reset form
    setForm({
      script: "",
      qty: "",
      unitCost: "",
      operation: "Buy",
      orderDTL: "",
      settlementDTL: "",
      description: "",
      recordedDTL: "",
      SN: "",
    });
  };

  const totalBalance =
    records.length > 0
      ? records[records.length - 1].closingBalance
      : 0;

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginForm({ email: "", password: "" });
  };

  if (!isLoggedIn) {
    // Login page
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background:
            "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
          fontFamily: "Arial, sans-serif",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.9)",
            padding: "40px",
            borderRadius: "15px",
            maxWidth: "400px",
            width: "100%",
            boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              marginBottom: "20px",
              color: "#4B0082",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            Stock Market Portfolio Management System
          </h1>
          <form
            onSubmit={handleLogin}
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={loginForm.email}
              onChange={handleLoginChange}
              required
              style={{
                padding: "12px",
                marginBottom: "15px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "16px",
              }}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={handleLoginChange}
              required
              style={{
                padding: "12px",
                marginBottom: "15px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "16px",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "12px",
                backgroundColor: "#8A2BE2",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) =>
                (e.target.style.backgroundColor = "#6A0DAD")
              }
              onMouseOut={(e) =>
                (e.target.style.backgroundColor = "#8A2BE2")
              }
            >
              Login
            </button>
          </form>
          {loginError && (
            <p
              style={{
                color: "red",
                textAlign: "center",
                marginTop: "15px",
                fontWeight: "bold",
              }}
            >
              {loginError}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Main app after login
  return (
    <div className="container">
      {/* Header with Nepal Flag, title, date/time with location, and logout */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          backgroundColor: "#4B0082",
          position: "relative",
        }}
      >
        {/* Nepal Flag on Top Left */}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/9/9b/Flag_of_Nepal.svg"
          alt="Nepal Flag"
          style={{
            width: "50px",
            height: "30px",
            position: "absolute",
            top: "10px",
            left: "10px",
            objectFit: "contain",
            border: "1px solid #fff",
            borderRadius: "3px",
          }}
        />

        <h1
          style={{
            margin: 0,
            color: "red",
            fontSize: "24px",
            textAlign: "center",
            width: "100%",
            position: "relative",
            zIndex: 1,
          }}
        >
          Stock Market Portfolio Management System
        </h1>

        {/* Date & Time with Location at top right */}
        <div
          style={{
            position: "absolute",
            right: "120px",
            top: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            fontSize: "14px",
            color: "white",
            lineHeight: "1.2",
          }}
        >
          <div>
            <strong>Date & Time:</strong> {dateTimeLoc.dateTime}
          </div>
          <div>
            <strong>Location:</strong> {dateTimeLoc.location}
          </div>
        </div>
        {/* Logout button at top right */}
        <button
          onClick={handleLogout}
          style={{
            position: "absolute",
            right: "20px",
            top: "20px",
            padding: "8px 16px",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            transition: "background-color 0.3s",
            zIndex: 2,
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#c0392b")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#e74c3c")}
        >
          Logout
        </button>
      </div>

      {/* Dashboard Cards */}
      <div
        className="dashboard"
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "20px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            backgroundColor: "#3498db",
            padding: "20px",
            borderRadius: "10px",
            width: "200px",
            color: "white",
            textAlign: "center",
            margin: "10px",
          }}
        >
          <h3>Total Sells Of Shares</h3>
          <h2>
            {records
              .filter((r) => r.operation === "Sell")
              .reduce((sum, r) => sum + r.total, 0)
              .toFixed(2)}
          </h2>
        </div>
        <div
          style={{
            backgroundColor: "#2ecc71",
            padding: "20px",
            borderRadius: "10px",
            width: "200px",
            color: "white",
            textAlign: "center",
            margin: "10px",
          }}
        >
          <h3>Total Buys Of Shares</h3>
          <h2>
            {records
              .filter((r) => r.operation === "Buy")
              .reduce((sum, r) => sum + r.total, 0)
              .toFixed(2)}
          </h2>
        </div>
        <div
          style={{
            backgroundColor: "#f39c12",
            padding: "20px",
            borderRadius: "10px",
            width: "200px",
            color: "white",
            textAlign: "center",
            margin: "10px",
          }}
        >
          <h3>Total Entries</h3>
          <h2>{records.length}</h2>
        </div>
        <div
          style={{
            backgroundColor: "#e74c3c",
            padding: "20px",
            borderRadius: "10px",
            width: "200px",
            color: "white",
            textAlign: "center",
            margin: "10px",
          }}
        >
          <h3>Total Balance</h3>
          <h2>{totalBalance.toFixed(2)}</h2>
        </div>
      </div>

      {/* Input Form */}
      <form
        className="form"
        onSubmit={handleSubmit}
        style={{
          padding: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        {/* First row inputs */}
        <input
          name="script"
          placeholder="Scrip"
          value={form.script}
          onChange={handleChange}
          required
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "150px",
          }}
        />
        <input
          name="SN"
          placeholder="SN (0 for collateral)"
          value={form.SN}
          onChange={handleChange}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "150px",
          }}
        />
        <input
          name="qty"
          type="number"
          placeholder="Qty"
          value={form.qty}
          onChange={handleChange}
          required
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "100px",
          }}
        />
        <input
          name="unitCost"
          type="number"
          placeholder="Unit Cost"
          value={form.unitCost}
          onChange={handleChange}
          required
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "100px",
          }}
        />
        <select
          name="operation"
          value={form.operation}
          onChange={handleChange}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "120px",
          }}
        >
          <option>Buy</option>
          <option>Sell</option>
        </select>
        {/* Total Amount (readonly) */}
        <input
          readOnly
          value={
            form.qty && form.unitCost
              ? (Number(form.qty) * Number(form.unitCost)).toFixed(2)
              : ""
          }
          placeholder="Total Amount"
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "150px",
          }}
        />
        {/* Other inputs */}
        <input
          name="orderDTL"
          placeholder="Ordered Date Time And Location"
          value={form.orderDTL}
          onChange={handleChange}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "200px",
          }}
        />
        <input
          name="settlementDTL"
          placeholder="Settlement Date Time And Location"
          value={form.settlementDTL}
          onChange={handleChange}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "200px",
          }}
        />
        {/* Readonly Order ID */}
        <input
          readOnly
          value={generateOrderId()}
          placeholder="Order ID"
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "200px",
          }}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "300px",
            height: "80px",
          }}
        />
        <input
          name="recordedDTL"
          placeholder="Recorded Date Time And Location"
          value={form.recordedDTL}
          onChange={handleChange}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "200px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#8A2BE2",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            marginTop: "10px",
          }}
        >
          Submit
        </button>
      </form>

      {/* Data Table */}
      <div className="tableContainer" style={{ padding: "20px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>SN</th>
              <th style={tableHeaderStyle}>Opening Balance</th>
              <th style={tableHeaderStyle}>Script</th>
              <th style={tableHeaderStyle}>
                Before Executing Share Operation
                <br />
                Qty / Unit Cost / Total Cost
              </th>
              <th style={tableHeaderStyle}>Buy/Sell</th>
              <th style={tableHeaderStyle}>Ordered Date Time And Location</th>
              <th style={tableHeaderStyle}>Settlement Date Time And Location</th>
              <th style={tableHeaderStyle}>Ordered ID</th>
              <th style={tableHeaderStyle}>
                Execution Of Shares
                <br />
                Qty / Unit Cost / Total Cost
              </th>
              <th style={tableHeaderStyle}>Description</th>
              <th style={tableHeaderStyle}>
                Current Status
                <br />
                Qty / Unit Cost / Total Cost / Date
              </th>
              <th style={tableHeaderStyle}>Closing Balance</th>
              <th style={tableHeaderStyle}>Recorded Date Time & Location</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, index) => (
              <tr key={index}>
                <td style={tableCellStyle}>{index + 1}</td>
                <td style={tableCellStyle}>{r.openingBalance.toFixed(2)}</td>
                <td style={tableCellStyle}>{r.script}</td>
                <td style={tableCellStyle}>
                  {r.qty} / {r.unitCost} / {r.total.toFixed(2)}
                </td>
                <td style={tableCellStyle}>{r.operation}</td>
                <td style={tableCellStyle}>{r.orderDTL}</td>
                <td style={tableCellStyle}>{r.settlementDTL}</td>
                <td style={tableCellStyle}>{r.orderId}</td>
                <td style={tableCellStyle}>
                  {r.qty} / {r.unitCost} / {r.total.toFixed(2)}
                </td>
                <td style={tableCellStyle}>{r.description}</td>
                <td style={tableCellStyle}>
                  Qty:{r.currentQty}
                  <br />
                  Unit:{r.currentUnit}
                  <br />
                  Total:{r.currentTotal.toFixed(2)}
                  <br />
                  {r.currentStatusTime}
                </td>
                <td style={tableCellStyle}>{r.closingBalance.toFixed(2)}</td>
                <td style={tableCellStyle}>{r.recordedDTL}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Styles for table headers and cells
const tableHeaderStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  backgroundColor: "#8A2BE2",
  color: "white",
  textAlign: "center",
};

const tableCellStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "center",
};

export default App;