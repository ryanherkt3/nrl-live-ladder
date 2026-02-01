import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;

    const comp = searchParams.get('comp');
    const compRounds = searchParams.get('rounds');

    if (!compRounds || !comp || isNaN(parseInt(compRounds)) || isNaN(parseInt(comp))) {
        return new Response(JSON.stringify({ 'error': 'Invalid arguments' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Make nrl.com think I am not a bot
    // eslint-disable-next-line max-len
    const uaString = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

    const rounds = [];

    for (let i = 1; i < parseInt(compRounds); i++) {
        const apiUrl = `https://www.nrl.com/draw/data?competition=${comp}&round=${String(i)}`;

        const roundData = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'user-agent': uaString,
            }
        });

        const roundDataResult: unknown = await roundData.json();

        rounds.push(roundDataResult);
    }

    return new Response(JSON.stringify({ 'success': true, 'data': rounds }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
