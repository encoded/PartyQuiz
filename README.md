# PartyQuiz

This is a party quiz game app. The **Host** runs the server and the **Client** connects to it via WebSocket. This README explains how to set up and run the server locally on your machine.


### 🧑‍💻 Requirements

Before you begin, ensure you have the following installed:

- **Node.js**: [Download and Install Node.js](https://nodejs.org/)
- **npm** (comes with Node.js)

---

## 🎮 Running the Server Locally

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

## 🚀 Next Step: Host Your Server on Render

The next step would be to host your PartyQuiz server on **Render**. By deploying to Render, you can:

- Make the game accessible to anyone, anywhere.
- Avoid having to rely on a local machine for hosting.
- Benefit from easy scaling, automatic updates, and security features.

Just follow the simple steps to deploy your server on Render, and you’re ready to play with friends online! 🎉

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ℹ️ Note

This app was designed for fun and educational purposes. Enjoy the quiz, invite your friends, and have a blast! If you run into any issues or have suggestions, feel free to open an issue on GitHub.
