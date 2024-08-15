const express = require('express');
const mongoose = require('mongoose');
const app = express();

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

// Route to handle redirection using the root URL '/'
app.get('/', async (req, res) => {
    try {
        console.log('Query Object:', req.query);  // Log the entire query object
        const customId = req.query.redirect_mongo_id;  // Extract custom ID from query parameters
        console.log('Received customId:', customId);  // Log the customId received

        if (!customId) {
            return res.status(400).send('Missing customId parameter');
        }

        const redirectDoc = await Redirect.findOne({ customId: customId });

        if (redirectDoc) {
            console.log('Redirect document found:', redirectDoc);
            // Log UTM parameters
            console.log(`Redirected with UTM - Source: ${req.query.utm_source}, Medium: ${req.query.utm_medium}, Campaign: ${req.query.utm_campaign}`);
            
            // Redirect to the URL specified in the document
            return res.redirect(redirectDoc.url);
        } else {
            console.log('No document found for customId:', customId);
            return res.status(404).send('Redirect ID not found');
        }
    } catch (err) {
        console.error('Error occurred:', err);
        return res.status(500).send('Server Error');
    }
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});