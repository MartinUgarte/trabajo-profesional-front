import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (!id || Array.isArray(id)) {
        res.status(400).json({ error: 'Missing or invalid "id" query parameter' });
        return;
    }

    const url = `https://drive.google.com/thumbnail?id=${id}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            res.status(response.status).send('Error fetching image');
            return;
        }

        const imageBuffer = await response.arrayBuffer();
        res.setHeader('Content-Type', 'image/jpeg');
        res.status(200).send(Buffer.from(imageBuffer));
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).send('Internal Server Error');
    }
}
