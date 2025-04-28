export async function GET() {
    const res = await fetch('https://api.datamuse.com/words?sp=?????&max=1000');
    const data = await res.json();

    if (!data.length) {
        return new Response('No words found', { status: 500 });
    }

    const words = data.map(item => item.word.toUpperCase());
    const randomWord = words[Math.floor(Math.random() * words.length)];

    return new Response(JSON.stringify({ word: randomWord }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
