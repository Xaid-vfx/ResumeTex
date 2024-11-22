import express from 'express';
import cors from 'cors';
import { generatePDF } from './route';
import { NextResponse } from 'next/server';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:3000',
    ],
    credentials: true
}));

app.use(express.json());

app.post('/api/generate-pdf', async (req, res) => {
    try {
        const response = await generatePDF(req as any);

        if (response instanceof NextResponse) {
            const data = await response.blob();
            res.setHeader('Content-Type', 'application/pdf');
            res.send(Buffer.from(await data.arrayBuffer()));
        } else {
            res.status(500).json({ error: 'Invalid response format' });
        }
    } catch (error) {
        console.error('PDF generation error:', error);
        res.status(500).json({ error: 'PDF generation failed' });
    }
});

app.listen(port, () => {
    console.log(`PDF generation service running on port ${port}`);
}); 