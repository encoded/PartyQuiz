# PartyQuiz

The app is live at [PartyQuiz🎉](https://encoded.github.io/PartyQuiz)!

At the moment the app will connect to a server hosted on **Render**.
[More info](#hosting-server-on-render)

However, a local server must still be run to play the game. Please follow the instructions in the section: [Run the Server](#3-run-the-server).

Once the server is running, you can launch the app.  
The machine running the server should join as the **Host**, sharing a screen visible to all players.  
Other players, using their own devices, can join as **Clients**.

This README explains how to set up and run the server locally on your machine.


### 🧑‍💻 Requirements

Before you begin, ensure you have the following installed:

- **Node.js**: [Download and Install Node.js](https://nodejs.org/)
- **npm** (comes with Node.js)

---

## 🎮 Running the Server Locally

> ⚠️ By default, the app connects to the Render-hosted server.  
> To use your local server instead, set the `USE_LOCAL_SERVER` environment variable to `true` before running the app.

### 1. Navigate to the Host Folder

Your WebSocket server is located in the `server` folder. Open your terminal or command prompt, and navigate to that directory.

```bash
cd PartyQuiz/server
```

### 2. Install Dependencies

Run the necessary command to install all required dependencies, including `ws` (the WebSocket package).

```bash
npm install
```

### 3. Run the Server

Once the dependencies are installed, start the WebSocket server. This will launch the server, and it will log a message indicating that the WebSocket server is running.

```bash
npm start
```

---

## 🏗️ Building PartyQuizApp

Navigate to the directory of the expo app. 

```bash
cd PartyQuiz/PartyQuizApp
```

### 🧪 For Testing

To launch the development server:
```bash
npm start
```

### 🚀 Deploying to Platforms

To build the app for different platforms:

```bash
npx expo run:ios
npx expo run:android
npx expo export --platform web
```

If using EAS Build (recommended for production builds), use:
```bash
npx eas build --platform ios
```

---

# 📱 How the App Works

PartyQuiz has two main parts inside the app: the **Host** screen and the **Client** screen.

## 🎤 The Host

The **Host** screen is just a control panel — it doesn’t actually run the server.

It connects to the server you started earlier and:

- Shows a **QR code** with your IP (so others can scan to join).
- Lists all the players who have connected.

You should open the **Host** screen after you start the server.

> Think of the **Host** like the party leader — they're managing the game, not running the show.

## 🧑‍🤝‍🧑 The Clients (Players)

Everyone else joins as a **Client**.

- They scan the **QR code** or manually enter the **IP** shown on the **Host** screen.
- Then they enter their **name** and tap "Join".
- If the connection works, they’ll see a waiting screen until the game starts!

**Clients** connect over WebSocket — it’s fast, real-time, and perfect for local games.

## 🕹 Example Flow

1. You start the server on your laptop.
2. You open the **Host** screen on your phone.
3. Friends scan the **QR code** on your screen to join the game.
4. Everyone enters their **name** and connects.
5. Once everyone’s in — let the quiz begin! 🎉

---

## Deploying to GitHub Pages

This app is deployed to GitHub Pages, making it accessible as a static website.

### How it Works

The app is hosted on GitHub Pages and can be accessed by visiting:
[PartyQuiz](https://encoded.github.io/PartyQuiz)

Users can directly visit this URL to interact with the app. 
The mobile version can join the game by scanning the QR code displayed on the website.

---

## 🚀 Hosting Server on Render

The PartyQuiz server is hosted on **Render**, which allows players to connect and play from anywhere without needing a local machine running.

### Why Render?

- No local setup needed  
- Accessible from any device, anywhere  
- Easy to deploy and maintain  

### 🛠️ Steps to Deploy

1. **Push the server code to GitHub**  
   Make sure your server lives in a subdirectory like `/server` inside your project repo.

2. **Create a new Web Service on Render**  
   Go to [https://render.com](https://render.com), log in, and select **"New Web Service"**.

3. **Connect your GitHub repo**  
   Choose the repo that contains your server.

4. **Configure the service:**
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js` (or your entry file)
   - **Root Directory:** `server` (or your server folder)
   - **Port:** Make sure your server listens on `process.env.PORT`

5. **Deploy**  
   Click **"Create Web Service"** and wait for it to deploy. Once live, copy the public URL — you’ll use it in the app.

### 🌐 Still Want to Run Locally?

No problem! The app supports both modes. You can:

- Host the server locally by following the [Run the Server](#3-run-the-server) section.
- Toggle between local and remote servers using an environment variable.

> The app is smart enough to switch based on the build context — see the deployment section for details.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ℹ️ Note

This app was designed for fun and educational purposes. Enjoy the quiz, invite your friends, and have a blast! If you run into any issues or have suggestions, feel free to open an issue on GitHub.
