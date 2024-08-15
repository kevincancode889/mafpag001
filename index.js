const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Log the MongoDB URI to see if it's correctly set
console.log('MONGODB_URI:', process.env.MONGODB_URI);

// Connect to MongoDB Atlas using the connection string from the environment variable
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Define the schema for redirects, including a custom ID field
const redirectSchema = new mongoose.Schema({
    customId: String,  // Custom ID field
    url: String,       // URL field
});

// Create a model based on the schema
const Redirect = mongoose.model('Redirect', redirectSchema);

// Route to handle redirection based on the custom ID and log UTM parameters
app.get('/redirect_custom', async (req, res) => {
    try {
        const customId = req.query.redirect_mongo_id;  // Extract custom ID from query parameters
        const utmSource = req.query.utm_source;        // Extract UTM parameters
        const utmMedium = req.query.utm_medium;
        const utmCampaign = req.query.utm_campaign;

        // Find the document based on custom ID
        const redirectDoc = await Redirect.findOne({ customId: customId });

        if (redirectDoc) {
            // Log UTM parameters
            console.log(`Redirected with UTM - Source: ${utmSource}, Medium: ${utmMedium}, Campaign: ${utmCampaign}`);
            
            // Redirect to the URL specified in the document
            res.redirect(redirectDoc.url);
        } else {
            res.status(404).send('Redirect ID not found');
        }
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
