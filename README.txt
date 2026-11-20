AMAKA AI v0.1 — PHONE-ONLY SETUP

WHAT THIS VERSION DOES
- Installable web app when hosted on HTTPS.
- Text chat with a small local command brain.
- Speech input where browser speech recognition is supported.
- Spoken replies using Android/browser text-to-speech.
- Local memories saved in this browser on this device.
- Offline access to the app shell after first successful load.

IMPORTANT LIMITATIONS
- This is NOT yet connected to ChatGPT or another cloud AI model.
- Speech recognition support varies by browser and may require internet.
- The selected male voice depends on voices installed on Android. If no male voice is available, install another voice in Android Text-to-speech settings.
- Local memories stay in this browser profile. Clearing browser data may erase them.
- Do not store passwords, financial credentials or sensitive personal information.

RECOMMENDED PHONE-ONLY DEPLOYMENT
1. Extract this ZIP on your phone using Files / ZArchiver.
2. Create a GitHub account or sign in at https://github.com.
3. In Chrome, create a new public repository named amaka-ai.
4. Open the repository, choose Add file > Upload files.
5. Upload index.html, app.js, styles.css, manifest.json, sw.js, icon-192.png and icon-512.png from the extracted folder. Commit the upload.
6. In the repository go to Settings > Pages.
7. Under Build and deployment, choose Deploy from a branch.
8. Select branch main and folder /(root), then Save.
9. Wait for GitHub Pages to publish. Open the Pages URL shown there (usually https://YOUR-USERNAME.github.io/amaka-ai/).
10. In Chrome open the published URL, tap ⋮ > Add to Home screen (or Install app, if offered).
11. Launch AMAKA AI from your home screen. Allow microphone permission when asked.

TEST IT
- Tap the microphone and say: "What time is it?"
- Type: "Remember that I am building AMAKA AI."
- Tap MEMORY to see the saved note.
- Type: "Show my notes".
- Open SETTINGS and select an available voice.

IF MICROPHONE DOES NOT WORK
- Make sure you opened the HTTPS GitHub Pages URL, not a local file.
- Use Google Chrome.
- Tap the site controls icon near the address bar > Permissions > Microphone > Allow.
- Check Android Settings > Apps > Chrome > Permissions > Microphone.
- Some Android speech recognition services require internet access.

NEXT DEVELOPMENT STAGE
Connect a cloud AI through a secure backend. Never put a private API key in app.js or any public GitHub repository.
