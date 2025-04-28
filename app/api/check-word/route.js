export async function POST(req) {
    const { word } = await req.json();

    const res = await fetch(`https://api.datamuse.com/words?sp=${word.toLowerCase()}&max=1`);
    const data = await res.json();

    if (data.length > 0 && data[0].word.toLowerCase() === word.toLowerCase()) {
        return new Response(JSON.stringify({ valid: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } else {
        return new Response(JSON.stringify({ valid: false }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
