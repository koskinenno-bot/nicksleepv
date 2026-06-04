# Nomad Terminal: The Nick Sleep Investment Framework

**Nomad Terminal** is a professional-grade investment analysis platform inspired by the investment philosophy of the **Nomad Investment Partnership** (Nick Sleep and Qais Zakaria). It combines deep financial engineering with state-of-the-art AI to help investors identify high-quality "compounders" and analyze the robustness of their moats.

---

## 🚀 Key Features

### 1. Advanced Owner's Earnings Calculator
Move beyond GAAP net income. This tool calculates "Owner's Earnings" as defined by Warren Buffett and refined by Nick Sleep.
*   **Normalized Working Capital**: Automatically calculates a 5-10 year average of $\Delta$WC to smooth out cyclicality.
*   **AI-Estimated Maintenance CapEx**: Uses Gemini 3.0 to estimate the portion of CapEx required to maintain current operations vs. growth.
*   **SBC Adjustment**: Treats Stock-Based Compensation as a real economic expense to reflect true shareholder dilution.

### 2. AI-Powered Moat Analysis
Leverages **Google Gemini 3.0** to perform high-level qualitative analysis:
*   **Scale Economics Shared**: Specifically looks for the "Nomad" holy grail—companies that pass savings back to customers to widen their moat.
*   **Management Quality**: Analyzes capital allocation history and long-term orientation.
*   **Moat Robustness Score**: A data-driven qualitative score (1-10) based on competitive positioning.

### 3. Valuation & Returns Matrix
*   **Reverse DCF**: Instead of guessing growth, this tool calculates the "Implied Growth Rate" the market is currently pricing in.
*   **Returns Matrix (CAGR)**: A 6x6 sensitivity matrix showing potential annualized returns based on varying exit multiples and earnings growth scenarios (up to 50%).
*   **Price Sensitivity Curve**: Visualizes intrinsic value across a spectrum of growth expectations.

### 4. Capital Allocation Dashboard
Visualizes the tension between **Moat Widening** (Reinvestment in R&D/CapEx) and **Harvesting** (Dividends/Buybacks).
*   **Yield Analysis**: Real-time calculation of Buyback and Dividend yields relative to historical market caps.
*   **Reinvestment Rates**: Tracks R&D and CapEx as a percentage of revenue over time.

---

## 🛠️ Tech Stack

*   **Frontend**: React 18, TypeScript, Vite
*   **Styling**: Tailwind CSS (Custom "Nomad Dark" theme)
*   **Animations**: `tailwindcss-animate` (for smooth, cinematic UI transitions)
*   **Data Visualization**: Recharts (Customized for financial time-series and sensitivity matrices)
*   **AI Integration**: Google Gemini SDK (`@google/genai`)
*   **State Management**: React Hooks & Context API

---

## 📖 The Philosophy

This project is built on the principles found in the **Nomad Investment Partnership Letters**. It prioritizes:
1.  **The Long View**: 10-year "Destination Analysis" over quarterly earnings.
2.  **Quality of Moat**: Favoring "Scale Economics Shared" over traditional brands or patents.
3.  **Owner's Earnings**: Focusing on cash that can be extracted from the business without harming its competitive position.

---

## ⚙️ Getting Started

### Prerequisites
*   Node.js (v18+)
*   A Google Gemini API Key (Available for free at [Google AI Studio](https://aistudio.google.com/app/apikey))

### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/nomad-terminal.git
    cd nomad-terminal
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

---

## 💼 Professional Use
This application was designed as a showcase of **Full-Stack Financial Engineering**. It demonstrates:
*   Integration of LLMs into specialized domain workflows (Finance).
*   Complex data visualization and mathematical modeling in React.
*   Clean, professional UI/UX design tailored for institutional-grade tools.

---

*Disclaimer: This tool is for educational and research purposes only. It does not constitute financial advice.*
