const express = require('express');
const admin = require('firebase-admin');

// Initialiseren van Express en Firebase Admin
const app = express();

const serviceAccount = require('./serviceAccountKey.json'); // Zorg ervoor dat je het juiste pad opgeeft

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Route om aangepaste claims in te stellen
app.get('/setCustomClaims/:uid', async (req, res) => {
  const uid = req.params.uid;
  console.log('app.get ~ uid:', uid);
  const customClaims = {
    rol: 'admin',
  };

  try {
    await admin.auth().setCustomUserClaims(uid, customClaims);
    res.send('Aangepaste claim succesvol ingesteld');
  } catch (error) {
    res
      .status(500)
      .send('Fout bij het instellen van aangepaste claim: ' + error);
  }
});

// Start de server op een specifieke poort, bijv. 3000
app.listen(3000, () => {
  console.log('Server is gestart op poort 3000');
});
